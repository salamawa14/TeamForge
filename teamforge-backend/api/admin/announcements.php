<?php
// ============================================================
//  api/admin/announcements.php
//  GET    — list all announcements
//  POST   — create announcement
//  PUT    ?announcement_id=xxx — edit
//  DELETE ?announcement_id=xxx — delete
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('admin');
$db   = getDB();

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->query('
        SELECT a.announcement_id, a.title, a.description, a.deadline, a.published_at,
               u.full_name AS posted_by,
               pc.name AS category_name, pc.category_id
        FROM announcements a
        JOIN users u ON u.user_id = a.admin_id
        LEFT JOIN project_categories pc ON pc.category_id = a.category_id
        ORDER BY a.published_at DESC
    ');
    success($stmt->fetchAll());
}

// ── POST ─────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body        = getBody();
    $title       = trim($body['title']       ?? '');
    $description = trim($body['description'] ?? '');
    $category_id = $body['category_id']      ?? null;
    $deadline    = $body['deadline']          ?? null;

    if (!$title || !$description) error('title and description are required.');

    $ann_id = bin2hex(random_bytes(16));
    $db->prepare('
        INSERT INTO announcements (announcement_id, admin_id, title, description, category_id, deadline)
        VALUES (?, ?, ?, ?, ?, ?)
    ')->execute([$ann_id, $user['user_id'], $title, $description, $category_id ?: null, $deadline ?: null]);

    success(['announcement_id' => $ann_id], 'Announcement published.', 201);
}

// ── PUT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $ann_id = $_GET['announcement_id'] ?? '';
    if (!$ann_id) error('announcement_id is required.');

    $body        = getBody();
    $title       = trim($body['title']       ?? '');
    $description = trim($body['description'] ?? '');

    if (!$title || !$description) error('title and description are required.');

    $check = $db->prepare('SELECT announcement_id FROM announcements WHERE announcement_id = ?');
    $check->execute([$ann_id]);
    if (!$check->fetch()) error('Announcement not found.', 404);

    $db->prepare('
        UPDATE announcements
        SET title = ?, description = ?, category_id = ?, deadline = ?
        WHERE announcement_id = ?
    ')->execute([
        $title, $description,
        $body['category_id'] ?? null,
        $body['deadline']    ?? null,
        $ann_id,
    ]);

    success([], 'Announcement updated.');
}

// ── DELETE ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $ann_id = $_GET['announcement_id'] ?? '';
    if (!$ann_id) error('announcement_id is required.');

    $check = $db->prepare('SELECT announcement_id FROM announcements WHERE announcement_id = ?');
    $check->execute([$ann_id]);
    if (!$check->fetch()) error('Announcement not found.', 404);

    $db->prepare('DELETE FROM announcements WHERE announcement_id = ?')->execute([$ann_id]);
    success([], 'Announcement deleted.');
}

error('Method not allowed.', 405);
