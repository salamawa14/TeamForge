<?php
// ============================================================
//  middleware/auth.php
//  Include at the top of any protected endpoint.
//  Sets $currentUser array with user_id, role, email, full_name.
// ============================================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function requireAuth(): array {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated. Please log in.']);
        exit;
    }
    return [
        'user_id'   => $_SESSION['user_id'],
        'role'      => $_SESSION['role'],
        'email'     => $_SESSION['email'],
        'full_name' => $_SESSION['full_name'],
    ];
}

function requireRole(string ...$roles): array {
    $user = requireAuth();
    if (!in_array($user['role'], $roles, true)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access denied. Insufficient permissions.']);
        exit;
    }
    return $user;
}
