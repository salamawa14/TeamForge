<?php
// ============================================================
//  api/instructors/dashboard.php
//  GET — summary stats for the instructor dashboard
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('GET');
$user = requireRole('instructor');
$db   = getDB();
$uid  = $user['user_id'];

// Projects being advised
$advising = $db->prepare('SELECT COUNT(*) FROM projects WHERE advisor_id = ? AND status = "Active"');
$advising->execute([$uid]);

// Pending advisor requests
$pending = $db->prepare('SELECT COUNT(*) FROM advisor_requests WHERE advisor_id = ? AND status = "Pending"');
$pending->execute([$uid]);

// Total advisees (unique students across all advised projects)
$advisees = $db->prepare('
    SELECT COUNT(DISTINCT tm.student_id)
    FROM team_memberships tm
    JOIN projects p ON p.project_id = tm.project_id
    WHERE p.advisor_id = ?
');
$advisees->execute([$uid]);

// Recent advisor requests (last 5)
$requests = $db->prepare('
    SELECT ar.adv_request_id, ar.project_title, ar.project_type,
           ar.description, ar.status, ar.requested_at,
           u.full_name AS student_name, u.department
    FROM advisor_requests ar
    JOIN users u ON u.user_id = ar.student_id
    WHERE ar.advisor_id = ?
    ORDER BY ar.requested_at DESC
    LIMIT 5
');
$requests->execute([$uid]);

// Recent notifications
$notifs = $db->prepare('
    SELECT notification_id, type, message, is_read, created_at
    FROM notifications WHERE user_id = ?
    ORDER BY created_at DESC LIMIT 5
');
$notifs->execute([$uid]);

success([
    'stats' => [
        'active_projects'  => (int)$advising->fetchColumn(),
        'pending_requests' => (int)$pending->fetchColumn(),
        'total_advisees'   => (int)$advisees->fetchColumn(),
    ],
    'recent_requests'  => $requests->fetchAll(),
    'notifications'    => $notifs->fetchAll(),
]);
