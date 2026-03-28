// ============================================================
//  EXAMPLE: How to update Student-Dashboard.js
//  Shows the pattern for every page — load data, render it.
// ============================================================

// In dashboard.html, add BEFORE your dashboard JS:
//   <script src="../../assets/js/api.js"></script>

document.addEventListener('DOMContentLoaded', async () => {

    // 1. Guard — redirects to login if not authenticated
    const user = await requireLogin(['student']);
    if (!user) return;

    // 2. Show the user's name wherever needed
    const nameEl = document.getElementById('student-name');  // adjust selector
    if (nameEl) nameEl.textContent = user.full_name;

    try {
        // 3. Load dashboard data from the backend
        const data = await Student.dashboard();

        // 4. Populate stats
        document.getElementById('stat-projects-owned')?.textContent  = data.stats.projects_owned;
        document.getElementById('stat-projects-joined')?.textContent = data.stats.projects_joined;
        document.getElementById('stat-pending')?.textContent         = data.stats.pending_requests;

        // 5. Render announcements
        const annContainer = document.getElementById('announcements-list');
        if (annContainer && data.announcements.length) {
            annContainer.innerHTML = data.announcements.map(a => `
                <div class="announcement-card">
                    <h4>${a.title}</h4>
                    <p>${a.description}</p>
                    <small>${new Date(a.published_at).toLocaleDateString()}</small>
                </div>
            `).join('');
        }

        // 6. Render notifications
        const notifContainer = document.getElementById('notifications-list');
        if (notifContainer && data.notifications.length) {
            notifContainer.innerHTML = data.notifications.map(n => `
                <div class="notif-item ${n.is_read ? '' : 'unread'}">
                    <p>${n.message}</p>
                    <small>${new Date(n.created_at).toLocaleDateString()}</small>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error('Dashboard error:', err.message);
    }

    // 7. Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await Auth.logout();
            window.location.href = '../../auth/login.html';
        });
    }
});
