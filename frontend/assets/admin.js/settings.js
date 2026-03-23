/* ══════════════════════════════════════════
   SYSTEM SETTINGS — fully self-contained script
   ══════════════════════════════════════════ */

/* ── Data ── */
let notifications = [
  { id:1, unread:true,  ico:'👤', bg:'rgba(0,168,181,.1)',  msg:'New user registered: Nisan Ay (Student)',             time:'2 min ago'   },
  { id:2, unread:true,  ico:'⚠️', bg:'rgba(231,76,60,.1)',  msg:'User "beza@uni.edu" deactivated',                     time:'1 hour ago'  },
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

/* ── Toggle helper ── */
function tn(el, key) {
  const val = el.checked !== undefined
    ? (el.checked ? 'enabled' : 'disabled')
    : `set to "${el.value}"`;
  toast(`${key}: ${val}`, val === 'disabled' ? 'tinf' : 'ok');
}

/* ── Search ── */
function gSearch(q) {
  if (!q.trim()) return;
  const ql = q.toLowerCase();
  if (['tubitak', 'teknofest', 'announcement'].some(k => ql.includes(k))) {
    window.location = 'announcements.html';
  } else if (['categor', 'project'].some(k => ql.includes(k))) {
    window.location = 'categories.html';
  } else {
    toast(`No results for "${q}"`, 'tinf');
  }
}

/* ── Settings left-nav switching ── */
function aSec(id) {
  document.querySelectorAll('.asni').forEach(e => e.classList.remove('on'));
  document.getElementById('asn-' + id)?.classList.add('on');
  document.querySelectorAll('.asec').forEach(e => e.classList.remove('on'));
  document.getElementById('as-' + id)?.classList.add('on');
}

/* ── Save all settings ── */
function saveAllSettings() {
  const pname = document.getElementById('cfg-pname')?.value.trim();
  if (pname) document.getElementById('sb-logo-name').textContent = pname;
  toast('All settings saved ✅', 'ok');
}

/* ── Export config ── */
function exportConfig() {
  toast('Config exported as teamforge-config.json 📥', 'ok');
}

/* ── Platform online/offline ── */
function updatePlatformStatus(el) {
  if (!el.checked) {
    if (!confirm('Take the platform OFFLINE? All non-admin users will see a maintenance page.')) {
      el.checked = true; return;
    }
    toast('Platform is now OFFLINE — maintenance mode active.', 'er');
  } else {
    toast('Platform is back ONLINE ✅', 'ok');
  }
}

/* ── Maintenance banner toggle ── */
function toggleMaintBanner(el) {
  const banner = document.getElementById('maint-banner');
  const tbar   = document.getElementById('main-tbar');
  if (el.checked) {
    const msg = document.getElementById('cfg-maint-msg')?.value || 'Scheduled maintenance soon.';
    document.getElementById('maint-txt').textContent = msg;
    banner.classList.add('show');
    tbar.style.top = '44px';
    toast('Maintenance banner is now visible to all users ⚠️', 'twarn');
  } else {
    banner.classList.remove('show');
    tbar.style.top = '0';
    toast('Maintenance banner hidden', 'tinf');
  }
}

/* ── Dismiss banner ── */
function hideBanner() {
  document.getElementById('maint-banner').classList.remove('show');
  document.getElementById('main-tbar').style.top = '0';
  document.getElementById('tog-banner').checked  = false;
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
renderNotifs();
