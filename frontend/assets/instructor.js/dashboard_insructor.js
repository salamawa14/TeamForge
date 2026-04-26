/* ══════════════════════════════════════════
   INSTRUCTOR DASHBOARD — Connected to Backend
   ══════════════════════════════════════════ */

/* ── Data ── */
let dashboardData = null;
let availabilityData = null;

/* ── Fetch Data ── */
async function loadDashboard() {
  try {
    dashboardData = await Instructor.dashboard();
    updateUI();
  } catch (err) {
    showToast('Error loading dashboard: ' + err.message, 'red');
  }
}

async function loadAvailability() {
  try {
    availabilityData = await Instructor.getAvailability();
    updateAvailabilityUI();
  } catch (err) {
    showToast('Error loading availability: ' + err.message, 'red');
  }
}

function updateUI() {
  if (!dashboardData) return;

  const s = dashboardData.stats;
  const pendingRequests = (dashboardData.recent_requests || []).filter(req => req.status === 'Pending');
  
  // Update Stats
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length >= 3) {
    statNums[0].textContent = s.pending_requests;
    statNums[1].textContent = s.active_projects;
    statNums[2].textContent = 5 - s.active_projects; // Assuming quota is 5
  }

  // Update Welcome
  const welcomeTitle = document.querySelector('.welcome-title');
  if (welcomeTitle) {
      // We can get the name from the session or Auth.me
  }

  // Update Requests
  const requestsList = document.querySelector('.card .request-item')?.parentElement;
  if (requestsList) {
    const existingItems = requestsList.querySelectorAll('.request-item');
    existingItems.forEach(item => item.remove());

    if (pendingRequests.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No pending requests.';
      emptyMsg.style.padding = '1rem';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.opacity = '0.6';
      requestsList.appendChild(emptyMsg);
    } else {
      pendingRequests.forEach(req => {
        const item = document.createElement('div');
        item.className = 'request-item';
        item.id = 'req-' + req.adv_request_id;
        item.innerHTML = `
          <div class="req-avatar blue">${req.student_name.split(' ').map(n => n[0]).join('')}</div>
          <div class="req-body">
            <div class="req-name">${req.student_name}</div>
            <div class="req-desc"><strong>${req.project_title}</strong> – ${req.project_type} project. ${req.description.substring(0, 80)}...</div>
            <div class="req-time">${timeAgo(req.requested_at)}</div>
          </div>
          <div class="req-btns">
             <button class="btn-accept" onclick="respondRequest('${req.adv_request_id}', 'accept', '${req.student_name}', '${req.project_title}')">Accept</button>
             <button class="btn-reject" onclick="respondRequest('${req.adv_request_id}', 'reject', '${req.student_name}', '${req.project_title}')">Reject</button>
          </div>
        `;
        requestsList.appendChild(item);
      });
    }
  }
}

function updateAvailabilityUI() {
  if (!availabilityData) return;

  const maxAdvisees = Math.max(1, Number(availabilityData.max_concurrent_advisees) || 5);
  const activeProjects = Math.max(0, Number(availabilityData.active_projects) || 0);
  const remaining = Math.max(0, maxAdvisees - activeProjects);

  const availNote = document.getElementById('avail-note');
  if (availNote) {
    availNote.innerHTML = `You have <strong>${activeProjects}/${maxAdvisees}</strong> advisor slots filled.`;
  }

  const availHint = document.getElementById('avail-hint');
  if (availHint) {
    availHint.innerHTML = availabilityData.auto_hide_when_full
      ? '💡 Auto-hide when full is enabled for student searches.'
      : '💡 Set unavailable when quota is full to hide from student searches.';
  }

  document.querySelectorAll('.toggle-btn').forEach((btn) => {
    const group = btn.dataset.group;
    const value = btn.dataset.val;
    let isActive = false;

    if (group === 'tubitak') {
      isActive = value === 'available' ? !!availabilityData.accepts_tubitak : !availabilityData.accepts_tubitak;
    } else if (group === 'teknofest') {
      isActive = value === 'available' ? !!availabilityData.accepts_teknofest : !availabilityData.accepts_teknofest;
    }

    btn.classList.toggle('active', isActive);
    btn.disabled = activeProjects >= maxAdvisees && value === 'available' && !isActive;
  });

  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length >= 3) {
    statNums[2].textContent = remaining;
  }
}

