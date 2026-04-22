document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['student']);
  if (!user) return;
loadNotifications();
  // Update avatar initials
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
  }

  // ── Load all three tabs ──────────────────────────────────────

  async function loadSent() {
    const pane = document.getElementById('pane-sent');
    if (!pane) return;
    try {
      const apps = await Student.myApplications();
      // Update tab count
      document.querySelector('[data-tab="sent"] .tab-count').textContent = apps.length;

      if (!apps.length) {
        pane.innerHTML = emptyState('📨', "No sent applications", "You haven't applied to any projects yet.");
        return;
      }
      pane.innerHTML = apps.map(app => {
        const date = formatDate(app.requested_at);
        const { cls, label } = statusBadge(app.status);
        return `
          <div class="app-item">
            <div class="app-ico" style="background:var(--teal-10)">📁</div>
            <div class="app-body">
              <strong>${app.project_title}</strong>
              <span class="sub">Owner: ${app.owner_name}</span>
              <span class="ts">📅 ${date}</span>
            </div>
            <span class="status ${cls}">${label}</span>
          </div>`;
      }).join('');
    } catch(err) {
      document.getElementById('pane-sent').innerHTML = errorState(err.message);
    }
  }

  async function loadIncoming() {
    const pane = document.getElementById('pane-incoming');
    if (!pane) return;
    try {
      const apps = await Student.incomingRequests();
      document.querySelector('[data-tab="incoming"] .tab-count').textContent = apps.length;

      if (!apps.length) {
        pane.innerHTML = emptyState('📥', "No incoming applications", "Nobody has applied to your projects yet.");
        return;
      }
      pane.innerHTML = apps.map(app => {
        const date = formatDate(app.requested_at);
        const initials = app.applicant_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
        const isPending = app.status === 'Pending';
        return `
          <div class="app-item" id="inc-${app.request_id}">
            <div class="app-av" style="background:var(--teal)">${initials}</div>
            <div class="app-body">
              <strong>${app.applicant_name} wants to join ${app.project_title}</strong>
              ${app.department ? `<span class="sub">Dept: ${app.department}</span>` : ''}
              <span class="ts">📅 ${date}</span>
            </div>
            <div class="app-right">
              ${isPending ? `
                <button class="btn-acc" data-id="${app.request_id}" data-name="${app.applicant_name}">✓ Accept</button>
                <button class="btn-dec" data-id="${app.request_id}">✕ Decline</button>
              ` : `<span class="status ${statusBadge(app.status).cls}">${statusBadge(app.status).label}</span>`}
            </div>
          </div>`;
      }).join('');

      // Wire accept/decline buttons
      pane.querySelectorAll('.btn-acc').forEach(btn => {
        btn.addEventListener('click', () => reviewApp(btn.dataset.id, 'accept', btn.dataset.name));
      });
      pane.querySelectorAll('.btn-dec').forEach(btn => {
        btn.addEventListener('click', () => reviewApp(btn.dataset.id, 'reject', null));
      });

    } catch(err) {
      document.getElementById('pane-incoming').innerHTML = errorState(err.message);
    }
  }

  async function loadAdvisorRequests() {
    const pane = document.getElementById('pane-advisor');
    if (!pane) return;
    try {
      // advisor requests are fetched via the find-advisor endpoint
      const reqs = await apiRequest('/students/find-advisor.php?my_requests=1', 'GET');
      const list = Array.isArray(reqs) ? reqs : [];
      document.querySelector('[data-tab="advisor"] .tab-count').textContent = list.length;

      if (!list.length) {
        pane.innerHTML = emptyState('🎓', "No advisor requests", "You haven't sent any advisor requests yet.");
        return;
      }
      pane.innerHTML = list.map(r => {
        const date = formatDate(r.requested_at);
        const initials = r.advisor_name.split(' ').filter(w => /^[A-Za-z]/.test(w)).map(w=>w[0]).join('').slice(0,2).toUpperCase();
        const { cls, label } = statusBadge(r.status);
        return `
          <div class="app-item">
            <div class="app-av" style="background:var(--teal)">${initials}</div>
            <div class="app-body">
              <strong>Advisor Request → ${r.advisor_name}</strong>
              <span class="sub">For: ${r.project_title} (${r.project_type})</span>
              <span class="ts">📅 ${date}</span>
            </div>
            <span class="status ${cls}">${label}</span>
          </div>`;
      }).join('');
    } catch(err) {
      // If endpoint doesn't support my_requests yet, show a graceful message
      document.getElementById('pane-advisor').innerHTML = emptyState('🎓', "No advisor requests", "Advisor requests will appear here.");
    }
  }

  async function reviewApp(requestId, action, name) {
    try {
      await Student.reviewRequest(requestId, action);
      const row = document.getElementById(`inc-${requestId}`);
      if (row) {
        const { cls, label } = statusBadge(action === 'accept' ? 'Accepted' : 'Rejected');
        row.querySelector('.app-right').innerHTML = `<span class="status ${cls}">${label}</span>`;
      }
      showToast(action === 'accept' ? `✓ Accepted ${name}'s application!` : '✕ Application declined.', action === 'accept' ? 'ok' : '');
    } catch(err) {
      showToast(err.message, 'error');
    }
  }

  // ── Helpers ──────────────────────────────────────────────────

  function statusBadge(status) {
    if (status === 'Accepted' || status === 'accept') return { cls: 's-accepted', label: 'ACCEPTED ✓' };
    if (status === 'Rejected' || status === 'reject') return { cls: 's-rejected', label: 'REJECTED ✕' };
    return { cls: 's-pending', label: 'PENDING ⏳' };
  }

  function formatDate(str) {
    return new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function emptyState(icon, title, msg) {
    return `<div style="padding:40px;text-align:center;color:var(--t3)">
      <div style="font-size:2rem;margin-bottom:10px">${icon}</div>
      <h3>${title}</h3><p>${msg}</p></div>`;
  }

  function errorState(msg) {
    return `<div style="padding:20px;color:var(--red)">Error: ${msg}</div>`;
  }

  function showToast(msg, type='') {
    let t = document.getElementById('_toast');
    if (!t) { t = document.createElement('div'); t.id='_toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 3400);
  }

  // ── Initial load ─────────────────────────────────────────────
  loadSent();
  loadIncoming();
  loadAdvisorRequests();

  // ── Tab switching ─────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pane-' + btn.dataset.tab)?.classList.add('active');
    });
  });

  // ── Sidebar & notifications ───────────────────────────────────
  const burg = document.getElementById('burg'), sb = document.getElementById('sb');
  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  // ---> ADD LOGOUT HERE <---
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {  
      await Auth.logout();  
      window.location.href = '../auth/login.html';
  });
  const nBtn = document.getElementById('nBtn'), nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => { e.stopPropagation(); nPanel?.classList.toggle('show'); });
  document.addEventListener('click', e => {
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('show');
  });
});