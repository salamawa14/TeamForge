<?php
// ============================================================
//  api/students/applications.php
//  GET  — list join requests sent by the logged-in student
//  POST — send a new join request
//  PUT  ?request_id=xxx&action=accept|reject  — leader reviews
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('student');
$db   = getDB();
$uid  = $user['user_id'];

// ── GET: my applications ─────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // "incoming" = requests to my projects
    if (isset($_GET['incoming'])) {
        $stmt = $db->prepare('
            SELECT jr.request_id, jr.status, jr.requested_at, jr.reviewed_at,
                   u.full_name AS applicant_name, u.department,
                   p.title AS project_title, p.project_id
            FROM join_requests jr
            JOIN projects p ON p.project_id   = jr.project_id
            JOIN users    u ON u.user_id       = jr.applicant_id
            WHERE p.owner_student_id = ?
            ORDER BY jr.requested_at DESC
        ');
        $stmt->execute([$uid]);
    } else {
        // outgoing: requests I sent
        $stmt = $db->prepare('
            SELECT jr.request_id, jr.status, jr.requested_at, jr.reviewed_at,
                   p.title AS project_title, p.project_id,
                   u.full_name AS owner_name
            FROM join_requests jr
            JOIN projects p ON p.project_id   = jr.project_id
            JOIN users    u ON u.user_id       = p.owner_student_id
            WHERE jr.applicant_id = ?
            ORDER BY jr.requested_at DESC
        ');
        $stmt->execute([$uid]);
    }

    success($stmt->fetchAll());
}

// ── POST: send join request ──────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = getBody();
    $project_id = $body['project_id'] ?? '';
    if (!$project_id) error('project_id is required.');

    // Can't apply to own project
    $proj = $db->prepare('SELECT owner_student_id, status, team_size_needed FROM projects WHERE project_id = ?');
    $proj->execute([$project_id]);
    $project = $proj->fetch();
    if (!$project) error('Project not found.', 404);
    if ($project['owner_student_id'] === $uid) error('You cannot apply to your own project.');
    if ($project['status'] !== 'Active') error('This project is not accepting applications.');

    // Check team is not already full
    $count = $db->prepare('SELECT COUNT(*) FROM team_memberships WHERE project_id = ?');
    $count->execute([$project_id]);
    if ((int)$count->fetchColumn() >= $project['team_size_needed']) {
        error('This project team is already full.');
    }

    // Duplicate check
    $dup = $db->prepare('SELECT request_id FROM join_requests WHERE project_id = ? AND applicant_id = ?');
    $dup->execute([$project_id, $uid]);
    if ($dup->fetch()) error('You already applied to this project.', 409);

    $request_id = bin2hex(random_bytes(16));
    $db->prepare('
        INSERT INTO join_requests (request_id, project_id, applicant_id)
        VALUES (?, ?, ?)
    ')->execute([$request_id, $project_id, $uid]);

    // Notify project owner
    $owner = $db->prepare('SELECT owner_student_id FROM projects WHERE project_id = ?');
    $owner->execute([$project_id]);
    $owner_id = $owner->fetchColumn();
    $db->prepare('
        INSERT INTO notifications (notification_id, user_id, type, message)
        VALUES (?, ?, "join_request", ?)
    ')->execute([
        bin2hex(random_bytes(16)),
        $owner_id,
        $user['full_name'] . ' has applied to join your project.',
    ]);

    success(['request_id' => $request_id], 'Application sent.', 201);
}

// ── PUT: accept or reject ────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $request_id = $_GET['request_id'] ?? '';
    $action     = $_GET['action']     ?? '';
    if (!$request_id || !in_array($action, ['accept','reject'], true)) {
        error('request_id and action (accept|reject) are required.');
    }

    $stmt = $db->prepare('
        SELECT jr.*, p.owner_student_id, p.team_size_needed
        FROM join_requests jr
        JOIN projects p ON p.project_id = jr.project_id
        WHERE jr.request_id = ?
    ');
    $stmt->execute([$request_id]);
    $req = $stmt->fetch();
    if (!$req) error('Request not found.', 404);
    if ($req['owner_student_id'] !== $uid) error('Only the project leader can review applications.', 403);
    if ($req['status'] !== 'Pending') error('This request has already been reviewed.');

    $new_status = $action === 'accept' ? 'Accepted' : 'Rejected';
    $db->prepare('
        UPDATE join_requests SET status = ?, reviewed_at = NOW() WHERE request_id = ?
    ')->execute([$new_status, $request_id]);

    if ($action === 'accept') {
        // Check team capacity
        $count = $db->prepare('SELECT COUNT(*) FROM team_memberships WHERE project_id = ?');
        $count->execute([$req['project_id']]);
        if ((int)$count->fetchColumn() >= $req['team_size_needed']) {
            error('Team is already full. Cannot accept.');
        }

        $db->prepare('
            INSERT INTO team_memberships (membership_id, project_id, student_id)
            VALUES (?, ?, ?)
        ')->execute([bin2hex(random_bytes(16)), $req['project_id'], $req['applicant_id']]);
    }

    // Notify applicant
    $msg = $action === 'accept'
        ? 'Your application was accepted! You are now a team member.'
        : 'Your application was not accepted this time.';
    $db->prepare('
        INSERT INTO notifications (notification_id, user_id, type, message)
        VALUES (?, ?, "application_update", ?)
    ')->execute([bin2hex(random_bytes(16)), $req['applicant_id'], $msg]);

    success([], ucfirst($action) . 'ed successfully.');
}
// ── DELETE: remove a team member (owner only) ─────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $project_id = $_GET['project_id'] ?? '';
    $student_id = $_GET['student_id'] ?? '';
    if (!$project_id || !$student_id) error('project_id and student_id required.');

    // Verify requester is the project owner
    $check = $db->prepare('SELECT owner_student_id FROM projects WHERE project_id = ?');
    $check->execute([$project_id]);
    $proj = $check->fetch();
    if (!$proj) error('Project not found.', 404);
    if ($proj['owner_student_id'] !== $uid) error('Only the project owner can remove members.', 403);
    if ($student_id === $uid) error('You cannot remove yourself (you are the owner).');

    $db->prepare('DELETE FROM team_memberships WHERE project_id = ? AND student_id = ?')
       ->execute([$project_id, $student_id]);
    success([], 'Member removed.');
}

error('Method not allowed.', 405);
