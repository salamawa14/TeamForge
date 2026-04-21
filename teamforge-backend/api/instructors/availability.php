<?php
// ============================================================
//  api/instructors/availability.php
//  GET — get current advising status
//  PUT — toggle advising status (Active / Inactive)
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireRole('instructor');
$db   = getDB();
$uid  = $user['user_id'];

$db->exec('
    CREATE TABLE IF NOT EXISTS instructor_availability_settings (
        user_id VARCHAR(64) PRIMARY KEY,
        accepts_tubitak TINYINT(1) NOT NULL DEFAULT 1,
        accepts_teknofest TINYINT(1) NOT NULL DEFAULT 1,
        max_concurrent_advisees INT NOT NULL DEFAULT 5,
        auto_hide_when_full TINYINT(1) NOT NULL DEFAULT 1,
        office_hours_note TEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_instructor_availability_user
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
');

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $profileStmt = $db->prepare('SELECT advising_status, timezone FROM instructor_profiles WHERE user_id = ?');
    $profileStmt->execute([$uid]);
    $profile = $profileStmt->fetch() ?: [];

    $settingsStmt = $db->prepare('
        SELECT accepts_tubitak, accepts_teknofest, max_concurrent_advisees, auto_hide_when_full, office_hours_note
        FROM instructor_availability_settings WHERE user_id = ?
    ');
    $settingsStmt->execute([$uid]);
    $settings = $settingsStmt->fetch() ?: [];

    $activeProjectsStmt = $db->prepare('SELECT COUNT(*) FROM projects WHERE advisor_id = ? AND status = "Active"');
    $activeProjectsStmt->execute([$uid]);

    success([
        'advising_status'         => $profile['advising_status'] ?? 'Active',
        'timezone'                => $profile['timezone'] ?? null,
        'accepts_tubitak'         => isset($settings['accepts_tubitak']) ? (bool)$settings['accepts_tubitak'] : true,
        'accepts_teknofest'       => isset($settings['accepts_teknofest']) ? (bool)$settings['accepts_teknofest'] : true,
        'max_concurrent_advisees' => isset($settings['max_concurrent_advisees']) ? (int)$settings['max_concurrent_advisees'] : 5,
        'auto_hide_when_full'     => isset($settings['auto_hide_when_full']) ? (bool)$settings['auto_hide_when_full'] : true,
        'office_hours_note'       => $settings['office_hours_note'] ?? '',
        'active_projects'         => (int)$activeProjectsStmt->fetchColumn(),
    ]);
}

// ── PUT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body   = getBody();
    $acceptsTubitak = array_key_exists('accepts_tubitak', $body) ? (bool)$body['accepts_tubitak'] : true;
    $acceptsTeknofest = array_key_exists('accepts_teknofest', $body) ? (bool)$body['accepts_teknofest'] : true;
    $status = $body['advising_status'] ?? ($acceptsTubitak || $acceptsTeknofest ? 'Active' : 'Inactive');
    $timezone = $body['timezone']        ?? null;
    $maxConcurrentAdvisees = max(1, (int)($body['max_concurrent_advisees'] ?? 5));
    $autoHideWhenFull = array_key_exists('auto_hide_when_full', $body) ? (bool)$body['auto_hide_when_full'] : true;
    $officeHoursNote = trim((string)($body['office_hours_note'] ?? ''));

    if (!in_array($status, ['Active','Inactive'], true)) {
        error('advising_status must be "Active" or "Inactive".');
    }

    try {
        $db->beginTransaction();

        $db->prepare('
            INSERT INTO instructor_profiles (user_id, advising_status, timezone)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                advising_status = VALUES(advising_status),
                timezone = VALUES(timezone)
        ')->execute([$uid, $status, $timezone]);

        $db->prepare('
            INSERT INTO instructor_availability_settings (
                user_id, accepts_tubitak, accepts_teknofest, max_concurrent_advisees, auto_hide_when_full, office_hours_note
            )
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                accepts_tubitak = VALUES(accepts_tubitak),
                accepts_teknofest = VALUES(accepts_teknofest),
                max_concurrent_advisees = VALUES(max_concurrent_advisees),
                auto_hide_when_full = VALUES(auto_hide_when_full),
                office_hours_note = VALUES(office_hours_note)
        ')->execute([
            $uid,
            $acceptsTubitak ? 1 : 0,
            $acceptsTeknofest ? 1 : 0,
            $maxConcurrentAdvisees,
            $autoHideWhenFull ? 1 : 0,
            $officeHoursNote ?: null,
        ]);

        $db->commit();
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        error('Could not update availability.', 500);
    }

    success([], 'Availability updated.');
}

error('Method not allowed.', 405);
