<?php
// ============================================================
//  api/notifications/index.php
//  GET  — list my notifications
//  PUT  ?notification_id=xxx  — mark as read
//  PUT  ?mark_all=1           — mark all as read
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireAuth();
$db   = getDB();
$uid  = $user['user_id'];

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare('
        SELECT notification_id, type, message, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    ');
    $stmt->execute([$uid]);
    $notifs = $stmt->fetchAll();

    // Unread count
    $unread = $db->prepare('SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0');
    $unread->execute([$uid]);

    success([
        'notifications' => $notifs,
        'unread_count'  => (int)$unread->fetchColumn(),
    ]);
}

// ── PUT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!empty($_GET['mark_all'])) {
        $db->prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?')->execute([$uid]);
        success([], 'All notifications marked as read.');
    }

    $nid = $_GET['notification_id'] ?? '';
    if (!$nid) error('notification_id is required.');

    $db->prepare('
        UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?
    ')->execute([$nid, $uid]);

    success([], 'Notification marked as read.');
}

error('Method not allowed.', 405);
