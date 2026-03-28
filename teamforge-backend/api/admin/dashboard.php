<?php
// ============================================================
//  api/admin/dashboard.php
//  GET — platform-wide stats for admin dashboard
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('GET');
requireRole('admin');
$db = getDB();

// Counts
$students    = $db->query('SELECT COUNT(*) FROM users WHERE role = "student"')->fetchColumn();
$instructors = $db->query('SELECT COUNT(*) FROM users WHERE role = "instructor"')->fetchColumn();
$projects    = $db->query('SELECT COUNT(*) FROM projects')->fetchColumn();
$active_proj = $db->query('SELECT COUNT(*) FROM projects WHERE status = "Active"')->fetchColumn();
$requests    = $db->query('SELECT COUNT(*) FROM join_requests WHERE status = "Pending"')->fetchColumn();
$ann_count   = $db->query('SELECT COUNT(*) FROM announcements')->fetchColumn();

// Projects by type
$by_type = $db->query('
    SELECT project_type, COUNT(*) AS count FROM projects GROUP BY project_type
')->fetchAll();

// Recent registrations (last 5 users)
$recent_users = $db->query('
    SELECT user_id, full_name, email, role, department, created_at
    FROM users ORDER BY created_at DESC LIMIT 5
')->fetchAll();

// Recent projects (last 5)
$recent_projects = $db->query('
    SELECT p.project_id, p.title, p.project_type, p.status, p.created_at,
           u.full_name AS owner_name
    FROM projects p JOIN users u ON u.user_id = p.owner_student_id
    ORDER BY p.created_at DESC LIMIT 5
')->fetchAll();

success([
    'stats' => [
        'total_students'    => (int)$students,
        'total_instructors' => (int)$instructors,
        'total_projects'    => (int)$projects,
        'active_projects'   => (int)$active_proj,
        'pending_requests'  => (int)$requests,
        'announcements'     => (int)$ann_count,
    ],
    'projects_by_type' => $by_type,
    'recent_users'     => $recent_users,
    'recent_projects'  => $recent_projects,
]);
