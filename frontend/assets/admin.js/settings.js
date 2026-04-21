/* ══════════════════════════════════════════
   SYSTEM SETTINGS — Connected to Backend API
   ══════════════════════════════════════════ */

let notifications = [
  { id:1, unread:true,  ico:'👤', bg:'rgba(0,168,181,.1)',  msg:'New user registered: Nisan Ay (Student)',           time:'2 min ago' },
  { id:2, unread:true,  ico:'📢', bg:'rgba(243,156,18,.1)', msg:'Announcement published: TÜBİTAK Applications Open', time:'3 hours ago' },
  { id:3, unread:false, ico:'🗂️', bg:'rgba(39,174,96,.1)',  msg:'Category "Course Project" was edited',             time:'2 days ago' },
];

function toast(msg, type = 'tinf') {
  const t = document.createElement('div');
  t.className = 'toast t' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function tn(el, key) {
  const val = el.checked !== undefined
    ? (el.checked ? 'enabled' : 'disabled')
    : `set to "${el.options[el.selectedIndex]?.text || el.value}"`;
  toast(`${key}: ${val}`, val === 'disabled' ? 'tinf' : 'ok');
}

function gSearch(q) {
  if (!q.trim()) return;
  const ql = q.toLowerCase();
  if (['tubitak', 'teknofest', 'announcement'].some(k => ql.includes(k))) {
    window.location = 'announcements.html';
  } else if (['categor', 'project'].some(k => ql.includes(k))) {
    window.location = 'categories.html';
  } else if (['user', 'admin', 'student', 'instructor'].some(k => ql.includes(k))) {
    window.location = 'users.html';
  } else {
    toast(`No results for "${q}"`, 'tinf');
  }
}

function aSec(id) {
  document.querySelectorAll('.asni').forEach(e => e.classList.remove('on'));
  document.getElementById('asn-' + id)?.classList.add('on');
  document.querySelectorAll('.asec').forEach(e => e.classList.remove('on'));
  document.getElementById('as-' + id)?.classList.add('on');
}

function hideBanner() {
  document.getElementById('maint-banner')?.classList.remove('show');
  document.getElementById('main-tbar').style.top = '0';
  const bannerToggle = document.getElementById('tog-banner');
  if (bannerToggle) bannerToggle.checked = false;
}

function syncBannerPreview() {
  const banner = document.getElementById('maint-banner');
  const tbar = document.getElementById('main-tbar');
  const bannerEnabled = document.getElementById('tog-banner')?.checked;
  const message = document.getElementById('cfg-maint-msg')?.value.trim() || 'Scheduled maintenance soon.';

  document.getElementById('maint-txt').textContent = message;

  if (bannerEnabled) {
    banner.classList.add('show');
    tbar.style.top = '44px';
  } else {
    banner.classList.remove('show');
    tbar.style.top = '0';
  }
}

function updatePlatformStatus(el) {
  if (!el.checked) {
    toast('Platform will be saved as offline after you click "Save All Changes".', 'twarn');
  } else {
    toast('Platform will remain online after saving.', 'ok');
  }
}

function toggleMaintBanner() {
  syncBannerPreview();
  toast('Maintenance banner preview updated.', 'ok');
}

function exportConfig() {
  const payload = buildPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'teamforge-config.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast('Config exported as teamforge-config.json', 'ok');
}

function buildPayload() {
  return {
    platform_name: document.getElementById('cfg-pname').value.trim(),
    institution_name: document.getElementById('cfg-uni').value.trim(),
    support_email: document.getElementById('cfg-email').value.trim(),
    platform_tagline: document.getElementById('cfg-tag').value.trim(),
    platform_description: document.getElementById('cfg-desc').value.trim(),
    platform_online: document.getElementById('tog-online').checked,
    show_maintenance_banner: document.getElementById('tog-banner').checked,
    maintenance_message: document.getElementById('cfg-maint-msg').value.trim(),
    registrations_open: document.getElementById('tog-registrations').checked,
    password_min_length: Number(document.getElementById('cfg-pass-min').value),
    require_uppercase: document.getElementById('cfg-require-uppercase').checked,
    require_numbers: document.getElementById('cfg-require-numbers').checked,
    require_special_chars: document.getElementById('cfg-require-special').checked,
    max_login_attempts: Number(document.getElementById('cfg-max-login-attempts').value),
    lockout_duration_minutes: Number(document.getElementById('cfg-lockout-duration').value),
  };
}

function applySettings(settings) {
  document.getElementById('cfg-pname').value = settings.platform_name || '';
  document.getElementById('cfg-uni').value = settings.institution_name || '';
  document.getElementById('cfg-email').value = settings.support_email || '';
  document.getElementById('cfg-tag').value = settings.platform_tagline || '';
  document.getElementById('cfg-desc').value = settings.platform_description || '';
  document.getElementById('tog-online').checked = !!settings.platform_online;
  document.getElementById('tog-banner').checked = !!settings.show_maintenance_banner;
  document.getElementById('cfg-maint-msg').value = settings.maintenance_message || '';
  document.getElementById('tog-registrations').checked = !!settings.registrations_open;
  document.getElementById('cfg-pass-min').value = String(settings.password_min_length || 8);
  document.getElementById('cfg-require-uppercase').checked = !!settings.require_uppercase;
  document.getElementById('cfg-require-numbers').checked = !!settings.require_numbers;
  document.getElementById('cfg-require-special').checked = !!settings.require_special_chars;
  document.getElementById('cfg-max-login-attempts').value = String(settings.max_login_attempts || 5);
  document.getElementById('cfg-lockout-duration').value = String(settings.lockout_duration_minutes || 15);
  document.getElementById('sb-logo-name').textContent = settings.platform_name || 'TeamForge';
  syncBannerPreview();
}

async function loadSettings() {
  try {
    const settings = await Admin.getSettings();
    applySettings(settings);
  } catch (err) {
    toast('Error loading settings: ' + err.message, 'er');
  }
}

async function saveAllSettings() {
  const payload = buildPayload();

  try {
    const settings = await Admin.updateSettings(payload);
    applySettings(settings);
    toast('All settings saved successfully.', 'ok');
  } catch (err) {
    toast('Error saving settings: ' + err.message, 'er');
  }
}

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
  const notif = notifications.find(n => n.id === id);
  if (notif) notif.unread = false;
  renderNotifs();
}

function markAllRead() {
  notifications.forEach(n => { n.unread = false; });
  renderNotifs();
  toast('All notifications marked as read.', 'ok');
}

document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) {
    closeNotifs();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['admin']);
  if (user) {
    const nameEl = document.querySelector('.un');
    if (nameEl) nameEl.textContent = user.full_name;
    loadSettings();
  }

  document.getElementById('cfg-pname')?.addEventListener('input', e => {
    document.getElementById('sb-logo-name').textContent = e.target.value.trim() || 'TeamForge';
  });
  document.getElementById('cfg-maint-msg')?.addEventListener('input', syncBannerPreview);

  renderNotifs();
});