async function updateAvailability(group, value) {
  if (!availabilityData) return;

  const nextAvailability = {
    advising_status: availabilityData.advising_status,
    accepts_tubitak: availabilityData.accepts_tubitak,
    accepts_teknofest: availabilityData.accepts_teknofest,
    max_concurrent_advisees: availabilityData.max_concurrent_advisees || 5,
    auto_hide_when_full: availabilityData.auto_hide_when_full,
    office_hours_note: availabilityData.office_hours_note || ''
  };

  if (group === 'tubitak') {
    nextAvailability.accepts_tubitak = value === 'available';
  } else if (group === 'teknofest') {
    nextAvailability.accepts_teknofest = value === 'available';
  }

  nextAvailability.advising_status = (nextAvailability.accepts_tubitak || nextAvailability.accepts_teknofest)
    ? 'Active'
    : 'Inactive';

  try {
    await Instructor.setAvailability(nextAvailability);
    availabilityData = {
      ...availabilityData,
      ...nextAvailability
    };
    updateAvailabilityUI();
    showToast('Availability updated.', 'green');
  } catch (err) {
    showToast('Error saving availability: ' + err.message, 'red');
  }
}

async function respondRequest(id, action, studentName, projectName) {
  const title = action === 'accept' ? 'Confirm Application' : 'Confirm Rejection';
  const message = action === 'accept'
    ? `You are about to accept ${studentName}'s request for "${projectName}".`
    : `Are you sure you want to REJECT ${studentName}'s request for "${projectName}"?`;

  showConfirmModal(title, message, async () => {
    try {
      const result = await Instructor.reviewRequest(id, action);
      showToast(result?.message || `✓ Request ${action}ed`, action === 'accept' ? 'green' : 'red');
      loadDashboard(); // Refresh
    } catch (err) {
      showToast('Error: ' + err.message, 'red');
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

// ===== CUSTOM CONFIRMATION MODAL =====
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
  
  const btnConfirm = modal.querySelector('.btn-confirm');
  const btnCancel = modal.querySelector('.btn-cancel');
  
  btnConfirm.addEventListener('click', function() {
    modal.remove();
    onConfirm();
  });
  
  btnCancel.addEventListener('click', function() {
    modal.remove();
  });
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.remove();
  });
}

document.getElementById("profileBtn")?.addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});

// Toast
function showToast(msg, color) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px',
    background: color === 'green' ? '#16a34a' : '#dc2626',
    color: '#fff', fontFamily: "'DM Sans',sans-serif",
    fontSize: '13px', fontWeight: '600',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    opacity: '0', transform: 'translateY(10px)',
    transition: 'all 0.25s', zIndex: '9999'
  });
  document.body.appendChild(t);
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
  });
  setTimeout(function() {
    t.style.opacity = '0';
    setTimeout(function() { t.remove(); }, 300);
  }, 2800);
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['instructor']);
  if (user) {
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = `Welcome, ${user.full_name} 👋`;
    
    // Update sidebar info
    const sidebarName = document.querySelector('.user-name');
    const sidebarSub = document.querySelector('.user-sub');
    if (sidebarName) sidebarName.textContent = user.full_name;
    if (sidebarSub) sidebarSub.textContent = user.department || 'Instructor';
    const avatar = document.getElementById('sidebar-avatar');
    if (avatar) {
      avatar.textContent = user.full_name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'IN';
    }

    loadDashboard();
    loadAvailability();
  }

  document.querySelectorAll('.toggle-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (btn.disabled) return;
      await updateAvailability(btn.dataset.group, btn.dataset.val);
    });
  });
});
