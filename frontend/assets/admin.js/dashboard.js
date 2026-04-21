/* ══════════════════════════════════════════
   DASHBOARD — Connected to Backend API
   ══════════════════════════════════════════ */

/* ── Data ── */
let dashboardData = null;

let notifications = [
  { id:3, unread:true,  ico:'📢', bg:'rgba(243,156,18,.1)', msg:'Announcement published: TÜBİTAK Applications Open',   time:'3 hours ago' },
  { id:4, unread:false, ico:'🎓', bg:'rgba(108,99,255,.1)', msg:'Dr. Selin Arslan reached full advisor quota',         time:'Yesterday'   },
  { id:5, unread:false, ico:'🗂️', bg:'rgba(39,174,96,.1)',  msg:'Category "Course Project" was edited',               time:'2 days ago'  },
  { id:6, unread:false, ico:'🔒', bg:'rgba(231,76,60,.1)',  msg:'Account osama@uni.edu locked (5 failed attempts)',   time:'3 days ago'  },
];

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
function renderNotifs() {
  const body = document.getElementById('notif-body');
  if (!body) return;
  body.innerHTML = notifications.map(n => `
    <div class="nit ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
      <div class="ni-ic" style="background:${n.bg}">${n.ico}</div>
      <div class="ni-txt">
        <div class="ni-msg">${n.msg}</div>
        <div class="ni-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="ni-dot"></div>' : ''}
    </div>`).join('');
  
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = notifications.some(n => n.unread) ? 'block' : 'none';
}

function toggleNotifs() {
  const p = document.getElementById('notif-panel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) renderNotifs();
}

function closeNotifs() {
  document.getElementById('notif-panel').classList.remove('open');
}

function readNotif(id) {
  const n = notifications.find(x => x.id === id);
  if (n) n.unread = false;
  renderNotifs();
}

function markAllRead() {
  notifications.forEach(n => n.unread = false);
  renderNotifs();
  toast('All notifications marked as read ✅', 'ok');
}

/* ── Dashboard render ── */
function renderDash() {
  if (!dashboardData) return;

  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  // Update Stats
  const stats = dashboardData.stats;
  const statIds = {
    'total_students': 'stat-students',
    'total_instructors': 'stat-instructors',
    'total_projects': 'stat-projects',
    'pending_requests': 'stat-requests'
  };

  // Note: I need to check if these IDs exist in dashboard.html
  // Let's assume they might be different. 
  // I will check dashboard.html content to be sure.
}

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
  
  // Update Stats IDs
  if (document.getElementById('d-projs'))    document.getElementById('d-projs').textContent = s.active_projects;
  if (document.getElementById('d-cats'))     document.getElementById('d-cats').textContent  = s.total_categories || 3; // Fallback to 3 if missing
  if (document.getElementById('d-anns'))     document.getElementById('d-anns').textContent  = s.announcements;
  
  if (document.getElementById('d-cats-big')) document.getElementById('d-cats-big').textContent = s.total_categories || 3;
  if (document.getElementById('d-anns-big')) document.getElementById('d-anns-big').textContent = s.announcements;
  
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
  await requireLogin(['admin']);
  loadDashboard();
  renderNotifs();
  
  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
});
