document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['student']);
  if (!user) return;
loadNotifications();
  // Avatar initials
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
  }

  const grid = document.getElementById('advGrid');
  let myProjects = [];   // student's own projects for the request modal

  // ── Load student's own projects (needed for the send-request modal) ──
  async function loadMyProjects() {
    try {
      const data = await Student.myProjects();
      myProjects = data.owned || [];
    } catch(e) {
      myProjects = [];
    }
  }

  // ── Load & render advisors ────────────────────────────────────
  async function loadAdvisors(search = '') {
    grid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--t3)">Loading advisors…</div>`;
    try {
      const advisors = await Student.findAdvisors(search);

      if (!advisors.length) {
        grid.innerHTML = `
          <div style="grid-column:1/-1;padding:60px;text-align:center;color:var(--t3)">
            <div style="font-size:2.5rem;margin-bottom:10px">🎓</div>
            <h3>No advisors found</h3>
            <p>Try a different search term.</p>
          </div>`;
        return;
      }

      const COLORS = ['#00b8b8','#6366f1','#f97316','#a855f7','#22c55e','#ef4444','#eab308'];

      grid.innerHTML = advisors.map((a, i) => {
        const color   = COLORS[i % COLORS.length];
        const initials = a.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const skills  = Array.isArray(a.areas_of_expertise) ? a.areas_of_expertise : [];
        const types   = Array.isArray(a.supervised_proj_types) ? a.supervised_proj_types : [];
        const isActive = a.advising_status === 'Active';
        const allTags = [...skills, ...types].slice(0, 4);

        return `
          <div class="adv-card au">
            <div class="adv-top">
              <div class="adv-av" style="background:${color}">${initials}</div>
              <div>
                <div class="adv-name">${a.full_name}</div>
                <div class="adv-dept-txt">${a.department || 'Instructor'}</div>
              </div>
            </div>
            ${a.academic_title ? `<div class="adv-univ">${a.academic_title}</div>` : ''}
            <div class="adv-specs">
              ${allTags.map(t => `<span class="chip">${t}</span>`).join('') || '<span style="color:var(--t3);font-size:.75rem">No specializations listed</span>'}
            </div>
            <div class="adv-avail-row">
              <span class="avail ${isActive ? '' : 'busy'}">${isActive ? 'Available' : 'Busy'}</span>
            </div>
            ${isActive
              ? `<button class="btn btn-teal" style="width:100%;justify-content:center"
                   data-id="${a.user_id}" data-name="${a.full_name}">
                   📨 Send Request
                 </button>`
              : `<button class="btn btn-outline" style="width:100%;justify-content:center;opacity:.6;cursor:not-allowed" disabled>
                   Unavailable
                 </button>`
            }
          </div>`;
      }).join('');

      // Wire Send Request buttons
      grid.querySelectorAll('[data-id]').forEach(btn => {
        btn.addEventListener('click', () => openRequestModal(btn.dataset.id, btn.dataset.name));
      });

    } catch(err) {
      grid.innerHTML = `<div style="padding:20px;color:var(--red)">Error: ${err.message}</div>`;
    }
  }

  // ── Send Request Modal ────────────────────────────────────────
  function openRequestModal(advisorId, advisorName) {
    if (!myProjects.length) {
      showToast('You need to create a project first before requesting an advisor.', 'error');
      return;
    }

    const ov = document.createElement('div');
    ov.className = 'apc-overlay';
    ov.innerHTML = `
      <div class="apc-modal" style="border-top:4px solid var(--teal)">
        <div class="apc-icon-wrap" style="background:rgba(0,184,184,.1);color:var(--teal)">
          <span class="apc-icon">🎓</span>
        </div>
        <h3 class="apc-title">Request Advisor</h3>
        <p class="apc-project-name">${advisorName}</p>
        <p class="apc-desc">Select which of your projects you'd like this advisor for:</p>
        <select id="projectSelect" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--t1);margin-bottom:16px;font-size:.9rem">
          ${myProjects.map(p => `<option value="${p.project_id}">${p.title} (${p.project_type})</option>`).join('')}
        </select>
        <div class="apc-acts">
          <button class="apc-cancel" id="apcCancel">Cancel</button>
          <button class="apc-confirm" id="apcConfirm" style="background:var(--teal);color:#1a2540">
            <span id="apcTxt">📨 Send Request</span>
          </button>
        </div>
      </div>`;

    document.body.appendChild(ov);
    setTimeout(() => ov.classList.add('visible'), 10);

    const close = () => { ov.classList.remove('visible'); setTimeout(() => ov.remove(), 250); };
    document.getElementById('apcCancel').onclick = close;
    ov.addEventListener('click', e => { if (e.target === ov) close(); });

    document.getElementById('apcConfirm').onclick = async () => {
      const btn = document.getElementById('apcConfirm');
      const txt = document.getElementById('apcTxt');
      const projectId = document.getElementById('projectSelect').value;
      btn.disabled = true;
      txt.textContent = 'Sending…';
      try {
        await Student.requestAdvisor(projectId, advisorId);
        showToast(`✓ Advisor request sent to ${advisorName}!`, 'ok');
        close();
      } catch(err) {
        btn.disabled = false;
        txt.textContent = '📨 Send Request';
        showToast(err.message, 'error');
      }
    };
  }

  // ── Toast ─────────────────────────────────────────────────────
  function showToast(msg, type = '') {
    let t = document.getElementById('_toast');
    if (!t) { t = document.createElement('div'); t.id = '_toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 3400);
  }

  // ── Search wiring ─────────────────────────────────────────────
  const searchBtn = document.querySelector('.adv-search-row .btn');
  const searchInp = document.getElementById('advSearch');
  searchBtn?.addEventListener('click', () => loadAdvisors(searchInp?.value.trim()));
  searchInp?.addEventListener('keydown', e => { if (e.key === 'Enter') loadAdvisors(searchInp.value.trim()); });

  // ── Sidebar & notifications ───────────────────────────────────
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

  // ── Initial load ──────────────────────────────────────────────
  await loadMyProjects();
  loadAdvisors();
});