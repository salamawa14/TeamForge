<?php
// ============================================================
//  api/auth/login.php
//  POST { email, password }
//  Returns user info + sets session
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';

requireMethod('POST');

$body = getBody();
$email    = trim($body['email']    ?? '');
$password = trim($body['password'] ?? '');

if (!$email || !$password) {
    error('Email and password are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error('Invalid email format.');
}

$db   = getDB();
$stmt = $db->prepare('SELECT user_id, full_name, email, password_hash, role FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    error('Invalid email or password.', 401);
}

// Start session
if (session_status() === PHP_SESSION_NONE) session_start();
session_regenerate_id(true);

$_SESSION['user_id']   = $user['user_id'];
$_SESSION['role']      = $user['role'];
$_SESSION['email']     = $user['email'];
$_SESSION['full_name'] = $user['full_name'];

success([
    'user_id'   => $user['user_id'],
    'full_name' => $user['full_name'],
    'email'     => $user['email'],
    'role'      => $user['role'],
], 'Login successful.');
