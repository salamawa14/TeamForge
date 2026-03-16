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
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});

  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab(tab.dataset.tab);
    });
  });
  
  const heroBrowseBtn = document.getElementById("heroBrowseBtn");
  const heroReviewBtn = document.getElementById("heroReviewBtn");
  const browseBtn = document.getElementById("browseBtn");
  const reqBtn = document.getElementById("reqBtn");
  const projectBtn = document.getElementById("projectBtn");
  
  if (heroBrowseBtn) {
    heroBrowseBtn.addEventListener("click", () => activateTab("students"));
  }

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
});

