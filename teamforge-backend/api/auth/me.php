<?php
// ============================================================
//  api/auth/me.php
//  GET — returns logged-in user info (used on page load)
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireMethod('GET');
$user = requireAuth();

success($user);
