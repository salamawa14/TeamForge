<?php
// ============================================================
//  helpers/response.php
//  Sets headers and provides JSON response helpers
// ============================================================

// Allow your frontend origin (update port if needed)
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Origin: http://teamforge.local');
header('Access-Control-Allow-Credentials: true');         // Use during development
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Helpers ──────────────────────────────────────────────────

function success($data = [], string $message = 'OK', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => true, 'message' => $message, 'data' => $data]);
    exit;
}

function error(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

function getBody(): array {
    $body = json_decode(file_get_contents('php://input'), true);
    return is_array($body) ? $body : [];
}

function requireMethod(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        error('Method not allowed', 405);
    }
}
