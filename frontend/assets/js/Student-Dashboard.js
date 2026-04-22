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

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff/60000), hours = Math.floor(mins/60), days = Math.floor(hours/24);
    if (days > 0) return days + ' day' + (days>1?'s':'') + ' ago';
    if (hours > 0) return hours + ' hour' + (hours>1?'s':'') + ' ago';
    return mins + ' min ago';
  }

  function actIcon(type) {
    if (type.includes('accept')) return {dot:'var(--green)', label:'Application accepted'};
    if (type.includes('reject')) return {dot:'var(--red)',   label:'Application rejected'};
    if (type.includes('join'))   return {dot:'var(--teal)',  label:'New join request'};
    if (type.includes('advisor'))return {dot:'var(--indigo)',label:'Advisor request'};
    return {dot:'var(--amber)', label: type.replace(/_/g,' ')};
  }

  try {
    const data = await Student.dashboard();
    const s = data.stats;

    // Stat cards
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val ?? 0; };
    set('stat-projects', s.projects_owned + s.projects_joined);
    set('stat-accepted', s.accepted_requests);
    set('stat-pending',  s.pending_requests);
    set('stat-advisor',  s.advisor_requests);

    // Project Progress section
    const ppContainer = document.querySelector('.mid-grid .card:first-child');
    if (ppContainer && data.my_projects.length) {
      const typeBadge = t => t === 'Teknofest' ? 'b-teknofest' : t === 'Tubitak' ? 'b-tubitak' : 'b-course';
      ppContainer.innerHTML = `<h3 class="card-title">📈 Project Progress</h3>` +
        data.my_projects.map(p => {
          const pct = Math.min(100, Math.round((p.member_count / (p.team_size_needed || 1)) * 100));
          return `
            <div class="pp-item">
              <div class="pp-top">
                <span class="badge ${typeBadge(p.project_type)}">${p.project_type.toUpperCase()}</span>
                <span class="pp-name">${p.title}</span>
                <span class="pp-pct">${pct}%</span>
              </div>
              <div class="prog"><div class="prog-fill" style="width:${pct}%"></div></div>
            </div>`;
        }).join('');
      if (!data.my_projects.length) {
        ppContainer.innerHTML += `<p style="color:var(--t3);font-size:.85rem;margin-top:10px">No projects yet. <a href="Create-Project.html" style="color:var(--teal)">Create one</a>.</p>`;
      }
    } else if (ppContainer && !data.my_projects.length) {
      ppContainer.innerHTML = `<h3 class="card-title">📈 Project Progress</h3>
        <p style="color:var(--t3);font-size:.85rem;margin-top:14px">You haven't created any projects yet.<br><a href="Create-Project.html" style="color:var(--teal)">Create your first project →</a></p>`;
    }

    // Recent Activity
    const actList = document.querySelector('.act-list');
    if (actList) {
      if (data.activity && data.activity.length) {
        actList.innerHTML = data.activity.map(n => {
          const {dot, label} = actIcon(n.type);
          return `
            <div class="act-item">
              <div class="act-dot" style="background:${dot}"></div>
              <div class="act-text">
                <strong>${label}</strong>
                <span>${n.message}</span>
                <span>${timeAgo(n.created_at)}</span>
              </div>
            </div>`;
        }).join('');
      } else {
        actList.innerHTML = `<p style="color:var(--t3);font-size:.85rem">No recent activity yet.</p>`;
      }
    }

    // Deadlines section — use projects I'm in
    const dlList = document.querySelector('.dl-list');
    if (dlList) {
      if (data.deadlines && data.deadlines.length) {
        const colors = ['var(--teal)', 'var(--indigo)', 'var(--amber)'];
        dlList.innerHTML = data.deadlines.map((p, i) => `
          <div class="dl-row">
            <div class="dl-bar" style="background:${colors[i % colors.length]}"></div>
            <div class="dl-info">
              <strong>${p.title}</strong>
              <span>${p.project_type} project</span>
            </div>
          </div>`).join('');
      } else {
        dlList.innerHTML = `<p style="color:var(--t3);font-size:.85rem">No active projects with deadlines.</p>`;
      }
    }

  } catch (err) {
    console.error('Dashboard load error:', err.message);
  }

  // Sidebar & logout
  const burg = document.getElementById('burg'), sb = document.getElementById('sb');
  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg) sb.classList.remove('open');
  });
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await Auth.logout();
    window.location.href = '../auth/login.html';
  });
  // also handle old logout-btn id if present in HTML
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await Auth.logout();
    window.location.href = '../auth/login.html';
  });
});
