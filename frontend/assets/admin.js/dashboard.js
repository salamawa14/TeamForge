/* ══════════════════════════════════════════
   DASHBOARD — Connected to Backend API
   ══════════════════════════════════════════ */

/* ── Data ── */
let dashboardData = null;
let notifications = [];

/* ── Toast ── */
function toast(msg, type = 'tinf') {
  const t = document.createElement('div');
  t.className = 'toast t' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ── Search ── */
function gSearch(q) {
  if (!q.trim()) return;
  const ql = q.toLowerCase();
  if (['tubitak', 'teknofest', 'announcement', 'deadline', 'results'].some(k => ql.includes(k))) {
    window.location = 'announcements.html';
  } else if (['categor', 'project', 'course'].some(k => ql.includes(k))) {
    window.location = 'categories.html';
  } else {
    toast(`No results for "${q}"`, 'tinf');
  }
}

/* ── Notifications ── */
async function fetchNotifications() {
  try {
    const data = await Notifications.getAll();
    const rawNotifs = data.notifications || [];
    
    notifications = rawNotifs.map(n => ({
      id: n.notification_id,
      unread: !n.is_read,
      ico: n.type === 'join_request' ? '📨' : (n.type === 'advisor_request' ? '🎓' : '🔔'),
      bg: n.is_read ? 'rgba(0,0,0,.05)' : 'rgba(108,99,255,.1)',
      msg: n.message,
      time: timeAgo(n.created_at)
    }));
    
    renderNotifs();
  } catch (err) {
    console.error('Error fetching notifications:', err);
  }
}

function renderNotifs() {
  const body = document.getElementById('notif-body');
  if (!body) return;
  
  if (notifications.length === 0) {
    body.innerHTML = '<div style="padding:20px; text-align:center; color:#888;">No notifications yet.</div>';
  } else {
    body.innerHTML = notifications.map(n => `
      <div class="nit ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
        <div class="ni-ic" style="background:${n.bg}">${n.ico}</div>
        <div class="ni-txt">
          <div class="ni-msg">${n.msg}</div>
          <div class="ni-time">${n.time}</div>
        </div>
        ${n.unread ? '<div class="ni-dot"></div>' : ''}
      </div>`).join('');
  }
  
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = notifications.some(n => n.unread) ? 'block' : 'none';
}

function toggleNotifs() {
  const p = document.getElementById('notif-panel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) fetchNotifications();
}

function closeNotifs() {
  document.getElementById('notif-panel').classList.remove('open');
}

async function readNotif(id) {
  try {
    await Notifications.markRead(id);
    const n = notifications.find(x => x.id === id);
    if (n) n.unread = false;
    renderNotifs();
  } catch (err) {
    toast('Error marking notification as read.', 'er');
  }
}

async function markAllRead() {
  try {
    await Notifications.markAllRead();
    notifications.forEach(n => n.unread = false);
    renderNotifs();
    toast('All notifications marked as read ✅', 'ok');
  } catch (err) {
    toast('Error marking all as read.', 'er');
  }
}

/* ── Dashboard render ── */
async function loadDashboard() {
  try {
    dashboardData = await Admin.dashboard();
    updateUI();
  } catch (err) {
    toast('Error loading dashboard: ' + err.message, 'er');
  }
}

function updateUI() {
  if (!dashboardData) return;

  const s = dashboardData.stats;
  
  // Update Stats IDs - Fixed mapping and removed hardcoded fallbacks
  if (document.getElementById('d-projs'))     document.getElementById('d-projs').textContent = s.active_projects || 0;
  if (document.getElementById('d-cats'))      document.getElementById('d-cats').textContent  = s.total_categories || 0;
  if (document.getElementById('d-anns'))      document.getElementById('d-anns').textContent  = s.announcements || 0;
  
  if (document.getElementById('d-cats-big'))  document.getElementById('d-cats-big').textContent = s.total_categories || 0;
  if (document.getElementById('d-anns-big'))  document.getElementById('d-anns-big').textContent = s.announcements || 0;
  if (document.getElementById('d-projs-big')) document.getElementById('d-projs-big').textContent = s.active_projects || 0;
  
  // Recent Activity (using recent users and projects)
  const acts = [];
  
  dashboardData.recent_users.forEach(u => {
    acts.push({
      ico: '👤',
      bg: 'rgba(0,168,181,.1)',
      msg: `New user <strong>${u.full_name}</strong> (${u.role}) registered`,
      time: timeAgo(u.created_at)
    });
  });

  dashboardData.recent_projects.forEach(p => {
    acts.push({
      ico: '🚀',
      bg: 'rgba(108,99,255,.1)',
      msg: `New project <strong>"${p.title}"</strong> created by ${p.owner_name}`,
      time: timeAgo(p.created_at)
    });
  });

  const activityEl = document.getElementById('dash-activity');
  if (activityEl) {
    if (acts.length === 0) {
      activityEl.innerHTML = '<div style="padding:20px; text-align:center; color:#888;">No recent activity.</div>';
    } else {
      activityEl.innerHTML = acts.map(a => `
        <div class="act-item">
          <div class="act-ico" style="background:${a.bg}">${a.ico}</div>
          <div class="act-body">
            <div class="act-msg">${a.msg}</div>
            <div class="act-time">${a.time}</div>
          </div>
        </div>`).join('');
    }
  }
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm ago';
  if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h ago';
  return Math.floor(diffInSeconds / 86400) + 'd ago';
}

function refreshDash() {
  loadDashboard();
  toast('Dashboard refreshed ✅', 'ok');
}

/* ── Click outside closes notif panel ── */
document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn   = document.getElementById('notif-btn');
  if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) {
    closeNotifs();
  }
});

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['admin']);
  if (user) {
    // Update sidebar user info
    const nameEl = document.querySelector('.un');
    if (nameEl) nameEl.textContent = user.full_name;
    
    const roleEl = document.querySelector('.ud');
    if (roleEl) roleEl.textContent = 'System Admin'; // Or use user.role if appropriate
    
    const avatarEl = document.querySelector('.av');
    if (avatarEl) {
      avatarEl.textContent = user.full_name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
    }
  }
  
  loadDashboard();
  fetchNotifications();
  
  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
});
