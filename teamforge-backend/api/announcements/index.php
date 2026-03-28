<?php
// ============================================================
//  api/announcements/index.php
//  GET  — list announcements (all roles)
//  POST — create announcement (admin only)
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireAuth();
$db   = getDB();

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare('
        SELECT a.announcement_id, a.title, a.description, a.deadline, a.published_at,
               u.full_name AS posted_by,
               pc.name AS category_name
        FROM announcements a
        JOIN users u ON u.user_id = a.admin_id
        LEFT JOIN project_categories pc ON pc.category_id = a.category_id
        ORDER BY a.published_at DESC
    ');
    $stmt->execute();
    success($stmt->fetchAll());
}

// ── POST ─────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireRole('admin');
    $body = getBody();

    $title       = trim($body['title']       ?? '');
    $description = trim($body['description'] ?? '');
    $category_id = $body['category_id']      ?? null;
    $deadline    = $body['deadline']          ?? null;

    if (!$title || !$description) error('title and description are required.');

    $ann_id = bin2hex(random_bytes(16));
    $db->prepare('
        INSERT INTO announcements (announcement_id, admin_id, title, description, category_id, deadline)
        VALUES (?, ?, ?, ?, ?, ?)
    ')->execute([$ann_id, $user['user_id'], $title, $description, $category_id, $deadline]);

    success(['announcement_id' => $ann_id], 'Announcement published.', 201);
}

error('Method not allowed.', 405);
