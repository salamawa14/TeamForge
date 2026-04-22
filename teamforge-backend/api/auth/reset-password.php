<?php
// ============================================================
//  api/auth/reset-password.php
//  POST — resets password using token
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';

requireMethod('POST');
$body = getBody();
$token = $body['token'] ?? '';
$new_password = $body['new_password'] ?? '';

if (!$token || !$new_password) {
    error('Token and new password are required.', 400);
}

if (strlen($new_password) < 6) {
    error('Password must be at least 6 characters.', 400);
}

$db = getDB();

// Find valid reset token
$stmt = $db->prepare('SELECT email FROM password_resets WHERE reset_token = ? AND expires_at > NOW()');
$stmt->execute([$token]);
$reset = $stmt->fetch();

if (!$reset) {
    error('Invalid or expired reset token.', 400);
}

$email = $reset['email'];

// Hash new password
$password_hash = password_hash($new_password, PASSWORD_DEFAULT);

// Update user password
$db->prepare('UPDATE users SET password_hash = ? WHERE email = ?')->execute([$password_hash, $email]);

// Delete used token
$db->prepare('DELETE FROM password_resets WHERE email = ?')->execute([$email]);

success(null, 'Password reset successfully.');
?>