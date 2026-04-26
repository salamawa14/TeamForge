<?php
// ============================================================
//  api/admin/users.php
//  GET    — list all users (with optional role filter)
//  POST   — create a user account (student / instructor / admin)
//  DELETE ?user_id=xxx — delete a user
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireRole('admin');
$db = getDB();

// ── GET ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $role   = $_GET['role']   ?? null;
    $search = $_GET['search'] ?? null;

    $sql    = 'SELECT user_id, full_name, email, role, department, created_at FROM users WHERE 1=1';
    $params = [];

    if ($role) { $sql .= ' AND role = ?';        $params[] = $role; }
    if ($search) {
        $sql .= ' AND (full_name LIKE ? OR email LIKE ?)';
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    $sql .= ' ORDER BY created_at DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    success($stmt->fetchAll());
}

// ── POST: create user ────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body           = getBody();
    $role           = trim($body['role']          ?? '');
    $full_name      = trim($body['full_name']     ?? '');
    $email          = trim($body['email']         ?? '');
    $password       = trim($body['password']      ?? '');
    $department     = trim($body['department']    ?? '');
    $academic_title = trim($body['academic_title'] ?? '');

    $allowed_roles = ['student', 'instructor', 'admin'];
    if (!in_array($role, $allowed_roles, true)) error('role must be one of: student, instructor, admin.');
    if (!$full_name || !$email || !$password) error('full_name, email and password are required.');
    if (in_array($role, ['student', 'instructor'], true) && !$department) {
        error('department is required for student and instructor accounts.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) error('Invalid email format.');
    if (strlen($password) < 8) error('Password must be at least 8 characters.');

    $check = $db->prepare('SELECT user_id FROM users WHERE email = ?');
    $check->execute([$email]);
    if ($check->fetch()) error('Email already in use.', 409);

    $uid  = bin2hex(random_bytes(16));
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $db->beginTransaction();
    try {
        $db->prepare('
            INSERT INTO users (user_id, full_name, email, password_hash, role, department)
            VALUES (?, ?, ?, ?, ?, ?)
        ')->execute([
            $uid,
            $full_name,
            $email,
            $hash,
            $role,
            in_array($role, ['student', 'instructor'], true) ? $department : null
        ]);

        if ($role === 'student') {
            $db->prepare('
                INSERT INTO student_profiles (user_id, academic_year)
                VALUES (?, ?)
            ')->execute([$uid, null]);
        }

        if ($role === 'instructor') {
            $db->prepare('
                INSERT INTO instructor_profiles (user_id, academic_title)
                VALUES (?, ?)
            ')->execute([$uid, $academic_title ?: null]);
        }

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        error('Could not create user account.', 500);
    }

    success(['user_id' => $uid], ucfirst($role) . ' account created.', 201);
}

// ── DELETE ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $user_id = $_GET['user_id'] ?? '';
    if (!$user_id) error('user_id is required.');

    $check = $db->prepare('SELECT role FROM users WHERE user_id = ?');
    $check->execute([$user_id]);
    $target = $check->fetch();
    if (!$target) error('User not found.', 404);
    if ($user_id === $_SESSION['user_id']) error('You cannot delete your own account.', 403);
    if ($target['role'] === 'admin') error('Cannot delete admin accounts.', 403);

    if ($target['role'] === 'student') {
        $ownedProjects = $db->prepare('SELECT COUNT(*) FROM projects WHERE owner_student_id = ?');
        $ownedProjects->execute([$user_id]);
        if ((int)$ownedProjects->fetchColumn() > 0) {
            error('Cannot delete a student who still owns projects.', 409);
        }
    }

    if ($target['role'] === 'instructor') {
        $activeAdvising = $db->prepare('SELECT COUNT(*) FROM projects WHERE advisor_id = ? AND status = "Active"');
        $activeAdvising->execute([$user_id]);
        if ((int)$activeAdvising->fetchColumn() > 0) {
            error('Cannot delete an instructor who is assigned to active projects.', 409);
        }
    }

    $db->prepare('DELETE FROM users WHERE user_id = ?')->execute([$user_id]);
    success([], 'User deleted.');
}

error('Method not allowed.', 405);
