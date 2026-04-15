/* ═══════════════════════════════════════════════════
   Student-My-Profile.js — Backend Connected
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {

  const user = await requireLogin(['student']);
  if (!user) return;

  try {
    const p = await Student.getProfile();

    // ── Banner ──────────────────────────────────────
    const pbAv = document.querySelector('.pb-av');
    if (pbAv) {
      const parts = (p.full_name || '').trim().split(' ');
      pbAv.textContent = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : (parts[0] || '').slice(0, 2);
    }

    const pbName = document.querySelector('.pb-inner h2');
    if (pbName) pbName.textContent = p.full_name || '';

    const pbSub = document.querySelector('.pb-inner .sub');
    if (pbSub) {
      const parts = [p.department, p.academic_year].filter(Boolean);
      pbSub.textContent = parts.join(' · ');
    }

    // Skills chips in banner
    const pbChips = document.querySelector('.pb-chips');
    if (pbChips && Array.isArray(p.technical_skills) && p.technical_skills.length) {
      pbChips.innerHTML = p.technical_skills
        .map(s => `<span class="tag-dark">${s}</span>`).join('');
    }

    // GitHub / LinkedIn links in banner
    const pbLinks = document.querySelector('.pb-links');
    if (pbLinks) {
      pbLinks.innerHTML = `
        ${p.github_url   ? `<a href="${p.github_url}"   target="_blank" class="pb-lnk">🔗 GitHub</a>`   : ''}
        ${p.linkedin_url ? `<a href="${p.linkedin_url}" target="_blank" class="pb-lnk">💼 LinkedIn</a>` : ''}
      `;
    }

    // ── Avatar in topbar ────────────────────────────
    const avatar = document.querySelector('.avatar');
    if (avatar) {
      const parts = (p.full_name || '').trim().split(' ');
      avatar.textContent = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : (parts[0] || '').slice(0, 2);
    }

    // ── Form fields ─────────────────────────────────
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('profName',    p.full_name);
    set('profEmail',   p.email);
    set('profDept',    p.department);
    set('profYear',    p.academic_year);
    set('profGithub',  p.github_url);
    set('profLinkedin',p.linkedin_url);
    set('profSkills',  Array.isArray(p.technical_skills) ? p.technical_skills.join(', ') : '');

    const bioEl = document.getElementById('profBio');
    if (bioEl) bioEl.value = p.bio || '';

  } catch (err) {
    console.error('Profile load error:', err.message);
  }

  // ── Sidebar & notifications ───────────────────────
  const burg = document.getElementById('burg'), sb = document.getElementById('sb');
  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  // ---> ADD LOGOUT HERE <---
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {  
      await Auth.logout();  
      window.location.href = 'http://teamforge.local/frontend/auth/login.html';
  });
  const nBtn = document.getElementById('nBtn'), nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => { e.stopPropagation(); nPanel?.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg) sb.classList.remove('open');
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('open');
  });

});