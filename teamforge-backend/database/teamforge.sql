-- ============================================================
--  TeamForge Database Schema
--  Run this in phpMyAdmin to create all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS teamforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teamforge;

-- ============================================================
-- 1. USERS (single table for student, instructor, admin)
-- ============================================================
CREATE TABLE users (
    user_id        CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    full_name      VARCHAR(100)  NOT NULL,
    email          VARCHAR(150)  NOT NULL UNIQUE,
    password_hash  VARCHAR(255)  NOT NULL,
    role           ENUM('student','instructor','admin') NOT NULL,
    department     VARCHAR(100),
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. STUDENT PROFILES (extends users where role = student)
-- ============================================================
CREATE TABLE student_profiles (
    user_id           CHAR(36)     PRIMARY KEY,
    academic_year     ENUM('1st','2nd','3rd','4th','5th'),
    interests         TEXT,
    technical_skills  JSON,
    github_url        VARCHAR(255),
    linkedin_url      VARCHAR(255),
    bio               TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================
-- 3. INSTRUCTOR PROFILES (extends users where role = instructor)
-- ============================================================
CREATE TABLE instructor_profiles (
    user_id                 CHAR(36)     PRIMARY KEY,
    academic_title          VARCHAR(100),
    areas_of_expertise      JSON,
    research_interests      TEXT,
    supervised_proj_types   JSON,
    advising_status         ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    timezone                VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================
-- 4. PROJECT CATEGORIES (managed by admin)
-- ============================================================
CREATE TABLE project_categories (
    category_id    CHAR(36)        PRIMARY KEY DEFAULT (UUID()),
    name           VARCHAR(100)    NOT NULL UNIQUE,
    description    TEXT,
    max_members    INT             NOT NULL DEFAULT 5,
    budget_tl      DECIMAL(10,2)   NOT NULL DEFAULT 9000.00,
    required_skills JSON,
    form_schema    JSON,
    created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default categories
INSERT INTO project_categories (category_id, name, description, max_members, budget_tl)
VALUES
    (UUID(), 'Course',     'Regular course project',       4, 0.00),
    (UUID(), 'Tubitak',    'Tubitak-funded research',      5, 9000.00),
    (UUID(), 'Teknofest',  'Teknofest competition project', 6, 9000.00);

-- ============================================================
-- 5. PROJECTS
-- ============================================================
CREATE TABLE projects (
    project_id          CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    owner_student_id    CHAR(36)      NOT NULL,
    title               VARCHAR(200)  NOT NULL,
    project_type        ENUM('Course','Tubitak','Teknofest') NOT NULL,
    description         TEXT          NOT NULL,
    required_skills     JSON,
    team_size_needed    INT           NOT NULL DEFAULT 3,
    roles_needed        JSON,
    advisor_required    TINYINT(1)    NOT NULL DEFAULT 0,
    advisor_id          CHAR(36),
    status              ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    visibility_filters  JSON,
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (advisor_id)       REFERENCES users(user_id) ON DELETE SET NULL
);

-- ============================================================
-- 6. TEAM MEMBERSHIPS
-- ============================================================
CREATE TABLE team_memberships (
    membership_id  CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    project_id     CHAR(36)      NOT NULL,
    student_id     CHAR(36)      NOT NULL,
    role           VARCHAR(100),
    is_leader      TINYINT(1)    NOT NULL DEFAULT 0,
    joined_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_member (project_id, student_id),
    FOREIGN KEY (project_id)  REFERENCES projects(project_id)  ON DELETE CASCADE,
    FOREIGN KEY (student_id)  REFERENCES users(user_id)     ON DELETE CASCADE
);

-- ============================================================
-- 7. JOIN REQUESTS (student applies to join a project)
-- ============================================================
CREATE TABLE join_requests (
    request_id    CHAR(36)    PRIMARY KEY DEFAULT (UUID()),
    project_id    CHAR(36)    NOT NULL,
    applicant_id  CHAR(36)    NOT NULL,
    status        ENUM('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
    requested_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
   reviewed_at   TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY unique_request (project_id, applicant_id),
    FOREIGN KEY (project_id)   REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(user_id)       ON DELETE CASCADE
);

-- ============================================================
-- 8. ADVISOR REQUESTS (student invites instructor to advise)
-- ============================================================
CREATE TABLE advisor_requests (
    adv_request_id  CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    project_id      CHAR(36)      NOT NULL,
    student_id      CHAR(36)      NOT NULL,
    advisor_id      CHAR(36)      NOT NULL,
    project_title   VARCHAR(200)  NOT NULL,
    description     TEXT          NOT NULL,
    project_type    ENUM('Course','Tubitak','Teknofest') NOT NULL,
    status          ENUM('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
    requested_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at      TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (project_id)  REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id)  REFERENCES users(user_id)       ON DELETE CASCADE,
    FOREIGN KEY (advisor_id)  REFERENCES users(user_id)       ON DELETE CASCADE
);

-- ============================================================
-- 9. ANNOUNCEMENTS
-- ============================================================
CREATE TABLE announcements (
    announcement_id  CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    admin_id         CHAR(36)      NOT NULL,
    title            VARCHAR(200)  NOT NULL,
    description      TEXT          NOT NULL,
    category_id      CHAR(36),
    deadline         DATE,
    published_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id)    REFERENCES users(user_id)              ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES project_categories(category_id) ON DELETE SET NULL
);

-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    notification_id  CHAR(36)    PRIMARY KEY DEFAULT (UUID()),
    user_id          CHAR(36)    NOT NULL,
    type             VARCHAR(50) NOT NULL,
    message          TEXT        NOT NULL,
    is_read          TINYINT(1)  NOT NULL DEFAULT 0,
    created_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================
-- 11. DEFAULT ADMIN USER  (change password after first login!)
-- password = "admin123" hashed with bcrypt
-- ============================================================
INSERT INTO users (user_id, full_name, email, password_hash, role)
VALUES (
    UUID(),
    'Admin',
    'admin@teamforge.com',
    '$2y$12$7u9wLfP76evTd/iVE5OaWeKfSx2nOIw3XNuNrj9svFeQLDr6htMJ6',
    'admin'
);
