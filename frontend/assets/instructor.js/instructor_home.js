// ════════════════════════════════════════
// AUTO-DISAPPEARING TOAST NOTIFICATION
// ════════════════════════════════════════
function showSuccessToast(type, studentName, projectName) {
  const isAvailability = type === 'avail';
  const isSuccess = type === 'accept' || type === 'avail';
  
  let title, student, project;
  
  if (isAvailability) {
    title = 'AVAILABILITY UPDATED!';
    student = studentName; // This will be project name like "TÜBİTAK"
    project = projectName; // This will be status like "✓ Available"
  } else {
    title = type === 'accept' ? 'REQUEST ACCEPTED!' : 'REQUEST REJECTED!';
    student = studentName;
    project = projectName;
  }
  
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.innerHTML = `
    <div class="toast-content ${isSuccess ? '' : 'reject'}">
      <div class="toast-icon ${isSuccess ? 'success' : 'reject'}">
        ${isSuccess ? '✓' : '✕'}
      </div>
      <div class="toast-text">
        <div class="toast-title">${title}</div>
        <div class="toast-student">📌 ${student}</div>
        <div class="toast-project">${project}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");

  function activateTab(target) {
    const panel = document.getElementById(`tab-${target}`);
    if (!panel) return;

    tabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === target);
    });

    panels.forEach(p => {
      p.classList.toggle("active", p.id === `tab-${target}`);
    });
  }
 

document.addEventListener('click', function() {
  document.getElementById('notif-dropdown').classList.remove('open');
});
const profileBtn = document.getElementById("profileBtn");
const editProfile = document.getElementById("editprofile");
const revReq = document.getElementById("revReq");
const heroReviewBtn = document.getElementById("heroReviewBtn");

if (profileBtn) {
  profileBtn.addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
  });
}

if (editProfile) {
  editProfile.addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
  });
}

if (revReq) {
  revReq.addEventListener("click", function () {
    window.location.href = "advisor_req_insrtoctor.html";
  });
}

if (heroReviewBtn) {
  heroReviewBtn.addEventListener("click", function () {
    window.location.href = "advisor_req_insrtoctor.html";
  });
}


  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab(tab.dataset.tab);
    });
  });
  
  const heroBrowseBtn = document.getElementById("heroBrowseBtn");
 
  const browseBtn = document.getElementById("browseBtn");
  const reqBtn = document.getElementById("reqBtn");
  const projectBtn = document.getElementById("projectBtn");
  
 
  if (heroReviewBtn) {
    heroReviewBtn.addEventListener("click", () => activateTab("overview"));
  }

  if (browseBtn) {
    browseBtn.addEventListener("click", () => activateTab("students"));
  }

  if (reqBtn) {
    reqBtn.addEventListener("click", () => activateTab("overview"));
  }

  if (projectBtn) {
    projectBtn.addEventListener("click", () => activateTab("projects"));
  }

  const searchInput = document.getElementById("student-search");
  const clearBtn = document.getElementById("btn-clear");
  const studentCards = document.querySelectorAll(".student-card");

  function filterStudents() {
    const q = (searchInput?.value || "").trim().toLowerCase();

    studentCards.forEach(card => {
      const fullText = [
        card.dataset.name || "",
        card.dataset.dept || "",
        card.dataset.year || "",
        card.dataset.status || "",
        card.textContent || ""
      ].join(" ").toLowerCase();

      card.style.display = !q || fullText.includes(q) ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterStudents);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      filterStudents();
    });
  }
  
  const projectSearch = document.getElementById("proj-search");
  const projectCards = document.querySelectorAll(".proj-card");
  
  function filterProjects() {
    const q = (projectSearch?.value || "").trim().toLowerCase();

    projectCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? "" : "none";
    });
  }

  if (projectSearch) {
    projectSearch.addEventListener("input", filterProjects);
  }
  filterStudents();
  filterProjects();
  
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
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  // ===== FIXES FOR: Availability, Teknofest Tags, Pending Requests =====
  
  // FIX 1: AVAILABILITY TOGGLE
  const availTags = document.querySelectorAll('.avail-tag');
  
  availTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const project = this.dataset.project;
      const status = this.dataset.status;
      const statusText = status === 'available' ? '✓ Available' : '✗ Unavailable';
      const projectName = project === 'teknofest' ? 'TEKNOFEST' : 'TÜBİTAK';
      
      showConfirmModal(
        'Confirm Availability',
        `Are you sure you want to set ${projectName} to ${statusText}?`,
        () => {
          const projectTags = document.querySelectorAll(`[data-project="${project}"]`);
          
          projectTags.forEach(tag => {
            tag.classList.remove('active');
            tag.classList.add('inactive');
          });
          
          this.classList.remove('inactive');
          this.classList.add('active');
          
          showSuccessToast('avail', projectName, statusText);
        }
      );
    });
  });

  // FIX 2: TEKNOFEST & TUBITAK TAGS
  const teknofestTags = document.querySelectorAll('.teknofest-tag');
  
  teknofestTags.forEach(tag => {
    tag.style.cursor = 'pointer';
    
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      alert('TEKNOFEST PROJECT - Interactive tag working!');
    });
    
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 0 12px rgba(249, 158, 11, 0.4)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  const tubitakTags = document.querySelectorAll('.tubitak-tag');
  
  tubitakTags.forEach(tag => {
    tag.style.cursor = 'pointer';
    
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      alert('TÜBİTAK PROJECT - Interactive tag working!');
    });
    
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.4)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  // FIX 3: PENDING ADVISOR REQUESTS
  const accButtons = document.querySelectorAll('.rbtn-accept');
  const rejButtons = document.querySelectorAll('.rbtn-reject');
  let pendingCount = 3;

  accButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = this.dataset.id;
      const requestItem = document.getElementById(itemId);
      const studentName = this.dataset.student;
      const projectName = this.dataset.project;
      
      showConfirmModal(
        'Confirm Application',
        `The project leader will review ${studentName}'s profile and skills before accepting or declining your request.`,
        () => {
          requestItem.classList.add('accepted');
          requestItem.classList.remove('rejected');
          requestItem.style.opacity = '0.6';
          
          requestItem.querySelectorAll('button').forEach(b => {
            b.disabled = true;
          });
          
          pendingCount--;
          document.getElementById('pending-count').textContent = pendingCount;
          
          showSuccessToast('accept', studentName, projectName);
        }
      );
    });
  });

  rejButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = this.dataset.id;
      const requestItem = document.getElementById(itemId);
      const studentName = this.dataset.student;
      const projectName = this.dataset.project;
      
      showConfirmModal(
        'Confirm Rejection',
        `Are you sure you want to REJECT ${studentName}'s request for ${projectName}?`,
        () => {
          requestItem.classList.add('rejected');
          requestItem.classList.remove('accepted');
          requestItem.style.opacity = '0.6';
          
          requestItem.querySelectorAll('button').forEach(b => {
            b.disabled = true;
          });
          
          pendingCount--;
          document.getElementById('pending-count').textContent = pendingCount;
          
          showSuccessToast('reject', studentName, projectName);
        }
      );
    });
  });
});
