<?php
// ============================================================
//  api/admin/settings.php
//  GET — fetch system settings
//  PUT — update system settings
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/settings.php';

requireRole('admin');
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    success(getSystemSettings($db));
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = getBody();

    if (!empty($body['support_email']) && !filter_var($body['support_email'], FILTER_VALIDATE_EMAIL)) {
        error('Invalid support email address.');
    }

    $settings = saveSystemSettings($body, $db);
    success($settings, 'Settings updated successfully.');
}

error('Method not allowed.', 405);
