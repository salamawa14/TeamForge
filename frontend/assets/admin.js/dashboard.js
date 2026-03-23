/* ══════════════════════════════════════════
   DASHBOARD — fully self-contained script
   ══════════════════════════════════════════ */

/* ── Data ──     { id:1, unread:true,  ico:'👤', bg:'rgba(0,168,181,.1)',  msg:'New user registered: Nisan Ay (Student)',             time:'2 min ago'   },
  { id:2, unread:true,  ico:'⚠️', bg:'rgba(231,76,60,.1)',  msg:'User "beza@uni.edu" deactivated',                     time:'1 hour ago'  },*/
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
  document.getElementById('notif-body').innerHTML = notifications.map(n => `
    <div class="nit ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
      <div class="ni-ic" style="background:${n.bg}">${n.ico}</div>
      <div class="ni-txt">
        <div class="ni-msg">${n.msg}</div>
        <div class="ni-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="ni-dot"></div>' : ''}
    </div>`).join('');
  document.getElementById('notif-dot').style.display =
    notifications.some(n => n.unread) ? 'block' : 'none';
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
  notifications.find(n => n.id === id).unread = false;
  renderNotifs();
}

function markAllRead() {
  notifications.forEach(n => n.unread = false);
  renderNotifs();
  toast('All notifications marked as read ✅', 'ok');
}

/* ── Dashboard render ── */
function renderDash() {
  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const acts = [
    
    { ico:'📢', bg:'rgba(243,156,18,.1)', msg:'Announcement <strong>"TÜBİTAK Open"</strong> published',     time:'3 hrs ago'  },
    { ico:'✏️', bg:'rgba(108,99,255,.1)', msg:'Category <strong>"Course Project"</strong> edited',          time:'Yesterday'  },
    { ico:'🔒', bg:'rgba(231,76,60,.1)',  msg:'Account <strong>osama@uni.edu</strong> locked — 5 attempts', time:'2 days ago' },
    { ico:'🎓', bg:'rgba(39,174,96,.1)',  msg:'<strong>Dr. Ahmet Kaplan</strong> reached advisor quota',    time:'3 days ago' },
  ];

  document.getElementById('dash-activity').innerHTML = acts.map(a => `
    <div class="act-item">
      <div class="act-ico" style="background:${a.bg}">${a.ico}</div>
      <div class="act-body">
        <div class="act-msg">${a.msg}</div>
        <div class="act-time">${a.time}</div>
      </div>
    </div>`).join('');
}

function refreshDash() {
  renderDash();
  toast('Dashboard refreshed ✅', 'ok');
}

/* ── Click outside closes notif panel ── */
document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn   = document.getElementById('notif-btn');
  if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) {
    closeNotifs();
  }
});

/* ── Boot ──     { ico:'👤', bg:'rgba(0,168,181,.1)',  msg:'New user <strong>Nisan Ay</strong> registered',              time:'2 min ago'  },*/
renderDash();
renderNotifs();
