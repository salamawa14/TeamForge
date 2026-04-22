<?php
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('GET');
$user = requireRole('student');
$db   = getDB();
$uid  = $user['user_id'];

// Projects owned
$owned = $db->prepare('SELECT COUNT(*) FROM projects WHERE owner_student_id = ?');
$owned->execute([$uid]);

// Projects joined as member
$member = $db->prepare('SELECT COUNT(*) FROM team_memberships WHERE student_id = ?');
$member->execute([$uid]);

// Pending join requests
$pending = $db->prepare('SELECT COUNT(*) FROM join_requests WHERE applicant_id = ? AND status = "Pending"');
$pending->execute([$uid]);

// Accepted join requests
$accepted = $db->prepare('SELECT COUNT(*) FROM join_requests WHERE applicant_id = ? AND status = "Accepted"');
$accepted->execute([$uid]);

// Advisor requests sent
$advisorReqs = $db->prepare('SELECT COUNT(*) FROM advisor_requests WHERE student_id = ?');
$advisorReqs->execute([$uid]);

// My projects with member counts for progress section
$myProjects = $db->prepare('
    SELECT p.project_id, p.title, p.project_type, p.team_size_needed,
           (SELECT COUNT(*) FROM team_memberships tm WHERE tm.project_id = p.project_id) AS member_count
    FROM projects p
    WHERE p.owner_student_id = ?
    ORDER BY p.created_at DESC LIMIT 5
');
$myProjects->execute([$uid]);

// Recent activity from notifications
$activity = $db->prepare('
    SELECT notification_id, type, message, is_read, created_at
    FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5
');
$activity->execute([$uid]);

// Upcoming deadlines from projects I own or joined
$deadlines = $db->prepare('
    SELECT p.title, p.project_type, p.created_at
    FROM projects p
    JOIN team_memberships tm ON tm.project_id = p.project_id
    WHERE tm.student_id = ?
    ORDER BY p.created_at DESC LIMIT 3
');
$deadlines->execute([$uid]);

success([
    'stats' => [
        'projects_owned'   => (int)$owned->fetchColumn(),
        'projects_joined'  => (int)$member->fetchColumn(),
        'pending_requests' => (int)$pending->fetchColumn(),
        'accepted_requests'=> (int)$accepted->fetchColumn(),
        'advisor_requests' => (int)$advisorReqs->fetchColumn(),
    ],
    'my_projects'  => $myProjects->fetchAll(),
    'activity'     => $activity->fetchAll(),
    'deadlines'    => $deadlines->fetchAll(),
]);
