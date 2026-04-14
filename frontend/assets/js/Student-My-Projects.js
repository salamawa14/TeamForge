/* ═══════════════════════════════════════════════════ 
   Student-My-Projects.js — Backend Connected 
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Guard — redirect to login if not logged in
  const user = await requireLogin(['student']);
  if (!user) return;

  // Show user name in header
  document.querySelectorAll('.user-name, [data-user-name]').forEach(el => el.textContent = user.full_name);

  // 2. Fetch Projects from Database
  async function loadMyProjects() {
    const paneOwned = document.getElementById('pane-owner')?.querySelector('.proj-grid');
    const paneMember = document.getElementById('pane-member')?.querySelector('.proj-grid');
    
    if (!paneOwned || !paneMember) return;

    try {
      // Calls your my-projects.php GET endpoint
      const data = await apiRequest('/students/my-projects.php', 'GET');
      
      // Render Owned Projects (Projects the student created)
      renderProjects(data.owned || [], paneOwned, true);
      
      // Render Joined Projects (Projects the student is just a member of)
      renderProjects(data.joined || [], paneMember, false);

    } catch (err) {
      console.error('Failed to load my projects:', err);
      paneOwned.innerHTML = `<div style="color: var(--red); grid-column: 1/-1;">Error: ${err.message}</div>`;
      paneMember.innerHTML = `<div style="color: var(--red); grid-column: 1/-1;">Error: ${err.message}</div>`;
    }
  }

  // 3. Render Function for Project Cards
  function renderProjects(projects, container, isOwner) {
    if (projects.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--t3);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">📁</div>
          <h3>No projects found</h3>
          <p>${isOwner ? "You haven't created any projects yet." : "You haven't joined any teams yet."}</p>
        </div>`;
      return;
    }

    container.innerHTML = projects.map(p => {
      // Badge Styling
      let badgeClass = 'b-course';
      if (p.project_type === 'Tubitak') badgeClass = 'b-tubitak';
      if (p.project_type === 'Teknofest') badgeClass = 'b-teknofest';

      // Parse JSON skills safely
      let skillsHtml = '';
      try {
        const skills = typeof p.required_skills === 'string' ? JSON.parse(p.required_skills) : (p.required_skills || []);
        skillsHtml = skills.map(s => `<span class="chip">${s}</span>`).join('');
      } catch(e) {}

      // Calculate capacity percentage
      const currentMembers = p.member_count || 1;
      const maxMembers = p.team_size_needed || 1;
      const pct = Math.min(100, Math.round((currentMembers / maxMembers) * 100));
      const spotsOpen = maxMembers - currentMembers;

      return `
        <div class="mp-card au">
          <div class="mp-top">
            <span class="badge ${badgeClass}">${p.project_type}</span>
            ${spotsOpen > 0 ? `<span class="spot-open">${spotsOpen} spots open</span>` : `<span class="spot-full" style="color:var(--red); font-size:12px; font-weight:700;">FULL</span>`}
          </div>
          <div class="mp-title">${p.title}</div>
          <div class="mp-desc">${p.description || 'No description provided.'}</div>
          <div class="mp-chips">${skillsHtml}</div>
          <div class="mp-row">
            <span>👥 ${currentMembers}/${maxMembers} members</span>
            <span class="mp-pct">${pct}%</span>
          </div>
          <div class="prog" style="margin-bottom:11px">
            <div class="prog-fill" style="width:${pct}%; background: ${pct === 100 ? 'var(--red)' : 'var(--teal)'}"></div>
          </div>
          
          <div class="mp-acts" style="margin-top: auto; padding-top: 15px;">
            ${isOwner 
              ? `<button class="btn-manage" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border); background: var(--white); cursor: pointer;" onclick="alert('Manage Project feature coming soon!')">⚙ Manage Project</button>` 
              : `<button class="btn-vd" style="width: 100%; padding: 8px; border-radius: 6px; border: none; background: var(--bg); color: var(--t1); cursor: pointer;">👁 View Details</button>`
            }
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. Initial Load
  loadMyProjects();

  // 5. Tab Switching Logic
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked button and target pane
      btn.classList.add('active');
      const targetPane = document.getElementById('pane-' + btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 6. Keep UI Toggles working (Sidebar & Notifications)
  const burg = document.getElementById('burg');
  const sb = document.getElementById('sb');
  if(burg && sb) burg.addEventListener('click', () => sb.classList.toggle('open'));

  const nBtn = document.getElementById('nBtn');
  const nPanel = document.getElementById('nPanel');
  if(nBtn && nPanel) {
    nBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nPanel.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if(!nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('show');
    });
  }
});