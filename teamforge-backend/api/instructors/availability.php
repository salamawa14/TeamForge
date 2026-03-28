<?php
// ============================================================
//  api/instructors/availability.php
//  GET — get current advising status
//  PUT — toggle advising status (Active / Inactive)
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('instructor');
$db   = getDB();
$uid  = $user['user_id'];

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare('SELECT advising_status, timezone FROM instructor_profiles WHERE user_id = ?');
    $stmt->execute([$uid]);
    $row = $stmt->fetch();
    if (!$row) error('Profile not found.', 404);
    success($row);
}

// ── PUT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body   = getBody();
    $status   = $body['advising_status'] ?? '';
    $timezone = $body['timezone']        ?? null;

    if (!in_array($status, ['Active','Inactive'], true)) {
        error('advising_status must be "Active" or "Inactive".');
    }

    $db->prepare('
        UPDATE instructor_profiles SET advising_status = ?, timezone = ? WHERE user_id = ?
    ')->execute([$status, $timezone, $uid]);

    success([], 'Availability updated.');
}

error('Method not allowed.', 405);
