<?php
// ============================================================
//  api/students/profile.php
//  GET  — get own profile
//  POST — update own profile
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('student');
$db   = getDB();

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Note: If you do not have an 'interests' column in your database, 
    // remove 'sp.interests,' from this SELECT query!
    $stmt = $db->prepare('
        SELECT u.user_id, u.full_name, u.email, u.department, u.created_at,
               sp.academic_year, sp.interests, sp.technical_skills,
               sp.github_url, sp.linkedin_url, sp.bio
        FROM users u
        LEFT JOIN student_profiles sp ON sp.user_id = u.user_id
        WHERE u.user_id = ?
    ');
    $stmt->execute([$user['user_id']]);
    $profile = $stmt->fetch();

    if (!$profile) error('Profile not found.', 404);

    // Decode JSON fields
    $profile['technical_skills'] = json_decode($profile['technical_skills'] ?? '[]');
    success($profile);
}

// ── POST / PUT ─────────────────────────────────────────────────
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT'], true)) {
    $body = getBody();

    $full_name     = trim($body['full_name']    ?? '');
    $department    = trim($body['department']   ?? '');
    $academic_year = $body['academic_year']     ?? null;
    $interests     = $body['interests']         ?? null;
    $skills        = $body['technical_skills']  ?? [];
    $github        = $body['github_url']        ?? null;
    $linkedin      = $body['linkedin_url']      ?? null;
    $bio           = $body['bio']               ?? null;

    if (!$full_name || !$department) {
        error('full_name and department are required.');
    }

    // 1. Update the main users table
    $db->prepare('
        UPDATE users SET full_name = ?, department = ? WHERE user_id = ?
    ')->execute([$full_name, $department, $user['user_id']]);

    // 2. Upsert the student_profiles table
    // Note: If you do not have an 'interests' column in your database, 
    // remove it from the INSERT, VALUES, and UPDATE sections below!
    $db->prepare('
        INSERT INTO student_profiles (user_id, academic_year, interests, technical_skills, github_url, linkedin_url, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            academic_year    = VALUES(academic_year),
            interests        = VALUES(interests),
            technical_skills = VALUES(technical_skills),
            github_url       = VALUES(github_url),
            linkedin_url     = VALUES(linkedin_url),
            bio              = VALUES(bio)
    ')->execute([
        $user['user_id'],
        $academic_year,
        $interests,
        json_encode($skills),
        $github,
        $linkedin,
        $bio,
    ]);

    success([], 'Profile updated successfully.');
}

error('Method not allowed.', 405);