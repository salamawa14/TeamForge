// ============================================================
//  assets/js/api.js
//  Paste a <script src="../assets/js/api.js"></script> into
//  every HTML page.  Adjust BASE_URL if your XAMPP port differs.
// ============================================================

const BASE_URL = 'http://teamforge.local/teamforge-backend/api';
// ── Core fetch wrapper ────────────────────────────────────────
async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        credentials: 'include',          // sends the session cookie
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res  = await fetch(BASE_URL + endpoint, options);
    const data = await res.json();

  if (!data.success) {
    if (res.status === 401 && !endpoint.includes('/auth/login')) {
        window.location.href = 'http://teamforge.local/frontend/auth/login.html';
        return null;
    }
    throw new Error(data.message || 'Something went wrong.');
}
    return data.data;
}

// ── Auth ──────────────────────────────────────────────────────
const Auth = {
    login:          (email, password) =>
        apiRequest('/auth/login.php', 'POST', { email, password }),

    register:       (data) =>
        apiRequest('/auth/register.php', 'POST', data),

    logout:         () =>
        apiRequest('/auth/logout.php', 'POST'),

    me:             () =>
        apiRequest('/auth/me.php'),

    changePassword: (current_password, new_password) =>
        apiRequest('/auth/change-password.php', 'PUT', { current_password, new_password }),
};

// ── Students ──────────────────────────────────────────────────
const Student = {
    dashboard:   () => apiRequest('/students/dashboard.php'),
    getProfile:  () => apiRequest('/students/profile.php'),
    updateProfile: (data) => apiRequest('/students/profile.php', 'PUT', data),
    myProjects:  () => apiRequest('/students/my-projects.php'),

    // Applications (join requests sent by me)
    myApplications:    () => apiRequest('/students/applications.php'),
    incomingRequests:  () => apiRequest('/students/applications.php?incoming=1'),
    applyToProject:    (project_id) =>
        apiRequest('/students/applications.php', 'POST', { project_id }),
    reviewRequest:     (request_id, action) =>
        apiRequest(`/students/applications.php?request_id=${request_id}&action=${action}`, 'PUT'),

    // Find advisor
    findAdvisors:    (search = '') =>
        apiRequest('/students/find-advisor.php' + (search ? `?search=${encodeURIComponent(search)}` : '')),
    requestAdvisor:  (project_id, advisor_id) =>
        apiRequest('/students/find-advisor.php', 'POST', { project_id, advisor_id }),
};

// ── Projects ──────────────────────────────────────────────────
const Projects = {
    browse: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return apiRequest('/projects/index.php' + (q ? '?' + q : ''));
    },
    create:   (data)       => apiRequest('/projects/index.php', 'POST', data),
    get:      (project_id) => apiRequest(`/projects/detail.php?project_id=${project_id}`),
    update:   (project_id, data) =>
        apiRequest(`/projects/detail.php?project_id=${project_id}`, 'PUT', data),
    delete:   (project_id) =>
        apiRequest(`/projects/detail.php?project_id=${project_id}`, 'DELETE'),
};

// ── Instructor ────────────────────────────────────────────────
const Instructor = {
    dashboard:        () => apiRequest('/instructors/dashboard.php'),
    getProfile:       () => apiRequest('/instructors/profile.php'),
    updateProfile:    (data) => apiRequest('/instructors/profile.php', 'PUT', data),
    advisees:         () => apiRequest('/instructors/advisees.php'),

    // Advisor requests
    getRequests:      (status = '') =>
        apiRequest('/instructors/advisor-requests.php' + (status ? `?status=${status}` : '')),
    reviewRequest:    (adv_request_id, action) =>
        apiRequest(`/instructors/advisor-requests.php?adv_request_id=${adv_request_id}&action=${action}`, 'PUT'),

    // Availability
    getAvailability:  () => apiRequest('/instructors/availability.php'),
    setAvailability:  (advising_status, timezone = null) =>
        apiRequest('/instructors/availability.php', 'PUT', { advising_status, timezone }),
};

// ── Admin ─────────────────────────────────────────────────────
const Admin = {
    dashboard:  () => apiRequest('/admin/dashboard.php'),

    // Users
    getUsers:          (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return apiRequest('/admin/users.php' + (q ? '?' + q : ''));
    },
    createInstructor:  (data)    => apiRequest('/admin/users.php', 'POST', data),
    deleteUser:        (user_id) => apiRequest(`/admin/users.php?user_id=${user_id}`, 'DELETE'),

    // Categories
    getCategories:    () => apiRequest('/admin/categories.php'),
    createCategory:   (data) => apiRequest('/admin/categories.php', 'POST', data),
    updateCategory:   (category_id, data) =>
        apiRequest(`/admin/categories.php?category_id=${category_id}`, 'PUT', data),
    deleteCategory:   (category_id) =>
        apiRequest(`/admin/categories.php?category_id=${category_id}`, 'DELETE'),

    // Announcements
    getAnnouncements:   () => apiRequest('/admin/announcements.php'),
    createAnnouncement: (data) => apiRequest('/admin/announcements.php', 'POST', data),
    updateAnnouncement: (announcement_id, data) =>
        apiRequest(`/admin/announcements.php?announcement_id=${announcement_id}`, 'PUT', data),
    deleteAnnouncement: (announcement_id) =>
        apiRequest(`/admin/announcements.php?announcement_id=${announcement_id}`, 'DELETE'),
};

// ── Notifications ─────────────────────────────────────────────
const Notifications = {
    getAll:    () => apiRequest('/notifications/index.php'),
    markRead:  (notification_id) =>
        apiRequest(`/notifications/index.php?notification_id=${notification_id}`, 'PUT'),
    markAllRead: () => apiRequest('/notifications/index.php?mark_all=1', 'PUT'),
};

// ── Announcements (public read) ───────────────────────────────
const Announcements = {
    getAll: () => apiRequest('/announcements/index.php'),
};

// ── Guard: call on every protected page ──────────────────────
async function requireLogin(allowedRoles = []) {
    try {
        const user = await Auth.me();
        if (!user) return;   // me() already redirects on 401
        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
            alert('Access denied.');
            window.location.href = '/teamforge/frontend/auth/login.html';
        }
        return user;
    } catch {
        window.location.href = '/teamforge/frontend/auth/login.html';
    }
}
