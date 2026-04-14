<?php
// ============================================================
//  api/projects/index.php
//  GET    — list / browse projects (with optional filters)
//  POST   — create a new project (student only)
// ============================================================

require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireAuth();
$db   = getDB();

// ── GET: browse projects ─────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $type   = $_GET['type']   ?? null;
    $search = $_GET['search'] ?? null;
    $status = $_GET['status'] ?? 'Active';

    $sql    = '
        SELECT p.project_id, p.owner_student_id, p.title, p.project_type, p.description,
               p.required_skills, p.team_size_needed, p.roles_needed,
               p.advisor_required, p.status, p.created_at,
               u.full_name AS owner_name, u.department AS owner_department,
               (SELECT COUNT(*) FROM team_memberships tm WHERE tm.project_id = p.project_id) AS member_count
        FROM projects p
        JOIN users u ON u.user_id = p.owner_student_id
        WHERE p.status = ?
    ';
    $params = [$status];

    if ($type) {
        $sql .= ' AND p.project_type = ?';
        $params[] = $type;
    }
    if ($search) {
        $sql .= ' AND (p.title LIKE ? OR p.description LIKE ?)';
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    $sql .= ' ORDER BY p.created_at DESC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();

    foreach ($projects as &$p) {
        $p['required_skills'] = json_decode($p['required_skills'] ?? '[]');
        $p['roles_needed']    = json_decode($p['roles_needed']    ?? '[]');
    }

    success($projects);
}

// ── POST: create project ─────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = requireRole('student');
    $body = getBody();

    $title           = trim($body['title']           ?? '');
    $project_type    = trim($body['project_type']    ?? '');
    $description     = trim($body['description']     ?? '');
    $team_size_needed = (int)($body['team_size_needed'] ?? 3);
    $required_skills = $body['required_skills']      ?? [];
    $roles_needed    = $body['roles_needed']          ?? [];
    $advisor_required = !empty($body['advisor_required']) ? 1 : 0;

    $allowed_types = ['Course', 'Tubitak', 'Teknofest', 'COURSE', 'TÜBİTAK', 'TEKNOFEST'];
    if (!$title || !$project_type || !$description) {
        error('title, project_type and description are required.');
    }
    if (!in_array($project_type, $allowed_types, true)) {
        error('project_type must be one of: ' . implode(', ', $allowed_types));
    }

    $project_id = bin2hex(random_bytes(16));

    $db->beginTransaction();
    try {
        $db->prepare('
            INSERT INTO projects
                (project_id, owner_student_id, title, project_type, description,
                 required_skills, team_size_needed, roles_needed, advisor_required)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ')->execute([
            $project_id,
            $user['user_id'],
            $title,
            $project_type,
            $description,
            json_encode($required_skills),
            $team_size_needed,
            json_encode($roles_needed),
            $advisor_required,
        ]);

        // Auto-add owner as leader
        $db->prepare('
            INSERT INTO team_memberships (membership_id, project_id, student_id, is_leader)
            VALUES (?, ?, ?, 1)
        ')->execute([bin2hex(random_bytes(16)), $project_id, $user['user_id']]);

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        error('Could not create project. Please try again.', 500);
    }

    success(['project_id' => $project_id], 'Project created successfully.', 201);
}

error('Method not allowed.', 405);
