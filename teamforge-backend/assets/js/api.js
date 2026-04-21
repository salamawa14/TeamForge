// ============================================================
//  assets/js/api.js
//  Paste a <script src="../assets/js/api.js"></script> into
//  every HTML page.  Adjust BASE_URL if your XAMPP port differs.
// ============================================================

// Detect project root automatically (supports Docker root and XAMPP subdirectories)
const PROJECT_ROOT = window.location.pathname.toLowerCase().includes('/teamforge/') ? '/TeamForge' : '';
const BASE_URL = PROJECT_ROOT + '/teamforge-backend/api';

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
        window.location.href = PROJECT_ROOT + '/frontend/auth/login.html';
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
    setAvailability:  (dataOrStatus, timezone = null) => {
        const payload = typeof dataOrStatus === 'object' && dataOrStatus !== null
            ? dataOrStatus
            : { advising_status: dataOrStatus, timezone };
        return apiRequest('/instructors/availability.php', 'PUT', payload);
    },
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

    // System settings
    getSettings:      () => apiRequest('/admin/settings.php'),
    updateSettings:   (data) => apiRequest('/admin/settings.php', 'PUT', data),
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
    getAll: () => apiRequest('/admin/announcements.php'),
};

// ── Global User Info Loader ───────────────────────────────────
async function loadGlobalUserInfo() {
    try {
        // Fetch full profile info (works for instructors/students)
        const role = localStorage.getItem('user_role');
        let profile = null;
        
        if (role === 'instructor') {
            profile = await Instructor.getProfile();
        } else if (role === 'student') {
            profile = await Student.getProfile();
        }

        if (profile) {
            // Target all possible sidebar variations
            const nameEls = document.querySelectorAll('.sidebar-user .user-name, .sidebar-user .u-name, #sidebar-name, #profile-display-name');
            const subEls  = document.querySelectorAll('.sidebar-user .user-sub, .sidebar-user .u-sub, #sidebar-dept, .profile-role');
            const avEls   = document.querySelectorAll('.sidebar-user .avatar, #sidebar-avatar, #profile-avatar-initials');

            const fullName = profile.full_name || 'User';
            const subText  = profile.academic_title ? `${profile.academic_title} · ${profile.department}` : (profile.department || '');
            const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();

            nameEls.forEach(el => el.textContent = fullName);
            subEls.forEach(el => el.textContent  = subText || profile.role || '');
            avEls.forEach(el => el.textContent   = initials || '??');
        }
    } catch (err) {
        console.error("Global UI Sync Error:", err);
    }
}

// ── Guard: call on every protected page ──────────────────────
async function requireLogin(allowedRoles = []) {
    try {
        const user = await Auth.me();
        if (!user) return;   // me() already redirects on 401
        
        // Store role for global info loader
        localStorage.setItem('user_role', user.role);

        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
            alert('Access denied.');
            window.location.href = PROJECT_ROOT + '/frontend/auth/login.html';
            return null;
        }

        // Run sync in background so page load isn't blocked
        loadGlobalUserInfo();

        return user;
    } catch (err) {
        console.error("Auth Guard Error:", err);
        window.location.href = PROJECT_ROOT + '/frontend/auth/login.html';
    }
}
// ── Load notifications into panel (call on every page) ────────
async function loadNotifications() {
  const panel = document.getElementById('nPanel');
  const dot   = document.querySelector('.notif-dot');
  if (!panel) return;

  try {
    const data = await Notifications.getAll();
    const notifs      = data.notifications || [];
    const unreadCount = data.unread_count  || 0;

    // Show/hide red dot on bell
    if (dot) dot.style.display = unreadCount > 0 ? 'block' : 'none';

    // Update unread count badge in panel header
    const countEl = document.getElementById('notif-unread-count');
    if (countEl) {
      countEl.textContent  = unreadCount > 0 ? `(${unreadCount})` : '';
      countEl.style.color  = 'var(--teal)';
      countEl.style.fontSize = '.75rem';
    }

    if (!notifs.length) {
      panel.innerHTML = `
        <div class="np-head">Notifications</div>
        <div style="padding:24px;text-align:center;color:var(--t3);font-size:.85rem">
          No notifications yet
        </div>`;
      return;
    }

    const typeIcon = {
      join_request:       '📨',
      application_update: '✅',
      advisor_request:    '🎓',
      advisor_response:   '🎓',
    };

    function timeAgo(str) {
      const diff  = Date.now() - new Date(str).getTime();
      const mins  = Math.floor(diff / 60000);
      const hours = Math.floor(mins / 60);
      const days  = Math.floor(hours / 24);
      if (days >= 1)  return `${days}d ago`;
      if (hours >= 1) return `${hours}h ago`;
      return `${mins}m ago`;
    }

    panel.innerHTML = `
      <div class="np-head">
        Notifications
        <span id="notif-unread-count" style="color:var(--teal);font-size:.75rem">
          ${unreadCount > 0 ? `(${unreadCount})` : ''}
        </span>
        ${unreadCount > 0
          ? `<button id="markAllBtn" style="margin-left:auto;font-size:.72rem;color:var(--teal);background:none;border:none;cursor:pointer">Mark all read</button>`
          : ''}
      </div>
      ${notifs.map(n => `
        <div class="np-item ${n.is_read ? '' : 'unread'}"
             data-id="${n.notification_id}"
             style="cursor:pointer">
          <span class="np-ico">${typeIcon[n.type] || '🔔'}</span>
          <div class="np-body">
            <strong>${n.type.replace(/_/g,' ')}</strong>
            <span>${n.message}</span>
            <span style="font-size:.7rem;color:var(--t3)">${timeAgo(n.created_at)}</span>
          </div>
        </div>
      `).join('')}
    `;

    // Mark individual as read on click
    panel.querySelectorAll('.np-item[data-id]').forEach(item => {
      item.addEventListener('click', async () => {
        if (item.classList.contains('unread')) {
          item.classList.remove('unread');
          await Notifications.markRead(item.dataset.id).catch(() => {});
          // Update dot
          const remaining = panel.querySelectorAll('.np-item.unread').length;
          if (dot) dot.style.display = remaining > 0 ? 'block' : 'none';
          const countEl2 = document.getElementById('notif-unread-count');
          if (countEl2) countEl2.textContent = remaining > 0 ? `(${remaining})` : '';
        }
      });
    });

    // Mark all read button
    document.getElementById('markAllBtn')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      await Notifications.markAllRead().catch(() => {});
      panel.querySelectorAll('.np-item.unread').forEach(i => i.classList.remove('unread'));
      if (dot) dot.style.display = 'none';
      document.getElementById('markAllBtn')?.remove();
      const countEl3 = document.getElementById('notif-unread-count');
      if (countEl3) countEl3.textContent = '';
    });

  } catch (err) {
    console.error('Notifications error:', err.message);
  }
}
