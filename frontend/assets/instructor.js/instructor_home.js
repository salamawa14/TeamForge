/* ══════════════════════════════════════════
   INSTRUCTOR HOME — Connected to Backend
   ══════════════════════════════════════════ */

async function loadHome() {
  try {
    const data = await Instructor.dashboard();
    renderRequests(data.recent_requests);
    
    const pendCount = document.getElementById('pending-count');
    if (pendCount) pendCount.textContent = data.stats.pending_requests;
    const heroPending = document.getElementById('hero-pending-requests');
    if (heroPending) heroPending.textContent = data.stats.pending_requests;
    const heroActive = document.getElementById('hero-active-advisees');
    if (heroActive) heroActive.textContent = data.stats.total_advisees || 0;
    const activeAdvisees = document.getElementById('active-advisees-count');
    if (activeAdvisees) activeAdvisees.textContent = data.stats.total_advisees || 0;
    const heroOpenSlots = document.getElementById('hero-open-slots');
    if (heroOpenSlots) heroOpenSlots.textContent = Math.max(0, 5 - (data.stats.active_projects || 0));
    const quotaUsed = document.getElementById('quota-used');
    if (quotaUsed) quotaUsed.textContent = `${data.stats.active_projects || 0}/5`;
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) {
      const pending = data.stats.pending_requests || 0;
      heroSubtitle.textContent = pending === 1 ? 'You have 1 pending request.' : `You have ${pending} pending requests.`;
    }
    const reviewBtn = document.getElementById('heroReviewBtn');
    if (reviewBtn) reviewBtn.textContent = `✓ Review Requests ( ${data.stats.pending_requests || 0} )`;
    const sidebarBadge = document.getElementById('sidebar-pending-badge');
    if (sidebarBadge) {
      sidebarBadge.textContent = data.stats.pending_requests || 0;
      sidebarBadge.style.display = (data.stats.pending_requests || 0) > 0 ? 'inline-block' : 'none';
    }
  } catch (err) {
    console.error(err);
  }
}

function renderRequests(requests) {
  const container = document.querySelector('.pending-list');
  if (!container) return;
  const pendingRequests = (requests || []).filter(r => r.status === 'Pending');

  if (pendingRequests.length === 0) {
    container.innerHTML = '<p style="padding:1rem; opacity:0.6">No pending requests.</p>';
    return;
  }

  container.innerHTML = pendingRequests.map(r => `
    <div class="request-item" id="req-${r.adv_request_id}">
      <div class="request-av" style="background:#3b82f6">${r.student_name.split(' ').map(n => n[0]).join('')}</div>
      <div class="request-info">
        <div class="request-student">${r.student_name}</div>
        <div class="request-project">Project: ${r.project_title}</div>
      </div>
      <div class="request-actions">
        <button class="rbtn-accept" onclick="respondHome('${r.adv_request_id}', 'accept', '${r.student_name}', '${r.project_title}')">Accept</button>
        <button class="rbtn-reject" onclick="respondHome('${r.adv_request_id}', 'reject', '${r.student_name}', '${r.project_title}')">Reject</button>
      </div>
    </div>
  `).join('');
}

async function respondHome(id, action, name, project) {
    const title = action === 'accept' ? 'Confirm Application' : 'Confirm Rejection';
    const message = action === 'accept'
        ? `The project leader will review ${name}'s profile and skills before accepting or declining your request.`
        : `Are you sure you want to REJECT ${name}'s request for ${project}?`;

    showConfirmModal(title, message, async () => {
        try {
            await Instructor.reviewRequest(id, action);
            showSuccessToast(action, name, project);
            loadHome(); // Refresh
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });
}

function showSuccessToast(type, studentName, projectName) {
  const isAvailability = type === 'avail';
  const isSuccess = type === 'accept' || type === 'avail';
  let title = type === 'accept' ? 'REQUEST ACCEPTED!' : 'REQUEST REJECTED!';
  
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.innerHTML = `
    <div class="toast-content ${isSuccess ? '' : 'reject'}">
      <div class="toast-icon ${isSuccess ? 'success' : 'reject'}">
        ${isSuccess ? '✓' : '✕'}
      </div>
      <div class="toast-text">
        <div class="toast-title">${title}</div>
        <div class="toast-student">📌 ${studentName}</div>
        <div class="toast-project">${projectName}</div>
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastSlideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

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
    modal.querySelector('.btn-confirm').onclick = () => { modal.remove(); onConfirm(); };
    modal.querySelector('.btn-cancel').onclick = () => modal.remove();
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['instructor']);
  if (user) {
    const sidebarName = document.querySelector('.user-name, .u-name');
    const sidebarSub = document.querySelector('.user-sub, .u-sub');
    const welcome = document.getElementById('hero-welcome');
    const initials = user.full_name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
    if (sidebarName) sidebarName.textContent = user.full_name;
    if (sidebarSub) sidebarSub.textContent = user.department || 'Instructor';
    if (welcome) welcome.innerHTML = `Welcome back, <span class="teal">${user.full_name}</span> 🧑‍🏫`;
    const avatar = document.getElementById('sidebar-avatar');
    if (avatar) avatar.textContent = initials || 'IN';
    loadHome();
  }

  // Sidebar navigation
  document.getElementById("profileBtn")?.addEventListener("click", () => window.location.href = "profile_instructor.html");
  document.getElementById("editprofile")?.addEventListener("click", () => window.location.href = "profile_instructor.html");
  document.getElementById("revReq")?.addEventListener("click", () => window.location.href = "advisor_req_insrtoctor.html");
  document.getElementById("heroReviewBtn")?.addEventListener("click", () => window.location.href = "advisor_req_insrtoctor.html");
});
