/* ══════════════════════════════════════════
   ADVISOR REQUESTS — Connected to Backend
   ══════════════════════════════════════════ */

let currentRequests = [];

/* ── Fetch Requests ── */
async function loadRequests(statusFilter = '') {
  try {
    currentRequests = await Instructor.getRequests(statusFilter);
    renderRequests(statusFilter || 'pending');
    updateCounts();
  } catch (err) {
    showToast('Error loading requests: ' + err.message, 'err');
  }
}

async function updateCounts() {
  try {
     const all = await Instructor.getRequests();
     const counts = {
       pending: all.filter(r => r.status === 'Pending').length,
       accepted: all.filter(r => r.status === 'Accepted').length,
       rejected: all.filter(r => r.status === 'Rejected').length
     };
     
     document.querySelectorAll('.tab-btn').forEach(btn => {
       const tab = btn.dataset.tab;
       const countSpan = btn.querySelector('.tab-count');
       if (countSpan) countSpan.textContent = counts[tab] || 0;
     });
     
     const navBadge = document.querySelector('.nav-badge');
     if (navBadge) {
       navBadge.textContent = counts.pending;
       navBadge.style.display = counts.pending > 0 ? 'inline-block' : 'none';
     }
  } catch (err) {}
}

function renderRequests(targetTab) {
  const paneId = 'pane-' + targetTab;
  const pane = document.getElementById(paneId);
  if (!pane) return;

  const filtered = currentRequests.filter(r => r.status.toLowerCase() === targetTab.toLowerCase());
  
  if (filtered.length === 0) {
    pane.innerHTML = `<p style="text-align:center; padding:3rem; opacity:0.6">No ${targetTab} requests found.</p>`;
    return;
  }

  pane.innerHTML = filtered.map(r => `
    <div class="app-item" id="req-${r.adv_request_id}">
      <div class="app-av" style="background: hsl(${Math.random() * 360}, 60%, 50%);">
        ${r.student_name.split(' ').map(n => n[0]).join('')}
      </div>
      <div class="app-body">
        <strong>${r.student_name}</strong>
        <span class="sub">
          <span class="badge b-${r.project_type.toLowerCase()}">${r.project_type}</span> 
          &nbsp;<b>${r.project_title}</b> – ${r.description.substring(0, 100)}...
        </span>
        <span class="ts">📅 ${timeAgo(r.requested_at)}</span>
      </div>
      <div class="app-right">
        ${r.status === 'Pending' ? `
          <button class="btn-view-profile" onclick="openStudentProfile('${r.adv_request_id}')">👁 View Profile</button>
          <button class="btn-acc" onclick="handleResponse('${r.adv_request_id}', 'accept', '${r.student_name}')">✓ Accept</button>
          <button class="btn-dec" onclick="handleResponse('${r.adv_request_id}', 'reject', '${r.student_name}')">✗ Reject</button>
        ` : `
          <button class="btn-view-profile" onclick="openStudentProfile('${r.adv_request_id}')">👁 View Profile</button>
          <span class="status s-${r.status.toLowerCase()}">${r.status.toUpperCase()} ${r.status === 'Accepted' ? '✓' : ''}</span>
        `}
      </div>
    </div>
  `).join('');
}

async function handleResponse(id, action, name) {
  const title = action === 'accept' ? 'Confirm Acceptance' : 'Confirm Rejection';
  const msg = action === 'accept' 
    ? `Are you sure you want to ACCEPT ${name}'s request? This will assign you as the project advisor.`
    : `Are you sure you want to REJECT ${name}'s request?`;

  showConfirmModal(title, msg, async () => {
    try {
      await Instructor.reviewRequest(id, action);
      showToast(`✓ Request ${action}ed!`, action === 'accept' ? 'ok' : 'err');
      const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
      loadRequests(activeTab);
    } catch (err) {
      showToast('Error: ' + err.message, 'err');
    }
  });
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm ago';
  if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h ago';
  return Math.floor(diffInSeconds / 86400) + 'd ago';
}

/* ── MODALS & UI ── */
function showConfirmModal(title, message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-overlay';
  modal.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-icon">✓</div>
      <h2 class="confirm-title">${title}</h2>
      <p class="confirm-message">${message}</p>
      <div class="confirm-buttons">
        <button class="btn-cancel">Cancel</button>
        <button class="btn-confirm">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const closeModal = () => modal.remove();
  modal.querySelector('.btn-confirm').onclick = () => { closeModal(); onConfirm(); };
  modal.querySelector('.btn-cancel').onclick = closeModal;
}

function openStudentProfile(reqId) {
    const r = currentRequests.find(x => x.adv_request_id === reqId);
    if (!r) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'apm-overlay';
    overlay.innerHTML = `
      <div class="apm-modal">
        <div class="apm-header">
          <button class="apm-close" id="apmClose">✕</button>
          <div class="apm-av" style="background:#3b82f6">${r.student_name.split(' ').map(n => n[0]).join('')}</div>
          <h2 class="apm-name">${r.student_name}</h2>
          <div class="apm-meta">${r.student_department}</div>
          <div class="apm-badge">📋 Requesting for: ${r.project_title}</div>
        </div>
        <div class="apm-body">
          <div class="apm-sec-label">📝 PROJECT DESCRIPTION</div>
          <div class="apm-bio">${r.description}</div>
          
          <div class="apm-sec-label">📊 PROJECT TYPE</div>
          <div class="apm-proj-item">📁 ${r.project_type}</div>

          <div class="apm-sec-label">📅 REQUESTED ON</div>
          <div style="font-size: 0.9rem; opacity: 0.8">${new Date(r.requested_at).toLocaleString()}</div>
        </div>
        <div class="apm-foot">
          <button class="apm-close-btn" id="apmCloseBtn">Close</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    document.getElementById('apmClose').onclick = close;
    document.getElementById('apmCloseBtn').onclick = close;
}

function showToast(msg, type = '') {
  let t = document.getElementById('_toast');
  if (!t) { t = document.createElement('div'); t.id = '_toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3400);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['instructor']);
  if (user) {
    document.querySelector('.user-name').textContent = user.full_name;
    document.querySelector('.user-sub').textContent = user.department || 'Instructor';
    
    // Initial load
    loadRequests('Pending');

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('pane-' + tab).classList.add('active');
        loadRequests(tab);
      });
    });
  }
});
