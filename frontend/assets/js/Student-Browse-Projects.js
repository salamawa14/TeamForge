/* ═══════════════════════════════════════════════════
   Student-Browse-Projects.js — Backend Connected
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {

  // 1. Guard
  const user = await requireLogin(['student']);
  if (!user) return;
loadNotifications();
  // Show initials in avatar
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2);
  }

  // 2. Find the container where cards go
  // Try to find the existing cards container, fall back to .page
  const cardGrid = document.querySelector('.proj-list')
    || document.querySelector('.cards-grid')
    || document.querySelector('.proj-grid')
    || document.querySelector('.page main')
    || document.querySelector('main')
    || document.querySelector('.page');

  let currentProjects = [];

  // 3. Fetch from real backend
  async function loadProjects(params = {}) {
    try {
      const data = await Projects.browse(params);
      currentProjects = Array.isArray(data) ? data : [];
      renderProjects(currentProjects);
    } catch (err) {
      console.error('Failed to load projects:', err);
      if (cardGrid) {
        cardGrid.innerHTML = `
          <div style="padding:40px;text-align:center;color:var(--red)">
            Error loading projects: ${err.message}
          </div>`;
      }
    }
  }

  // 4. Render cards — keeps your existing card HTML structure
  function renderProjects(projects) {
    if (!cardGrid) return;

    // Remove only project cards, keep search/filter UI
    document.querySelectorAll('.proj-card').forEach(c => c.remove());

    if (projects.length === 0) {
      cardGrid.insertAdjacentHTML('beforeend', `
        <div class="no-results" style="text-align:center;padding:60px 20px">
          <div style="font-size:3rem">🔍</div>
          <h3>No projects found</h3>
          <p style="color:var(--t3)">Try adjusting your filters or check back later.</p>
        </div>`);
      return;
    }

    // Update "Showing X projects" count
    const countEl = document.querySelector('.results-count, [data-count]');
    if (countEl) countEl.textContent = `Showing ${projects.length} projects`;

    projects.forEach(p => {
      const pt = (p.project_type || '').toLowerCase();
      let badgeClass = 'b-course';
      if (pt === 'tubitak')   badgeClass = 'b-tubitak';
      if (pt === 'teknofest') badgeClass = 'b-teknofest';

      const skillsHtml = Array.isArray(p.required_skills)
        ? p.required_skills.map(s => `<span class="chip">${s}</span>`).join('')
        : '';

      const card = document.createElement('div');
      card.className = 'proj-card au';
      card.innerHTML = `
        <div class="pc-left">
          <div class="pc-emoji">📁</div>
          <div class="pc-body">
            <div class="pc-top">
              <span class="badge ${badgeClass}">${p.project_type}</span>
            </div>
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="pc-chips">${skillsHtml}</div>
          </div>
        </div>
        <div class="pc-right">
          <div class="pc-meta">👤 ${p.owner_name || 'Unknown'}</div>
          <div class="pc-meta">👥 ${p.member_count || 0} / ${p.team_size_needed} members</div>
         ${p.owner_student_id === user.user_id
  ? `<span style="font-size:.75rem;color:var(--t3);font-style:italic">Your project</span>`
  : `<button class="btn btn-outline btn-sm view-btn"
      data-id="${p.project_id}"
      data-title="${p.title}"
      data-type="${p.project_type}">
      View & Apply
    </button>`
}
        </div>`;

   // After appending the card to the grid
cardGrid.appendChild(card);

// FIX: Check if the button exists first
const viewBtn = card.querySelector('.view-btn');
if (viewBtn) {
  viewBtn.addEventListener('click', e => {
    const btn = e.currentTarget;
    openApplyModal(btn.dataset.id, btn.dataset.title, btn.dataset.type);
  });
}
    });
  }

  // 5. Apply modal
  function openApplyModal(projectId, projectTitle, projectType) {
    const pt = (projectType || '').toLowerCase();
    let c = '#6366f1', bg = 'rgba(99,102,241,.1)';
    if (pt === 'tubitak')   { c = '#00b8b8'; bg = 'rgba(0,184,184,.1)'; }
    if (pt === 'teknofest') { c = '#ef4444'; bg = 'rgba(239,68,68,.1)'; }

    const ov = document.createElement('div');
    ov.className = 'apc-overlay';
    ov.innerHTML = `
      <div class="apc-modal" style="border-top:4px solid ${c}">
        <div class="apc-icon-wrap" style="background:${bg};color:${c}">
          <span class="apc-icon">📨</span>
        </div>
        <h3 class="apc-title">Confirm Application</h3>
        <div class="apc-project-badge" style="background:${bg};color:${c}">${projectType}</div>
        <p class="apc-project-name">${projectTitle}</p>
        <p class="apc-desc">The project leader will review your profile before accepting or declining.</p>
        <div class="apc-acts">
          <button class="apc-cancel" id="apcCancel">Cancel</button>
          <button class="apc-confirm" id="apcConfirm" style="background:${c};color:#fff">
            <span id="apcTxt">✅ Apply Now</span>
          </button>
        </div>
      </div>`;

    document.body.appendChild(ov);
    setTimeout(() => ov.classList.add('visible'), 10);

    const close = () => {
      ov.classList.remove('visible');
      setTimeout(() => ov.remove(), 250);
    };

    document.getElementById('apcCancel').onclick = close;
    ov.addEventListener('click', e => { if (e.target === ov) close(); });

    document.getElementById('apcConfirm').onclick = async () => {
      const btn   = document.getElementById('apcConfirm');
      const txt   = document.getElementById('apcTxt');
      btn.disabled = true;
      txt.textContent = 'Sending…';

      try {
        await Student.applyToProject(projectId);
        showToast('✓ Application sent!', 'ok');
        close();
      } catch (err) {
        btn.disabled = false;
        txt.textContent = 'Try Again';
        showToast(err.message, 'error');
      }
    };
  }

  // 6. Search & filter hooks — wire up your existing UI
  const searchInput = document.getElementById('gs')
    || document.querySelector('input[type="text"][placeholder*="earch"]');
  const searchBtn = document.querySelector('.search-btn, button[type="submit"]');

  function doSearch() {
    const q = searchInput?.value.trim() || '';
    const params = {};
    if (q) params.search = q;
    loadProjects(params);
  }

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  // Type filter buttons (All Types / TÜBİTAK / Teknofest / Course)
  document.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      loadProjects(type === 'all' ? {} : { type });
    });
  });

  // 7. Initial load
  loadProjects();

  // 8. Sidebar & notification toggles
  const sb   = document.getElementById('sb');
  const burg = document.getElementById('burg');
  const nBtn  = document.getElementById('nBtn');
  const nPanel = document.getElementById('nPanel');

  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg)
      sb.classList.remove('open');
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn)
      nPanel.classList.remove('open');
  });
  nBtn?.addEventListener('click', e => { e.stopPropagation(); nPanel?.classList.toggle('open'); });

  // 9. Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await Auth.logout();
    window.location.href = 'http://teamforge.local/frontend/auth/login.html';
  });

});
