<?php
// ============================================================
//  api/instructors/advisees.php
//  GET — list all projects (and their members) the instructor advises
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('GET');
$user = requireRole('instructor');
$db   = getDB();
$uid  = $user['user_id'];

// All projects advised by this instructor
$projects = $db->prepare('
    SELECT p.project_id, p.title, p.project_type, p.status, p.created_at,
           u.full_name AS owner_name, u.department AS owner_department
    FROM projects p
    JOIN users u ON u.user_id = p.owner_student_id
    WHERE p.advisor_id = ?
    ORDER BY p.created_at DESC
');
$projects->execute([$uid]);
$projectList = $projects->fetchAll();

// Attach members to each project
foreach ($projectList as &$proj) {
    $mstmt = $db->prepare('
        SELECT u.user_id, u.full_name, u.department,
               tm.role, tm.is_leader, tm.joined_at
        FROM team_memberships tm
        JOIN users u ON u.user_id = tm.student_id
        WHERE tm.project_id = ?
        ORDER BY tm.is_leader DESC, tm.joined_at ASC
    ');
    $mstmt->execute([$proj['project_id']]);
    $proj['members'] = $mstmt->fetchAll();
}

success($projectList);
