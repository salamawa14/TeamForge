<?php
// ============================================================
//  api/auth/register.php
//  POST { full_name, email, password, role, department, academic_year? }
//  role must be "student" (instructors registered by admin)
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';

requireMethod('POST');

$body         = getBody();
$full_name    = trim($body['full_name']    ?? '');
$email        = trim($body['email']        ?? '');
$password     = trim($body['password']     ?? '');
$department   = trim($body['department']   ?? '');
$academic_year = trim($body['academic_year'] ?? '');

// Validation
if (!$full_name || !$email || !$password || !$department) {
    error('full_name, email, password and department are required.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error('Invalid email format.');
}
if (strlen($password) < 8) {
    error('Password must be at least 8 characters.');
}
$allowed_years = ['1st','2nd','3rd','4th','5th'];
if ($academic_year && !in_array($academic_year, $allowed_years, true)) {
    error('academic_year must be one of: ' . implode(', ', $allowed_years));
}

$db = getDB();

// Check duplicate email
$check = $db->prepare('SELECT user_id FROM users WHERE email = ?');
$check->execute([$email]);
if ($check->fetch()) {
    error('An account with this email already exists.', 409);
}

$user_id = bin2hex(random_bytes(16));           // UUID-like
$hash    = password_hash($password, PASSWORD_BCRYPT);

$db->beginTransaction();
try {
    // Insert into users
    $db->prepare('
        INSERT INTO users (user_id, full_name, email, password_hash, role, department)
        VALUES (?, ?, ?, ?, "student", ?)
    ')->execute([$user_id, $full_name, $email, $hash, $department]);

    // Insert student profile row
    $db->prepare('
        INSERT INTO student_profiles (user_id, academic_year)
        VALUES (?, ?)
    ')->execute([$user_id, $academic_year ?: null]);

    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    error('Registration failed. Please try again.', 500);
}

success(['user_id' => $user_id], 'Account created successfully.', 201);
