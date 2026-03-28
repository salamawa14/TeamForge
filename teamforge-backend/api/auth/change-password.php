<?php
// ============================================================
//  api/auth/change-password.php
//  PUT — change own password (all roles)
//  Body: { current_password, new_password }
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('PUT');
$user = requireAuth();
$db   = getDB();
$body = getBody();

$current = $body['current_password'] ?? '';
$new     = $body['new_password']     ?? '';

if (!$current || !$new) error('current_password and new_password are required.');
if (strlen($new) < 8) error('New password must be at least 8 characters.');

$stmt = $db->prepare('SELECT password_hash FROM users WHERE user_id = ?');
$stmt->execute([$user['user_id']]);
$row = $stmt->fetch();

if (!password_verify($current, $row['password_hash'])) {
    error('Current password is incorrect.', 401);
}

$db->prepare('UPDATE users SET password_hash = ? WHERE user_id = ?')
   ->execute([password_hash($new, PASSWORD_BCRYPT), $user['user_id']]);

success([], 'Password changed successfully.');
