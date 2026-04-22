<?php
// ============================================================
//  api/auth/forgot-password.php
//  POST — sends password reset email
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';

requireMethod('POST');
$body = getBody();
$email = $body['email'] ?? '';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error('Valid email address is required.', 400);
}

$db = getDB();

// Check if user exists
$stmt = $db->prepare('SELECT user_id, full_name FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    // For security, don't reveal if email exists or not
    success(null, 'If an account with that email exists, a password reset link has been sent.');
}

// Generate reset token
$reset_token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Store reset token
$db->prepare('
    INSERT INTO password_resets (email, reset_token, expires_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE reset_token = VALUES(reset_token), expires_at = VALUES(expires_at)
')->execute([$email, $reset_token, $expires_at]);

// Determine project root (similar to api.js logic)
$project_root = strpos($_SERVER['REQUEST_URI'], '/teamforge/') !== false ? '/TeamForge' : '';

// In a real app, send email here
// For demo, just log it
error_log("Password reset for $email: " . $project_root . "/frontend/auth/reset-password.html?token=$reset_token");

success(null, 'If an account with that email exists, a password reset link has been sent.');
?>