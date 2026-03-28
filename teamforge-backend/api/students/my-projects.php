<?php
// ============================================================
//  api/students/my-projects.php
//  GET — returns projects owned by + joined by the student
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('GET');
$user = requireRole('student');
$db   = getDB();
$uid  = $user['user_id'];

// Projects this student owns
$owned = $db->prepare('
    SELECT p.project_id, p.title, p.project_type, p.status, p.created_at,
           (SELECT COUNT(*) FROM team_memberships tm WHERE tm.project_id = p.project_id) AS member_count
    FROM projects p
    WHERE p.owner_student_id = ?
    ORDER BY p.created_at DESC
');
$owned->execute([$uid]);

// Projects this student has joined (but doesn't own)
$joined = $db->prepare('
    SELECT p.project_id, p.title, p.project_type, p.status,
           tm.role AS my_role, tm.joined_at,
           u.full_name AS owner_name
    FROM team_memberships tm
    JOIN projects p ON p.project_id = tm.project_id
    JOIN users u    ON u.user_id    = p.owner_student_id
    WHERE tm.student_id = ? AND p.owner_student_id != ?
    ORDER BY tm.joined_at DESC
');
$joined->execute([$uid, $uid]);

success([
    'owned'  => $owned->fetchAll(),
    'joined' => $joined->fetchAll(),
]);
