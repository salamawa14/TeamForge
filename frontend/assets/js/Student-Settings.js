/* ═══════════════════════════════════════════════
   Settings.js  —  TeamForge Settings Page Logic
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

/* ─────────────── DANGER CONFIRM DIALOG ─────────────── */
function dangerConfirm(action) {
  const map = {
    pause: {
      title: 'Pause Account',
      msg:   'Temporarily hide your profile from all student searches. You can reactivate anytime.',
      cta:   'Pause Account',
      red:   false
    },
    delete: {
      title: '⚠ Delete Account',
      msg:   'Permanently delete your account and all associated data. This action cannot be undone.',
      cta:   'Delete Account',
      red:   true
    }
  };
  const d = map[action];
  if (!d) return;

  const ov = document.createElement('div');
  ov.className = 'confirm-ov';
  ov.innerHTML = `
    <div class="confirm-box">
      <h3>${d.title}</h3>
      <p>${d.msg}</p>
      <div class="confirm-acts">
        <button class="btn-outline" style="padding:8px 16px;font-size:.8rem"
          onclick="this.closest('.confirm-ov').remove()">Cancel</button>
        <button style="background:${d.red ? 'var(--red)' : 'var(--teal)'};color:${d.red ? '#fff' : 'var(--navy)'};border:none;border-radius:var(--r2);padding:8px 16px;font-size:.8rem;font-weight:700;cursor:pointer;font-family:var(--font)"
          onclick="this.closest('.confirm-ov').remove();showToast('Action cancelled for demo.','')">
          ${d.cta}
        </button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
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

/* ─────────────── PASSWORD UPDATE ─────────────── */
function doUpdatePw(curId, newId, confId, barId, lblId) {
  const cur  = document.getElementById(curId);
  const nw   = document.getElementById(newId);
  const conf = document.getElementById(confId);

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

  // Simulate success
  showToast('✓ Password updated successfully!', 'ok');
  cur.value = ''; nw.value = ''; conf.value = '';
  const bar = document.getElementById(barId);
  const lbl = document.getElementById(lblId);
  if (bar) { bar.style.width = '0%'; bar.style.background = 'var(--border)'; }
  if (lbl) lbl.textContent = '';
}

/* ═══════════════════ DOM READY ═══════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile sidebar toggle ── */
  const sb   = document.getElementById('sb');
  const burg = document.getElementById('burg');
  burg?.addEventListener('click', () => sb.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg)
      sb.classList.remove('open');
  });

  /* ── Notification dropdown ── */
  const nBtn   = document.getElementById('nBtn');
  const nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => {
    e.stopPropagation();
    nPanel.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn)
      nPanel.classList.remove('open');
  });

  /* ── Global search ── */
  document.getElementById('gs')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      sessionStorage.setItem('bq', e.target.value.trim());
      window.location.href = 'Browse-Projects.html';
    }
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

  /* ── Save Changes button ── */
  document.getElementById('saveBtn')?.addEventListener('click', () => {
    // Find active section name
    const activeItem = document.querySelector('.sn-item.active');
    const section = activeItem?.textContent?.trim() || 'Settings';
    showConfirm({
      icon: '💾', iconBg: 'rgba(0,184,184,.12)',
      title: 'Save Changes?',
      subtitle: section,
      desc: 'Your settings will be saved and applied immediately.',
      confirmLabel: '💾 Save Changes',
      confirmColor: '#00b8b8', confirmFg: '#1a2540',
      onConfirm: () => showToast('✓ Settings saved successfully!', 'ok')
    });
  });

  /* ── Skill chip input (Academic Info) ── */
  const chipInp = document.getElementById('chipInp');
  chipInp?.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && chipInp.value.trim()) {
      e.preventDefault();
      const val = chipInp.value.replace(',', '').trim();
      if (!val) return;
      const chip = document.createElement('span');
      chip.className = 's-chip';
      chip.innerHTML = `${val} <button type="button" onclick="event.stopPropagation();this.parentElement.remove()">✕</button>`;
      chipInp.parentElement.insertBefore(chip, chipInp);
      chipInp.value = '';
    }
    if (e.key === 'Backspace' && !chipInp.value) {
      const chips = chipInp.parentElement.querySelectorAll('.s-chip');
      if (chips.length) chips[chips.length - 1].remove();
    }
  });

  /* ── Theme picker (Appearance) ── */
  document.querySelectorAll('.t-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.t-opt').forEach(o => o.classList.remove('on'));
      opt.classList.add('on');
      showToast('Theme set to ' + opt.dataset.theme, 'ok');
    });
  });

  /* ── Language picker (Appearance) ── */
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

  /* ── Password update — Privacy section ── */
  document.getElementById('updatePwBtn')?.addEventListener('click', () => {
    doUpdatePw('pCur', 'pNew', 'pConf', 'pStrBar', 'pStrLbl');
  });

  /* ── err class cleanup on input ── */
  document.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => inp.classList.remove('err'));
  });

});
/* ═══════════════════════════════════════════════════
   showConfirm(options) — Shared Confirm Popup
   options: {
     icon, iconBg, title, subtitle, desc,
     confirmLabel, confirmColor,
     cancelLabel, onConfirm
   }
═══════════════════════════════════════════════════ */
function showConfirm(opts) {
  document.getElementById('_confirmOv')?.remove();

  const ov = document.createElement('div');
  ov.id = '_confirmOv';
  ov.className = 'sc-overlay';

  const iconBg    = opts.iconBg    || 'rgba(0,184,184,.12)';
  const confirmBg = opts.confirmColor || '#00b8b8';
  const confirmFg = opts.confirmFg   || '#1a2540';

  ov.innerHTML = `
    <div class="sc-box">
      <div class="sc-icon-wrap" style="background:${iconBg}">
        <span class="sc-icon">${opts.icon || '❓'}</span>
      </div>
      <h3 class="sc-title">${opts.title}</h3>
      ${opts.subtitle ? `<div class="sc-subtitle">${opts.subtitle}</div>` : ''}
      ${opts.desc     ? `<p class="sc-desc">${opts.desc}</p>` : ''}
      <div class="sc-acts">
        <button class="sc-cancel" id="scCancel">${opts.cancelLabel || 'Cancel'}</button>
        <button class="sc-confirm" id="scConfirm"
          style="background:${confirmBg};color:${confirmFg}">
          <span id="scTxt">${opts.confirmLabel || 'Confirm'}</span>
          <span class="sc-spin" id="scSpin"></span>
        </button>
      </div>
    </div>`;

  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('visible'));

  const closeIt = () => {
    ov.classList.remove('visible');
    setTimeout(() => ov.remove(), 260);
  };

  document.getElementById('scCancel').onclick = closeIt;
  ov.addEventListener('click', e => { if (e.target === ov) closeIt(); });

  document.getElementById('scConfirm').onclick = () => {
    if (opts.loading !== false) {
      const btn = document.getElementById('scConfirm');
      btn.disabled = true;
      document.getElementById('scTxt').textContent = 'Please wait…';
      document.getElementById('scSpin').style.display = 'inline-block';
    }
    setTimeout(() => { closeIt(); if (opts.onConfirm) opts.onConfirm(); }, 900);
  };
}