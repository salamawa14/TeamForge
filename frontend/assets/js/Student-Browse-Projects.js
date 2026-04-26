document.addEventListener('DOMContentLoaded', async () => {

  const user = await requireLogin(['student']);
  if (!user) return;
  loadNotifications();

  // Avatar
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
  }

  // The HTML uses id="projList" as the container
  const cardGrid = document.getElementById('projList');
  let currentParams = {};

  // ── Load from backend ─────────────────────────────────────
  async function loadProjects(params = {}) {
    if (!cardGrid) return;
    cardGrid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--t3)">Loading projects…</div>`;
    try {
      const data = await Projects.browse(params);
      const projects = Array.isArray(data) ? data : [];
      renderProjects(projects);
    } catch (err) {
      cardGrid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--red)">Error: ${err.message}</div>`;
    }
  }

  // ── Render cards ──────────────────────────────────────────
  function renderProjects(projects) {
    // Update counts
    const resCount = document.getElementById('resCount');
    const totalCount = document.getElementById('totalCount');
    if (resCount)   resCount.textContent   = projects.length;
    if (totalCount) totalCount.textContent = projects.length;

    // Hide/show noResults
    const noResults = document.getElementById('noResults');

    if (!projects.length) {
      cardGrid.innerHTML = '';
      if (noResults) noResults.style.display = '';
      return;
    }
    if (noResults) noResults.style.display = 'none';

    const EMOJIS = { teknofest:'🚀', tubitak:'🔬', course:'📚' };

    cardGrid.innerHTML = projects.map(p => {
      const pt = (p.project_type || '').toLowerCase();
      const badgeClass = pt === 'tubitak' ? 'b-tubitak' : pt === 'teknofest' ? 'b-teknofest' : 'b-course';
      const emoji = EMOJIS[pt] || '📁';

      const skills = Array.isArray(p.required_skills) ? p.required_skills : [];
      const skillsHtml = skills.slice(0,4).map(s => `<span class="chip">${s}</span>`).join('');

      const members   = parseInt(p.member_count) || 0;
      const maxTeam   = parseInt(p.team_size_needed) || 1;
      const spotsLeft = maxTeam - members;
      const pct       = Math.min(100, Math.round((members / maxTeam) * 100));
      const isFull    = spotsLeft <= 0;
      const isOwn     = p.owner_student_id === user.user_id;

      // Spots badge
      const spotsBadge = isFull
        ? `<span class="spot-full">Full</span>`
        : `<span class="spot-open">${spotsLeft} spot${spotsLeft>1?'s':''} open</span>`;

      // Action button
      let actionBtn = '';
      if (isOwn) {
        actionBtn = `<span style="font-size:.75rem;color:var(--t3);font-style:italic">Your project</span>`;
      } else if (isFull) {
        actionBtn = `<button class="btn btn-outline btn-sm" disabled style="opacity:.5;cursor:not-allowed">🔒 Team Full</button>`;
      } else {
        actionBtn = `<button class="btn btn-teal btn-sm apply-btn"
          data-id="${p.project_id}"
          data-title="${p.title}"
          data-type="${p.project_type}">
          ✅ Apply to Join
        </button>`;
      }

      return `
        <div class="proj-card au" data-spots="${isFull?'full':'open'}" data-type="${p.project_type}">
          <div class="pc-left">
            <div class="pc-emoji">${emoji}</div>
            <div class="pc-body">
              <div class="pc-top">
                <span class="badge ${badgeClass}">${p.project_type}</span>
                ${spotsBadge}
              </div>
              <h3>${p.title}</h3>
              <p>${p.description}</p>
              <div class="pc-chips">${skillsHtml}</div>
            </div>
          </div>
          <div class="pc-right">
            <div class="pc-meta">👥 ${members}/${maxTeam} members</div>
            <div class="pc-meta">👤 ${p.owner_name || 'Unknown'}</div>
            <div class="pc-meta" style="margin:4px 0 8px">
              <div style="height:4px;background:var(--border,#2a3a54);border-radius:2px">
                <div style="height:4px;width:${pct}%;background:${isFull?'var(--red,#ef4444)':'var(--teal,#00b8b8)'};border-radius:2px;transition:width .3s"></div>
              </div>
            </div>
            ${actionBtn}
          </div>
        </div>`;
    }).join('');

    // Wire apply buttons
    cardGrid.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', () => openApplyModal(btn.dataset.id, btn.dataset.title, btn.dataset.type));
    });
  }

  // ── Apply Modal ───────────────────────────────────────────
  function openApplyModal(projectId, projectTitle, projectType) {
    const pt = (projectType || '').toLowerCase();
    let c = '#6366f1', bg = 'rgba(99,102,241,.1)';
    if (pt === 'tubitak')   { c = '#00b8b8'; bg = 'rgba(0,184,184,.1)'; }
    if (pt === 'teknofest') { c = '#f97316'; bg = 'rgba(249,115,22,.1)'; }

    const ov = document.createElement('div');
    ov.className = 'apc-overlay';
    ov.innerHTML = `
      <div class="apc-modal" style="border-top:4px solid ${c}">
        <div class="apc-icon-wrap" style="background:${bg};color:${c}"><span class="apc-icon">📨</span></div>
        <h3 class="apc-title">Apply to Join</h3>
        <div class="apc-project-badge" style="background:${bg};color:${c}">${projectType}</div>
        <p class="apc-project-name">${projectTitle}</p>
        <p class="apc-desc">The project leader will review your profile before accepting or declining.</p>
        <div class="apc-acts">
          <button class="apc-cancel" id="apcCancel">Cancel</button>
          <button class="apc-confirm" id="apcConfirm" style="background:${c};color:#fff">
            <span id="apcTxt">✅ Send Application</span>
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
      btn.disabled = true; txt.textContent = 'Sending…';
      try {
        await Student.applyToProject(projectId);
        showToast('✓ Application sent!', 'ok');
        close();
        loadProjects(currentParams); // refresh spots
      } catch (err) {
        btn.disabled = false; txt.textContent = '✅ Send Application';
        showToast(err.message, 'error');
      }
    };
  }

  // ── Search & Filters ──────────────────────────────────────
  // The HTML uses id="searchInput" and id="doSearch"
  const searchInput = document.getElementById('searchInput') || document.getElementById('gs');
  const doSearchBtn = document.getElementById('doSearch');
  const fType       = document.getElementById('fType');
  const fTeam       = document.getElementById('fTeam');
  const clearAllBtn = document.getElementById('clearAll');

  function buildParams() {
    const params = {};
    const q = searchInput?.value.trim();
    if (q) params.search = q;
    const t = fType?.value;
    if (t) params.type = t;
    return params;
  }

  function applyFilters() {
    currentParams = buildParams();
    let projects = window._allProjects || [];

    // Client-side team filter (open/full) since backend doesn't support it
    const teamFilter = fTeam?.value;
    if (teamFilter === 'open') {
      projects = projects.filter(p => (p.member_count||0) < (p.team_size_needed||1));
    } else if (teamFilter === 'full') {
      projects = projects.filter(p => (p.member_count||0) >= (p.team_size_needed||1));
    }

    // Client-side search filter too for instant feel
    const q = searchInput?.value.trim().toLowerCase();
    if (q) {
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (Array.isArray(p.required_skills) && p.required_skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Type filter client-side
    const t = fType?.value;
    if (t) {
      projects = projects.filter(p => p.project_type === t);
    }

    renderProjects(projects);
  }

  doSearchBtn?.addEventListener('click', applyFilters);
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilters(); });
  searchInput?.addEventListener('input', applyFilters); // live search
  fType?.addEventListener('change', applyFilters);
  fTeam?.addEventListener('change', applyFilters);
  clearAllBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (fType)  fType.value  = '';
    if (fTeam)  fTeam.value  = '';
    currentParams = {};
    renderProjects(window._allProjects || []);
  });

  // ── Toast ─────────────────────────────────────────────────
  function showToast(msg, type='') {
    let t = document.getElementById('_toast');
    if (!t) { t = document.createElement('div'); t.id='_toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast show'+(type?' '+type:'');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 3400);
  }

  // ── Sidebar & Logout ──────────────────────────────────────
  const burg = document.getElementById('burg'), sb = document.getElementById('sb');
  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await Auth.logout();
    window.location.href = '../auth/login.html';
  });
  const nBtn = document.getElementById('nBtn'), nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => { e.stopPropagation(); nPanel?.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg) sb.classList.remove('open');
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('open');
  });

  // ── Initial load — fetch ALL then filter client-side ─────
  async function init() {
    if (!cardGrid) return;
    cardGrid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--t3)">Loading projects…</div>`;
    try {
      const data = await Projects.browse({});
      window._allProjects = Array.isArray(data) ? data : [];
      renderProjects(window._allProjects);
    } catch (err) {
      cardGrid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--red)">Error: ${err.message}</div>`;
    }
  }

  init();
});
