/* ═══════════════════════════════════════════════════ 
   Student-Applications.js — Backend Connected 
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Guard — redirect to login if not logged in
  const user = await requireLogin(['student']);
  if (!user) return;

  // Show user name in header
  document.querySelectorAll('.user-name, [data-user-name]').forEach(el => el.textContent = user.full_name);

  // 2. Fetch Applications from Database
  async function loadApplications() {
    const container = document.querySelector('#pane-my-apps');
    if (!container) return;

    try {
      // Calls your existing applications.php GET method
      const apps = await apiRequest('/students/applications.php', 'GET');
      
      if (!apps || apps.length === 0) {
        container.innerHTML = `
          <div style="padding: 40px; text-align: center; color: var(--t3);">
            <div style="font-size: 2rem; margin-bottom: 10px;">📨</div>
            <h3>No applications yet</h3>
            <p>You haven't applied to join any projects.</p>
          </div>`;
        return;
      }

      // 3. Render the applications
      container.innerHTML = apps.map(app => {
        // Determine Status Badge Colors
        let statusClass = 's-pending';
        let statusText = 'PENDING ⏳';
        
        if (app.status === 'Accepted') {
            statusClass = 's-accepted';
            statusText = 'ACCEPTED ✓';
        } else if (app.status === 'Rejected') {
            statusClass = 's-rejected';
            statusText = 'REJECTED ✕';
        }

        // Format Date
        const dateStr = new Date(app.requested_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        return `
          <div class="app-item">
            <div class="app-av" style="background:var(--teal-10); color:var(--teal);">📁</div>
            <div class="app-info">
              <strong>${app.project_title}</strong>
              <span>Project Leader: ${app.owner_name}</span>
              <span class="ts">📅 Applied on ${dateStr}</span>
            </div>
            <span class="status ${statusClass}">${statusText}</span>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error('Failed to load applications:', err);
      container.innerHTML = `<div style="padding: 20px; color: var(--red);">Error loading applications: ${err.message}</div>`;
    }
  }

  // 4. Initial Load
  loadApplications();

  // 5. Keep UI Toggles working (Tabs, Sidebar & Notifications)
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

  // Tab switching logic (My Applications vs Advisor Requests)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById('pane-' + btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });
});