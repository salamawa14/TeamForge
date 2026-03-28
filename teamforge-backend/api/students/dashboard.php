<?php
// ============================================================
//  api/students/dashboard.php
//  GET — returns stats + recent activity for student dashboard
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('GET');
$user = requireRole('student');
$db   = getDB();
$uid  = $user['user_id'];

// Projects the student owns
$owned = $db->prepare('SELECT COUNT(*) FROM projects WHERE owner_student_id = ?');
$owned->execute([$uid]);

// Projects the student is a member of
$member = $db->prepare('SELECT COUNT(*) FROM team_memberships WHERE student_id = ?');
$member->execute([$uid]);

// Pending join requests sent by student
$pending = $db->prepare('SELECT COUNT(*) FROM join_requests WHERE applicant_id = ? AND status = "Pending"');
$pending->execute([$uid]);

// Recent announcements (last 3)
$ann = $db->prepare('
    SELECT title, description, published_at
    FROM announcements ORDER BY published_at DESC LIMIT 3
');
$ann->execute();

// Recent notifications (last 5)
$notif = $db->prepare('
    SELECT notification_id, type, message, is_read, created_at
    FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5
');
$notif->execute([$uid]);

success([
    'stats' => [
        'projects_owned'   => (int)$owned->fetchColumn(),
        'projects_joined'  => (int)$member->fetchColumn(),
        'pending_requests' => (int)$pending->fetchColumn(),
    ],
    'announcements'  => $ann->fetchAll(),
    'notifications'  => $notif->fetchAll(),
]);
