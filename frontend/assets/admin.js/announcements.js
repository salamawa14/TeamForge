/* ══════════════════════════════════════════
   ANNOUNCEMENTS — fully self-contained script
   ══════════════════════════════════════════ */

/* ── Data ── */
let announcements = [
  { id:1, title:'TÜBİTAK 2209-A Applications Open',   cat:'TÜBİTAK',  priority:'high',   desc:'Application window for 2026 now open. Max 4 students, budget ₺9,000. Deadline: April 15.', date:'Mar 4, 2026'  },
  { id:2, title:'Teknofest 2026 Registration Open',    cat:'Teknofest', priority:'normal', desc:'Interdisciplinary teams encouraged. Register on official portal before May 1.',             date:'Feb 28, 2026' },
  { id:3, title:'TÜBİTAK Oct 2025 Results Announced', cat:'TÜBİTAK',  priority:'normal', desc:'Results for 2209-B projects from Oct 2025 are published. Check e-Bideb portal.',           date:'Feb 20, 2026' },
];

let notifications = [
  { id:1, unread:true,  ico:'👤', bg:'rgba(0,168,181,.1)',  msg:'New user registered: Nisan Ay (Student)',             time:'2 min ago'   },
  { id:2, unread:true,  ico:'⚠️', bg:'rgba(231,76,60,.1)',  msg:'User "beza@uni.edu" deactivated',                     time:'1 hour ago'  },
  { id:3, unread:true,  ico:'📢', bg:'rgba(243,156,18,.1)', msg:'Announcement published: TÜBİTAK Applications Open',   time:'3 hours ago' },
  { id:4, unread:false, ico:'🎓', bg:'rgba(108,99,255,.1)', msg:'Dr. Selin Arslan reached full advisor quota',         time:'Yesterday'   },
  { id:5, unread:false, ico:'🗂️', bg:'rgba(39,174,96,.1)',  msg:'Category "Course Project" was edited',               time:'2 days ago'  },
  { id:6, unread:false, ico:'🔒', bg:'rgba(231,76,60,.1)',  msg:'Account osama@uni.edu locked (5 failed attempts)',   time:'3 days ago'  },
];

const ANN_ICONS = { TÜBİTAK:'🔬', Teknofest:'🚀', Course:'📋', System:'🔧' };
const ANN_BADGE  = { TÜBİTAK:'bt', Teknofest:'bk', Course:'bc', System:'bp' };

