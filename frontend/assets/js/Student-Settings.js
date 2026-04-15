/* ═══════════════════════════════════════════════
   Settings.js  —  Backend Connected 
   ═══════════════════════════════════════════════ */

'use strict';

/* ───────────────────── TOAST ───────────────────── */
function showToast(msg, type = '') {
  let el = document.getElementById('_tf_toast');
  if (!el) {
    el = document.createElement('div');
    el.id = '_tf_toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 3400);
}

/* ─────────────── PASSWORD STRENGTH ─────────────── */
function initStrength(inputId, barId, lblId) {
  const inp = document.getElementById(inputId);
  const bar = document.getElementById(barId);
  const lbl = document.getElementById(lblId);
  if (!inp || !bar || !lbl) return;

  inp.addEventListener('input', () => {
    const v = inp.value;
    let score = 0;
    if (v.length >= 8)           score++;
    if (/[A-Z]/.test(v))         score++;
    if (/[0-9]/.test(v))         score++;
    if (/[^A-Za-z0-9]/.test(v))  score++;

    const levels = [
      { w: '0%',   bg: 'var(--border)', text: '' },
      { w: '25%',  bg: 'var(--red)',    text: 'Weak' },
      { w: '50%',  bg: 'var(--amber)',  text: 'Fair' },
      { w: '75%',  bg: 'var(--teal)',   text: 'Good' },
      { w: '100%', bg: 'var(--green)',  text: 'Strong' }
    ];
    bar.style.width      = levels[score].w;
    bar.style.background = levels[score].bg;
    lbl.textContent      = levels[score].text;
    lbl.style.color      = levels[score].bg;
  });
}

/* ─────────────── PASSWORD UPDATE (BACKEND CONNECTED) ─────────────── */
async function doUpdatePw(curId, newId, confId, barId, lblId) {
  const cur  = document.getElementById(curId);
  const nw   = document.getElementById(newId);
  const conf = document.getElementById(confId);
  const btn  = document.getElementById('updatePwBtn');

  [cur, nw, conf].forEach(el => el && el.classList.remove('err'));

  if (!cur.value.trim()) {
    showToast('Please enter your current password.', 'err');
    cur.classList.add('err');
    return;
  }
  if (nw.value.length < 8) {
    showToast('New password must be at least 8 characters.', 'err');
    nw.classList.add('err');
    return;
  }
  if (nw.value !== conf.value) {
    showToast('Passwords do not match.', 'err');
    conf.classList.add('err');
    return;
  }

  // 1. Disable button to prevent double-clicks
  if(btn) { btn.disabled = true; btn.textContent = 'Updating...'; }

  // 2. Send request to backend
  try {
      // Assuming you create a change-password.php endpoint
      await apiRequest('/auth/change-password.php', 'POST', {
          current_password: cur.value,
          new_password: nw.value
      });

      showToast('✓ Password updated successfully!', 'ok');
      cur.value = ''; nw.value = ''; conf.value = '';
      
      const bar = document.getElementById(barId);
      const lbl = document.getElementById(lblId);
      if (bar) { bar.style.width = '0%'; bar.style.background = 'var(--border)'; }
      if (lbl) lbl.textContent = '';

  } catch (err) {
      showToast(err.message || 'Failed to update password.', 'error');
  } finally {
      if(btn) { btn.disabled = false; btn.textContent = 'Update Password'; }
  }
}

/* ═══════════════════ DOM READY ═══════════════════ */
document.addEventListener('DOMContentLoaded', async () => {

  // Guard — redirect to login if not logged in
  const user = await requireLogin(['student']);
  if (!user) return;

  /* ── Mobile sidebar toggle ── */
  const sb   = document.getElementById('sb');
  const burg = document.getElementById('burg');
  burg?.addEventListener('click', () => sb.classList.toggle('open'));
  
  /* ── Notification dropdown ── */
  const nBtn   = document.getElementById('nBtn');
  const nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => {
    e.stopPropagation();
    nPanel.classList.toggle('open');
  });

  /* ── Settings inner nav ── */
  const navItems = document.querySelectorAll('.sn-item');
  const sections = document.querySelectorAll('.sec');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const target = 'sec-' + item.dataset.sec;
      sections.forEach(s => s.classList.toggle('on', s.id === target));
    });
  });

  /* ── Theme & Language picker (UI Only) ── */
  document.querySelectorAll('.t-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.t-opt').forEach(o => o.classList.remove('on'));
      opt.classList.add('on');
      showToast('Theme set to ' + opt.dataset.theme, 'ok');
    });
  });

  document.querySelectorAll('.l-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.l-opt').forEach(o => o.classList.remove('on'));
      opt.classList.add('on');
      showToast('Language updated!', 'ok');
    });
  });

  /* ── Password strength watchers ── */
  initStrength('pNew', 'pStrBar', 'pStrLbl');   // Privacy section
  initStrength('sNew', 'sStrBar', 'sStrLbl');   // Security section

  /* ── Password update execution ── */
  document.getElementById('updatePwBtn')?.addEventListener('click', () => {
    doUpdatePw('pCur', 'pNew', 'pConf', 'pStrBar', 'pStrLbl');
  });

  /* ── err class cleanup on input ── */
  document.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => inp.classList.remove('err'));
  });

});