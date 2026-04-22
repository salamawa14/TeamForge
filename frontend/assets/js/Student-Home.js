/* ── Toast ── */
function showToast(msg, type='') {
  let t = document.getElementById('_toast');
  if (!t) { t=document.createElement('div'); t.id='_toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.className='toast show'+(type?' '+type:'');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),3400);
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round(Math.abs((now - date) / 1000));
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days <= 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return `on ${date.toLocaleDateString()}`;
}

function renderProfileBanner(user, profile) {
  const pbAv = document.querySelector('.pb-av');
  const pbName = document.querySelector('.pb-info h2');
  const pbSub = document.querySelector('.pb-info .sub');
  const pbChips = document.querySelector('.pb-chips');
  const pbLinks = document.querySelector('.pb-links');

  if (pbAv) {
    const parts = user.full_name.trim().split(' ');
    pbAv.textContent = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
  }
  if (pbName) pbName.textContent = user.full_name;
  
  if (pbSub) {
      const yearText = profile.academic_year ? `${profile.academic_year} Year` : '';
      const deptText = profile.department || '';
      pbSub.textContent = [deptText, yearText].filter(Boolean).join(' · ');
  }
  
  if (pbChips) {
    pbChips.innerHTML = Array.isArray(profile.technical_skills) && profile.technical_skills.length > 0
      ? profile.technical_skills.slice(0, 5).map(skill => `<span class="tag-dark">${skill}</span>`).join('')
      : '<span class="no-data-small">No skills listed. Add them in your profile!</span>';
  }
  
  if (pbLinks) {
    let linksHtml = '';
    if (profile.github_url) linksHtml += `<a href="${profile.github_url}" target="_blank" rel="noopener noreferrer" class="pb-lnk">🔗 GitHub</a>`;
    if (profile.linkedin_url) linksHtml += `<a href="${profile.linkedin_url}" target="_blank" rel="noopener noreferrer" class="pb-lnk">💼 LinkedIn</a>`;
    pbLinks.innerHTML = linksHtml;
  }
}

function renderStats(projectsData, sentApps, incomingApps, advisorReqs) {
    const activeProjects = (projectsData?.owned?.length || 0) + (projectsData?.joined?.length || 0);
    const applicationsSent = sentApps?.length || 0;
    const advisorRequests = advisorReqs?.length || 0;
    const teamInvites = incomingApps?.filter(app => app.status === 'Pending').length || 0;

    const statsMap = {
        '2': activeProjects,
        '3': applicationsSent,
        '1': advisorRequests,
        '5': teamInvites
    };

    document.querySelectorAll('.stat-card .stat-n').forEach(el => {
        const key = el.dataset.count;
        const target = statsMap[key] !== undefined ? statsMap[key] : 0;
        
        const dur = 700, start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(p * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

function renderMyProjects(projects) {
    const container = document.getElementById('myProjectsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!projects || projects.length === 0) {
        container.innerHTML = `<p class="no-data">You haven't created any projects yet. <a href="Create-Project.html">Create one!</a></p>`;
        return;
    }

    const projectsToShow = projects.slice(0, 2);

    container.innerHTML = projectsToShow.map(p => {
        const pt = (p.project_type || '').toLowerCase();
        let badgeClass = 'b-course';
        if (pt === 'tubitak')   badgeClass = 'b-tubitak';
        if (pt === 'teknofest') badgeClass = 'b-teknofest';

        const skillsHtml = Array.isArray(p.required_skills) ? p.required_skills.slice(0, 4).map(s => `<span class="chip">${s}</span>`).join('') : '';
        const memberPct = p.team_size_needed > 0 ? (p.member_count / p.team_size_needed) * 100 : 0;
        const spotsOpen = p.team_size_needed - p.member_count;

        let advisorHtml = '';
        if (p.advisor_status === 'approved') {
            advisorHtml = `<div class="pc-adv ok">🎓 ${p.advisor_name}</div>`;
        } else if (p.advisor_status === 'seeking') {
            advisorHtml = `<div class="pc-adv seek">⚠ Seeking Advisor</div>`;
        }

        return `
            <div class="pc" data-project-id="${p.project_id}">
              <div class="pc-top">
                <span class="badge ${badgeClass}">${p.project_type}</span>
                ${spotsOpen > 0 ? `<span class="spot-open">${spotsOpen} spots open</span>` : `<span class="spot-full">Full</span>`}
              </div>
              <div class="pc-name">${p.title}</div>
              <div class="pc-desc">${p.description}</div>
              <div class="pc-chips">${skillsHtml}</div>
              <div class="pc-row"><span>👥 ${p.member_count}/${p.team_size_needed} members</span><span class="pc-pct">${Math.round(memberPct)}%</span></div>
              <div class="prog" style="margin-bottom:9px"><div class="prog-fill" style="width:${memberPct}%"></div></div>
              ${advisorHtml || '<div class="pc-adv">&nbsp;</div>'}
              <button class="btn-vd" data-project-id="${p.project_id}">👁 View Details</button>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.pc, .btn-vd').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = 'My-Projects.html';
        });
    });
}

function renderRecentApps(apps) {
    const container = document.getElementById('recentAppsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!apps || apps.length === 0) {
        container.innerHTML = `<p class="no-data">No recent applications. <a href="Browse-Projects.html">Find a project!</a></p>`;
        return;
    }

    container.innerHTML = apps.slice(0, 3).map(app => {
        const statusClass = `s-${app.status.toLowerCase()}`;
        let statusText = app.status.toUpperCase();
        if (statusText === 'ACCEPTED') statusText += ' ✓';
        if (statusText === 'PENDING') statusText += ' ⏳';

        let icon = '📨'; let iconBg = 'var(--indigo-10)';
        if (app.project_type === 'Teknofest') { icon = '🚀'; iconBg = 'var(--orange-10)'; } 
        else if (app.project_type === 'Tubitak') { icon = '🔬'; iconBg = 'var(--indigo-10)'; }

        return `
            <div class="app-row">
              <div class="app-ico" style="background:${iconBg}">${icon}</div>
              <div class="app-info">
                <strong>${app.project_title}</strong>
                <span>Applied to join · ${app.project_type || 'Course'}</span>
                <span class="ts">📅 ${timeAgo(app.requested_at)}</span>
              </div>
              <span class="status ${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
}

/* ── Sidebar & header init ── */
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

  // active nav
  const page = location.pathname.split('/').pop()||'';
  document.querySelectorAll('.sb-link').forEach(a=>{
    if (a.getAttribute('href')===page) a.classList.add('active');
  });
  // burger
  const sb=document.getElementById('sb'), burg=document.getElementById('burg');
  burg?.addEventListener('click',()=>sb.classList.toggle('open'));
  // ---> ADD LOGOUT HERE <---
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {  
      await Auth.logout();  
      window.location.href = '../auth/login.html';
  });
  document.addEventListener('click',e=>{
    if(sb?.classList.contains('open')&&!sb.contains(e.target)&&e.target!==burg) sb.classList.remove('open');
  });
  // notif
  const nBtn=document.getElementById('nBtn'), nPanel=document.getElementById('nPanel');
  nBtn?.addEventListener('click',e=>{e.stopPropagation();nPanel.classList.toggle('open')});
  document.addEventListener('click',e=>{if(nPanel&&!nPanel.contains(e.target)&&e.target!==nBtn)nPanel.classList.remove('open')});
  // global search
  const gs=document.getElementById('gs');
  gs?.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&gs.value.trim()){
      sessionStorage.setItem('bq',gs.value.trim());
      window.location.href='Browse-Projects.html';
    }
  });

  // Load all data for the home page
  try {
    const [profile, projectsData, sentApps, incomingApps, advisorReqs] = await Promise.all([
      Student.getProfile(),
      Student.myProjects(),
      Student.myApplications(),
      Student.myApplications({ incoming: true }),
      Student.findAdvisors({ my_requests: true })
    ]);

    renderProfileBanner(user, profile);
    renderStats(projectsData, sentApps, incomingApps, advisorReqs);
    renderMyProjects(projectsData.owned);
    renderRecentApps(sentApps);

  } catch (err) {
    console.error("Home page load failed:", err);
    showToast(err.message || 'Could not load home page data.', 'error');
  }
});