<?php
// ============================================================
//  helpers/settings.php
//  Stores platform-wide settings in MySQL.
// ============================================================

require_once __DIR__ . '/../config/db.php';

function systemSettingsDefaults(): array {
    return [
        'platform_name'            => 'TeamForge',
        'institution_name'         => 'Istanbul Technical University',
        'support_email'            => 'support@teamforge.edu.tr',
        'platform_tagline'         => 'Match. Build. Succeed.',
        'platform_description'     => 'A web-based project matching and team formation platform for university students and instructors.',
        'platform_online'          => true,
        'show_maintenance_banner'  => false,
        'maintenance_message'      => 'Scheduled maintenance soon.',
        'registrations_open'       => true,
        'password_min_length'      => 8,
        'require_uppercase'        => true,
        'require_numbers'          => true,
        'require_special_chars'    => false,
        'max_login_attempts'       => 5,
        'lockout_duration_minutes' => 15,
    ];
}

function ensureSystemSettingsTable(PDO $db): void {
    $db->exec('
        CREATE TABLE IF NOT EXISTS system_settings (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value TEXT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ');
}

function normalizeSystemSettings(array $settings): array {
    return [
        'platform_name'            => trim((string)($settings['platform_name'] ?? '')) ?: systemSettingsDefaults()['platform_name'],
        'institution_name'         => trim((string)($settings['institution_name'] ?? '')) ?: systemSettingsDefaults()['institution_name'],
        'support_email'            => trim((string)($settings['support_email'] ?? '')) ?: systemSettingsDefaults()['support_email'],
        'platform_tagline'         => trim((string)($settings['platform_tagline'] ?? '')) ?: systemSettingsDefaults()['platform_tagline'],
        'platform_description'     => trim((string)($settings['platform_description'] ?? '')) ?: systemSettingsDefaults()['platform_description'],
        'platform_online'          => !empty($settings['platform_online']),
        'show_maintenance_banner'  => !empty($settings['show_maintenance_banner']),
        'maintenance_message'      => trim((string)($settings['maintenance_message'] ?? '')) ?: systemSettingsDefaults()['maintenance_message'],
        'registrations_open'       => !empty($settings['registrations_open']),
        'password_min_length'      => max(6, (int)($settings['password_min_length'] ?? systemSettingsDefaults()['password_min_length'])),
        'require_uppercase'        => !empty($settings['require_uppercase']),
        'require_numbers'          => !empty($settings['require_numbers']),
        'require_special_chars'    => !empty($settings['require_special_chars']),
        'max_login_attempts'       => max(3, (int)($settings['max_login_attempts'] ?? systemSettingsDefaults()['max_login_attempts'])),
        'lockout_duration_minutes' => max(5, (int)($settings['lockout_duration_minutes'] ?? systemSettingsDefaults()['lockout_duration_minutes'])),
    ];
}

function getSystemSettings(?PDO $db = null): array {
    $db = $db ?: getDB();
    ensureSystemSettingsTable($db);

    $defaults = systemSettingsDefaults();
    $stmt = $db->query('SELECT setting_key, setting_value FROM system_settings');
    $rows = $stmt->fetchAll();

    foreach ($rows as $row) {
        $key = $row['setting_key'];
        if (!array_key_exists($key, $defaults)) {
            continue;
        }

        $decoded = json_decode($row['setting_value'], true);
        $defaults[$key] = $decoded === null && $row['setting_value'] !== 'null'
            ? $row['setting_value']
            : $decoded;
    }

    return normalizeSystemSettings($defaults);
}

function saveSystemSettings(array $settings, ?PDO $db = null): array {
    $db = $db ?: getDB();
    ensureSystemSettingsTable($db);

    $settings = normalizeSystemSettings($settings);
    $stmt = $db->prepare('
        INSERT INTO system_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    ');

    foreach ($settings as $key => $value) {
        $stmt->execute([$key, json_encode($value)]);
    }

    return $settings;
}