/* ── Toast ── */
function toast(msg, type = 'tinf') {
  const t = document.createElement('div');
  t.className = 'toast t' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ── Close modal ── */
function closeMol(id) {
  document.getElementById(id).style.display = 'none';
}

/* ── Search ── */
function gSearch(q) {
  if (!q.trim()) return;
  const ql = q.toLowerCase();
  if (announcements.some(a => a.title.toLowerCase().includes(ql))) {
    toast(`Showing results for "${q}"`, 'tinf');
  } else {
    window.location = 'categories.html';
  }
}

/* ── Render announcements ── */
function renderAnns() {
  const el = document.getElementById('anns-list');
  if (!el) return;
  if (!announcements.length) {
    el.innerHTML = '<p class="empty-msg">No announcements yet.</p>';
    return;
  }
  el.innerHTML = announcements.map(a => `
    <div class="ann-item">
      <div class="ann-ico${a.priority === 'urgent' ? ' ann-ico-urgent' : ''}">${ANN_ICONS[a.cat] || '📢'}</div>
      <div class="ann-body">
        ${a.priority === 'urgent' ? '<span class="bdg brej ann-pri-tag">🚨 Urgent</span><br>' : ''}
        ${a.priority === 'high'   ? '<span class="bdg bk ann-pri-tag">⬆ High Priority</span><br>' : ''}
        <span class="bdg ${ANN_BADGE[a.cat] || 'bc'}">${a.cat}</span>
        <div class="ann-title">${a.title}</div>
        <div class="ann-desc">${a.desc}</div>
        <div class="ann-foot">
          <span>📅 ${a.date}</span>
          ${a.expiry ? `<span>⏳ Expires ${a.expiry}</span>` : ''}
        </div>
      </div>
      <div class="ann-actions">
        <button class="btn btn-o btn-sm" onclick="editAnn(${a.id})">✏️ Edit</button>
        <button class="btn btn-er btn-sm" onclick="deleteAnn(${a.id})">🗑 Delete</button>
      </div>
    </div>`).join('');
}

/* ── Open new announcement modal ── */
function openAnnModal() {
  ['ann-title', 'ann-desc', 'ann-expiry'].forEach(i => document.getElementById(i).value = '');
  document.getElementById('ann-cat').value      = 'TÜBİTAK';
  document.getElementById('ann-priority').value = 'normal';
  document.getElementById('ann-modal').dataset.editId = '';
  document.getElementById('ann-modal-title').textContent = 'Publish Announcement';
  document.getElementById('ann-modal').style.display = 'flex';
}

/* ── Edit announcement ── */
function editAnn(id) {
  const a = announcements.find(x => x.id === id);
  document.getElementById('ann-title').value    = a.title;
  document.getElementById('ann-desc').value     = a.desc;
  document.getElementById('ann-cat').value      = a.cat;
  document.getElementById('ann-priority').value = a.priority || 'normal';
  document.getElementById('ann-expiry').value   = a.expiry || '';
  document.getElementById('ann-modal').dataset.editId = id;
  document.getElementById('ann-modal-title').textContent = 'Edit Announcement';
  document.getElementById('ann-modal').style.display = 'flex';
}

/* ── Save announcement ── */
function saveAnn() {
  const title    = document.getElementById('ann-title').value.trim();
  const desc     = document.getElementById('ann-desc').value.trim();
  const cat      = document.getElementById('ann-cat').value;
  const priority = document.getElementById('ann-priority').value;
  const expiry   = document.getElementById('ann-expiry').value;

  if (!title || !desc) { toast('Please fill title and description', 'er'); return; }

  const eId   = document.getElementById('ann-modal').dataset.editId;
  const today = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

  if (eId) {
    Object.assign(announcements.find(x => x.id == eId), { title, desc, cat, priority, expiry });
    toast('Announcement updated ✅', 'ok');
  } else {
    announcements.unshift({ id: Date.now(), title, cat, priority, desc, date: today, expiry });
    toast('Announcement published! 📢', 'ok');
  }

  closeMol('ann-modal');
  renderAnns();
}

/* ── Delete announcement ── */
function deleteAnn(id) {
  const a = announcements.find(x => x.id === id);
  if (!a) return;
  document.getElementById('confirm-icon').textContent  = '📢';
  document.getElementById('confirm-title').textContent = 'Delete Announcement';
  document.getElementById('confirm-sub').textContent   = 'This will remove it from all user feeds immediately.';
  document.getElementById('confirm-body').innerHTML    = `Are you sure you want to delete <strong>"${a.title}"</strong>?`;
  _confirmCallback = () => {
    announcements = announcements.filter(x => x.id !== id);
    renderAnns();
    toast('Announcement deleted.', 'er');
  };
  document.getElementById('confirm-modal').style.display = 'flex';
}

/* ── Confirm modal ── */
let _confirmCallback = null;
function closeConfirm() {
  document.getElementById('confirm-modal').style.display = 'none';
  _confirmCallback = null;
}
function runConfirm() {
  const cb = _confirmCallback;
  closeConfirm();
  if (cb) cb();
}

/* ── Template bar ── */
function toggleTemplates() {
  document.getElementById('tpl-bar').classList.toggle('open');
}

function fillAnnTemplate(type) {
  const T = {
    tubitak:   { title:'TÜBİTAK 2209-A Deadline Reminder',    cat:'TÜBİTAK',  priority:'high',
                 desc:'Reminder: TÜBİTAK 2209-A undergraduate research project deadline is approaching. Ensure your team is complete and advisor is confirmed before submitting via the e-Bideb portal.' },
    teknofest: { title:'Teknofest 2026 Registration Now Open', cat:'Teknofest', priority:'high',
                 desc:'Teknofest 2026 project registrations are now open! Form interdisciplinary teams and register on the official Teknofest portal. Advisor confirmation is required for all teams.' },
    results:   { title:'Project Results Announced',            cat:'TÜBİTAK',  priority:'normal',
                 desc:'Results for the latest project cycle have been announced. Students can check their project status via the e-Bideb portal or contact their advisor directly for further details.' },
    maint:     { title:'Scheduled Platform Maintenance',       cat:'System',    priority:'urgent',
                 desc:'TeamForge will undergo scheduled maintenance. The platform will be temporarily unavailable during this window. Please save all your work beforehand. We apologize for any inconvenience.' },
  };
  const t = T[type]; if (!t) return;
  document.getElementById('tpl-bar').classList.remove('open');
  openAnnModal();
  document.getElementById('ann-title').value    = t.title;
  document.getElementById('ann-cat').value      = t.cat;
  document.getElementById('ann-priority').value = t.priority;
  document.getElementById('ann-desc').value     = t.desc;
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
function closeNotifs() { document.getElementById('notif-panel').classList.remove('open'); }
function readNotif(id) { notifications.find(n => n.id === id).unread = false; renderNotifs(); }
function markAllRead() {
  notifications.forEach(n => n.unread = false);
  renderNotifs();
  toast('All notifications marked as read ✅', 'ok');
}

/* ── Click outside closes notif panel ── */
document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn   = document.getElementById('notif-btn');
  if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target))
    closeNotifs();
});

/* ── Boot ── */
renderAnns();
renderNotifs();
