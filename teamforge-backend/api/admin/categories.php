<?php
// ============================================================
//  api/admin/categories.php
//  GET    — list all project categories
//  POST   — create a category
//  PUT    ?category_id=xxx — update a category
//  DELETE ?category_id=xxx — delete a category
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireRole('admin');
$db = getDB();

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->query('
        SELECT category_id, name, description, max_members, budget_tl,
               required_skills, created_at, updated_at
        FROM project_categories ORDER BY name
    ');
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['required_skills'] = json_decode($r['required_skills'] ?? '[]');
    }
    success($rows);
}

// ── POST ─────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body        = getBody();
    $name        = trim($body['name']        ?? '');
    $description = trim($body['description'] ?? '');
    $max_members = (int)($body['max_members'] ?? 5);
    $budget_tl   = (float)($body['budget_tl'] ?? 9000);
    $skills      = $body['required_skills']  ?? [];

    if (!$name) error('Category name is required.');

    // Duplicate check
    $dup = $db->prepare('SELECT category_id FROM project_categories WHERE name = ?');
    $dup->execute([$name]);
    if ($dup->fetch()) error('A category with this name already exists.', 409);

    $cat_id = bin2hex(random_bytes(16));
    $db->prepare('
        INSERT INTO project_categories
            (category_id, name, description, max_members, budget_tl, required_skills)
        VALUES (?, ?, ?, ?, ?, ?)
    ')->execute([$cat_id, $name, $description ?: null, $max_members, $budget_tl, json_encode($skills)]);

    success(['category_id' => $cat_id], 'Category created.', 201);
}

// ── PUT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $cat_id = $_GET['category_id'] ?? '';
    if (!$cat_id) error('category_id is required.');

    $body        = getBody();
    $name        = trim($body['name']        ?? '');
    $description = trim($body['description'] ?? '');
    $max_members = (int)($body['max_members'] ?? 5);
    $budget_tl   = (float)($body['budget_tl'] ?? 9000);
    $skills      = $body['required_skills']  ?? [];

    if (!$name) error('Category name is required.');

    $check = $db->prepare('SELECT category_id FROM project_categories WHERE category_id = ?');
    $check->execute([$cat_id]);
    if (!$check->fetch()) error('Category not found.', 404);

    $db->prepare('
        UPDATE project_categories
        SET name = ?, description = ?, max_members = ?, budget_tl = ?, required_skills = ?
        WHERE category_id = ?
    ')->execute([$name, $description ?: null, $max_members, $budget_tl, json_encode($skills), $cat_id]);

    success([], 'Category updated.');
}

// ── DELETE ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $cat_id = $_GET['category_id'] ?? '';
    if (!$cat_id) error('category_id is required.');

    $check = $db->prepare('SELECT category_id FROM project_categories WHERE category_id = ?');
    $check->execute([$cat_id]);
    if (!$check->fetch()) error('Category not found.', 404);

    $db->prepare('DELETE FROM project_categories WHERE category_id = ?')->execute([$cat_id]);
    success([], 'Category deleted.');
}

error('Method not allowed.', 405);
