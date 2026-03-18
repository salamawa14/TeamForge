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
  
  // ===== FIXES FOR: Availability, Teknofest Tags, Pending Requests =====
  
  // FIX 1: AVAILABILITY TOGGLE
  const availTags = document.querySelectorAll('.avail-tag');
  
  availTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const project = this.dataset.project;
      const status = this.dataset.status;
      
      const projectTags = document.querySelectorAll(`[data-project="${project}"]`);
      
      projectTags.forEach(tag => {
        tag.classList.remove('active');
        tag.classList.add('inactive');
      });
      
      this.classList.remove('inactive');
      this.classList.add('active');
      
      const statusText = status === 'available' ? '✓ Available' : '✗ Unavailable';
      const projectName = project === 'teknofest' ? 'TEKNOFEST' : 'TÜBİTAK';
      
      alert(`Your availability for ${projectName} is now: ${statusText}`);
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
  const accButtons = document.querySelectorAll('.acc');
  const rejButtons = document.querySelectorAll('.rej');
  let pendingCount = 3;

  accButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = this.dataset.id;
      const requestItem = document.getElementById(itemId);
      const studentName = this.dataset.student;
      const projectName = this.dataset.project;
      
      requestItem.classList.add('accepted');
      requestItem.classList.remove('rejected');
      requestItem.style.opacity = '0.6';
      
      requestItem.querySelectorAll('button').forEach(b => {
        b.disabled = true;
      });
      
      pendingCount--;
      document.getElementById('pending-count').textContent = pendingCount;
      
      alert(`ACCEPTED!\n\nStudent: ${studentName}\nProject: ${projectName}`);
    });
  });

  rejButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = this.dataset.id;
      const requestItem = document.getElementById(itemId);
      const studentName = this.dataset.student;
      const projectName = this.dataset.project;
      
      requestItem.classList.add('rejected');
      requestItem.classList.remove('accepted');
      requestItem.style.opacity = '0.6';
      
      requestItem.querySelectorAll('button').forEach(b => {
        b.disabled = true;
      });
      
      pendingCount--;
      document.getElementById('pending-count').textContent = pendingCount;
      
      alert(`REJECTED!\n\nStudent: ${studentName}\nProject: ${projectName}`);
    });
  });
});

