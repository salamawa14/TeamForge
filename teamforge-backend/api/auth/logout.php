<?php
// ============================================================
//  api/auth/logout.php
//  POST  — destroys session
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';

requireMethod('POST');

if (session_status() === PHP_SESSION_NONE) session_start();
$_SESSION = [];
session_destroy();

success([], 'Logged out successfully.');
