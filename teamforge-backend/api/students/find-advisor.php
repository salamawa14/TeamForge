<?php
// ============================================================
//  api/students/find-advisor.php
//  GET  — list active advisors (with optional filters)
//  POST — send an advisor request
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('student');
$db   = getDB();
$uid  = $user['user_id'];

// ── GET: list advisors ───────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $search = $_GET['search'] ?? null;

    $sql = '
        SELECT u.user_id, u.full_name, u.department,
               ip.academic_title, ip.areas_of_expertise,
               ip.research_interests, ip.supervised_proj_types, ip.advising_status
        FROM users u
        JOIN instructor_profiles ip ON ip.user_id = u.user_id
        WHERE u.role = "instructor" AND ip.advising_status = "Active"
    ';
    $params = [];

    if ($search) {
        $sql .= ' AND (u.full_name LIKE ? OR u.department LIKE ? OR ip.research_interests LIKE ?)';
        $params = ["%$search%", "%$search%", "%$search%"];
    }

    $sql .= ' ORDER BY u.full_name';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $advisors = $stmt->fetchAll();

    foreach ($advisors as &$a) {
        $a['areas_of_expertise']    = json_decode($a['areas_of_expertise']    ?? '[]');
        $a['supervised_proj_types'] = json_decode($a['supervised_proj_types'] ?? '[]');
    }

    success($advisors);
}

// ── POST: send advisor request ───────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = getBody();
    $project_id = $body['project_id'] ?? '';
    $advisor_id = $body['advisor_id'] ?? '';

    if (!$project_id || !$advisor_id) error('project_id and advisor_id are required.');

    // Verify project ownership
    $proj = $db->prepare('SELECT owner_student_id, title, description, project_type FROM projects WHERE project_id = ?');
    $proj->execute([$project_id]);
    $project = $proj->fetch();
    if (!$project) error('Project not found.', 404);
    if ($project['owner_student_id'] !== $uid) error('You can only request advisors for your own projects.', 403);

    // Verify advisor exists and is active
    $adv = $db->prepare('SELECT ip.advising_status FROM instructor_profiles ip WHERE ip.user_id = ?');
    $adv->execute([$advisor_id]);
    $advisor = $adv->fetch();
    if (!$advisor) error('Advisor not found.', 404);
    if ($advisor['advising_status'] !== 'Active') error('This advisor is currently not accepting requests.');

    // Duplicate check
    $dup = $db->prepare('SELECT adv_request_id FROM advisor_requests WHERE project_id = ? AND advisor_id = ? AND status = "Pending"');
    $dup->execute([$project_id, $advisor_id]);
    if ($dup->fetch()) error('You already have a pending request with this advisor.', 409);

    $req_id = bin2hex(random_bytes(16));
    $db->prepare('
        INSERT INTO advisor_requests
            (adv_request_id, project_id, student_id, advisor_id, project_title, description, project_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ')->execute([
        $req_id,
        $project_id,
        $uid,
        $advisor_id,
        $project['title'],
        $project['description'],
        $project['project_type'],
    ]);

    // Notify advisor
    $db->prepare('
        INSERT INTO notifications (notification_id, user_id, type, message)
        VALUES (?, ?, "advisor_request", ?)
    ')->execute([
        bin2hex(random_bytes(16)),
        $advisor_id,
        $user['full_name'] . ' has requested you to advise their project: ' . $project['title'],
    ]);

    success(['adv_request_id' => $req_id], 'Advisor request sent.', 201);
}

error('Method not allowed.', 405);
