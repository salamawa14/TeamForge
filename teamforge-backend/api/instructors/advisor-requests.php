<?php
// ============================================================
//  api/instructors/advisor-requests.php
//  GET — list all advisor requests sent to this instructor
//  PUT ?adv_request_id=xxx&action=accept|reject — respond
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('instructor');
$db   = getDB();
$uid  = $user['user_id'];

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = $_GET['status'] ?? null;   // optional filter: Pending / Accepted / Rejected

    $sql = '
        SELECT ar.adv_request_id, ar.project_title, ar.project_type,
               ar.description, ar.status, ar.requested_at, ar.reviewed_at,
               u.full_name AS student_name, u.department AS student_department,
               p.project_id
        FROM advisor_requests ar
        JOIN users u    ON u.user_id    = ar.student_id
        JOIN projects p ON p.project_id = ar.project_id
        WHERE ar.advisor_id = ?
    ';
    $params = [$uid];

    if ($status) {
        $sql .= ' AND ar.status = ?';
        $params[] = $status;
    }

    $sql .= ' ORDER BY ar.requested_at DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    success($stmt->fetchAll());
}

// ── PUT: accept or reject ────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $req_id = $_GET['adv_request_id'] ?? '';
    $action = $_GET['action']         ?? '';

    if (!$req_id || !in_array($action, ['accept','reject'], true)) {
        error('adv_request_id and action (accept|reject) are required.');
    }

    $stmt = $db->prepare('
        SELECT * FROM advisor_requests WHERE adv_request_id = ? AND advisor_id = ?
    ');
    $stmt->execute([$req_id, $uid]);
    $req = $stmt->fetch();

    if (!$req) error('Request not found.', 404);
    if ($req['status'] !== 'Pending') error('This request has already been reviewed.');

    $new_status = $action === 'accept' ? 'Accepted' : 'Rejected';

    $db->prepare('
        UPDATE advisor_requests SET status = ?, reviewed_at = NOW()
        WHERE adv_request_id = ?
    ')->execute([$new_status, $req_id]);

    if ($action === 'accept') {
        // Assign advisor to project
        $db->prepare('
            UPDATE projects SET advisor_id = ? WHERE project_id = ?
        ')->execute([$uid, $req['project_id']]);
    }

    // Notify student
    $msg = $action === 'accept'
        ? $user['full_name'] . ' accepted your advisor request for "' . $req['project_title'] . '".'
        : $user['full_name'] . ' declined your advisor request for "' . $req['project_title'] . '".';

    $db->prepare('
        INSERT INTO notifications (notification_id, user_id, type, message)
        VALUES (?, ?, "advisor_response", ?)
    ')->execute([bin2hex(random_bytes(16)), $req['student_id'], $msg]);

    success([], ucfirst($action) . 'ed successfully.');
}

error('Method not allowed.', 405);
