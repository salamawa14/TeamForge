/* ══════════════════════════════════════════
   MY ADVISEES — Connected to Backend
   ══════════════════════════════════════════ */

let projectsData = [];

async function updateAdvisorRequestsBadge() {
  try {
    const requests = await Instructor.getRequests();
    const pendingCount = requests.filter(request =>
      String(request.status || '').trim().toLowerCase() === 'pending'
    ).length;

    const badge = document.getElementById('advisorRequestsBadge');
    if (!badge) return;

    badge.textContent = pendingCount;
    badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
  } catch (err) {
    console.error('Error loading advisor request badge:', err);
  }
}

/* ── Fetch Advisees ── */
async function loadAdvisees() {
  try {
    projectsData = await Instructor.advisees();
    renderAdvisees();
  } catch (err) {
    console.error('Error:', err);
  }
}

function renderAdvisees() {
  const grid = document.getElementById('cards-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  if (projectsData.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding:3rem; opacity:0.6">You are not advising any projects yet.</p>';
    return;
  }

  // Create a flat list of students from projects
  const students = [];
  projectsData.forEach(proj => {
    proj.members.forEach(m => {
      students.push({
        ...m,
        project_title: proj.title,
        project_type: proj.project_type
      });
    });
  });

  if (students.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding:3rem; opacity:0.6">No students found in your projects.</p>';
    return;
  }

  grid.innerHTML = students.map(s => `
    <div class="advisee-card" onclick="openStudentDetail('${s.user_id}')">
      <div class="card-avatar" style="background: hsl(${Math.random() * 360}, 60%, 50%);">
        ${s.full_name.split(' ').map(n => n[0]).join('')}
      </div>
      <div class="card-name">${s.full_name}</div>
      <div class="card-type">${s.role || 'Member'}</div>
      <div class="card-project">${s.project_title}</div>
      <span class="badge ${s.project_type === 'Teknofest' ? 'tek' : 'tub'}">${s.project_type}</span>
    </div>
  `).join('');
  
  const sub = document.querySelector('.page-sub');
  if (sub) sub.textContent = `Students you are currently advising (${projectsData.length}/5 slots used).`;
}

function openStudentDetail(userId) {
    // Find student in projectsData
    let student = null;
    let studentProject = null;
    for (const p of projectsData) {
        student = p.members.find(m => m.user_id === userId);
        if (student) {
            studentProject = p;
            break;
        }
    }
    
    if (!student) return;

    const overlay = document.createElement('div');
    overlay.className = 'apm-overlay';
    overlay.innerHTML = `
      <div class="apm-modal">
        <div class="apm-header">
          <button class="apm-close" id="apmClose">✕</button>
          <div class="apm-av" style="background:#1a9e8f">${student.full_name.split(' ').map(n => n[0]).join('')}</div>
          <h2 class="apm-name">${student.full_name}</h2>
          <div class="apm-meta">${student.department || 'N/A'}</div>
          <div class="apm-badge">📋 Current Project: ${studentProject.title}</div>
        </div>
        <div class="apm-body">
          <div class="apm-sec-label">⚡ ROLE IN TEAM</div>
          <div style="padding: 10px; background: rgba(0,0,0,0.03); border-radius: 8px;">${student.role || 'Member'}</div>
          
          <div class="apm-sec-label">📁 PROJECT DETAILS</div>
          <div class="apm-proj-item"><strong>Title:</strong> ${studentProject.title}</div>
          <div class="apm-proj-item"><strong>Type:</strong> ${studentProject.project_type}</div>
          <div class="apm-proj-item"><strong>Status:</strong> ${studentProject.status}</div>

          <div class="apm-sec-label">📅 JOINED TEAM</div>
          <div style="font-size: 0.9rem; opacity: 0.8">${new Date(student.joined_at).toLocaleDateString()}</div>
        </div>
        <div class="apm-foot">
          <button class="apm-close-btn" id="apmCloseBtn">Close</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };

    document.getElementById('apmClose').addEventListener('click', close);
    document.getElementById('apmCloseBtn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

document.getElementById("profileBtn")?.addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['instructor']);
  if (user) {
    const sidebarName = document.querySelector('.user-name');
    const sidebarSub = document.querySelector('.user-sub');
    if (sidebarName) sidebarName.textContent = user.full_name;
    if (sidebarSub) sidebarSub.textContent = user.department || 'Instructor';
    updateAdvisorRequestsBadge();
    loadAdvisees();
  }
});
