<?php
// ============================================================
//  api/projects/detail.php
//  GET    ?project_id=xxx   — full project + members
//  PUT    ?project_id=xxx   — update project (owner only)
//  DELETE ?project_id=xxx   — delete project (owner only)
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user       = requireAuth();
$db         = getDB();
$project_id = $_GET['project_id'] ?? '';

if (!$project_id) error('project_id is required.');

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare('
        SELECT p.*, u.full_name AS owner_name
        FROM projects p
        JOIN users u ON u.user_id = p.owner_student_id
        WHERE p.project_id = ?
    ');
    $stmt->execute([$project_id]);
    $project = $stmt->fetch();
    if (!$project) error('Project not found.', 404);

    $project['required_skills'] = json_decode($project['required_skills'] ?? '[]');
    $project['roles_needed']    = json_decode($project['roles_needed']    ?? '[]');

    // Members
    $mstmt = $db->prepare('
        SELECT tm.membership_id, tm.role, tm.is_leader, tm.joined_at,
               u.user_id, u.full_name, u.department
        FROM team_memberships tm
        JOIN users u ON u.user_id = tm.student_id
        WHERE tm.project_id = ?
    ');
    $mstmt->execute([$project_id]);
    $project['members'] = $mstmt->fetchAll();

    success($project);
}

// ── PUT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $user = requireRole('student');
    $body = getBody();

    // Verify ownership
    $check = $db->prepare('SELECT owner_student_id FROM projects WHERE project_id = ?');
    $check->execute([$project_id]);
    $proj  = $check->fetch();
    if (!$proj) error('Project not found.', 404);
    if ($proj['owner_student_id'] !== $user['user_id']) error('Only the project owner can edit.', 403);

    $db->prepare('
        UPDATE projects SET
            title = ?, description = ?, required_skills = ?,
            team_size_needed = ?, roles_needed = ?, advisor_required = ?, status = ?
        WHERE project_id = ?
    ')->execute([
        $body['title']            ?? '',
        $body['description']      ?? '',
        json_encode($body['required_skills'] ?? []),
        (int)($body['team_size_needed'] ?? 3),
        json_encode($body['roles_needed'] ?? []),
        !empty($body['advisor_required']) ? 1 : 0,
        $body['status']           ?? 'Active',
        $project_id,
    ]);

    success([], 'Project updated.');
}

// ── DELETE ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $user = requireRole('student', 'admin');

    $check = $db->prepare('SELECT owner_student_id FROM projects WHERE project_id = ?');
    $check->execute([$project_id]);
    $proj  = $check->fetch();
    if (!$proj) error('Project not found.', 404);
    if ($user['role'] !== 'admin' && $proj['owner_student_id'] !== $user['user_id']) {
        error('Only the project owner or admin can delete.', 403);
    }

    $db->prepare('DELETE FROM projects WHERE project_id = ?')->execute([$project_id]);
    success([], 'Project deleted.');
}

error('Method not allowed.', 405);
