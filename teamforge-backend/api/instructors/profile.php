<?php
// ============================================================
//  api/instructors/profile.php
//  GET — get own instructor profile
//  PUT — update own instructor profile
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('instructor');
$db   = getDB();
$uid  = $user['user_id'];

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare('
        SELECT u.user_id, u.full_name, u.email, u.department, u.created_at,
               ip.academic_title, ip.areas_of_expertise, ip.research_interests,
               ip.supervised_proj_types, ip.advising_status, ip.timezone
        FROM users u
        LEFT JOIN instructor_profiles ip ON ip.user_id = u.user_id
        WHERE u.user_id = ?
    ');
    $stmt->execute([$uid]);
    $profile = $stmt->fetch();
    if (!$profile) error('Profile not found.', 404);

    $profile['areas_of_expertise']    = json_decode($profile['areas_of_expertise']    ?? '[]');
    $profile['supervised_proj_types'] = json_decode($profile['supervised_proj_types'] ?? '[]');

    success($profile);
}

// ── PUT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = getBody();

    $full_name     = trim($body['full_name']    ?? '');
    $department    = trim($body['department']   ?? '');
    $academic_title = trim($body['academic_title'] ?? '');

    if (!$full_name || !$department) {
        error('full_name and department are required.');
    }

    $db->prepare('
        UPDATE users SET full_name = ?, department = ? WHERE user_id = ?
    ')->execute([$full_name, $department, $uid]);

    $db->prepare('
        UPDATE instructor_profiles SET
            academic_title        = ?,
            areas_of_expertise    = ?,
            research_interests    = ?,
            supervised_proj_types = ?,
            timezone              = ?
        WHERE user_id = ?
    ')->execute([
        $academic_title,
        json_encode($body['areas_of_expertise']    ?? []),
        $body['research_interests']                ?? null,
        json_encode($body['supervised_proj_types'] ?? []),
        $body['timezone']                          ?? null,
        $uid,
    ]);

    success([], 'Profile updated successfully.');
}

error('Method not allowed.', 405);
