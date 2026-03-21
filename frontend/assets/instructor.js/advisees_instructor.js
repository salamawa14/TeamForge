// ========== STUDENT DATA DATABASE ==========
const STUDENTS = {
  'Hamza Kadir': {
    initials: 'HK', color: '#8b5cf6',
    dept: 'Computer Engineering', year: '4th Year', gpa: '3.7',
    bio: 'Senior student specializing in robotics. Working on drone navigation for Teknofest.',
    skills: ['C++', 'ROS', 'Python', 'OpenCV'],
    interests: 'Robotics, Computer Vision, UAV',
    projects: ['Autonomous Drone Navigation (TEKNOFEST)'],
    github: 'github.com/hamzakadir',
    linkedin: 'linkedin.com/in/hamzakadir',
    requesting: 'Advisor for Drone Navigation',
  },
  'Nisan Ay': {
    initials: 'NA', color: '#1a9e8f',
    dept: 'Computer Engineering', year: '3rd Year', gpa: '3.8',
    bio: 'Passionate about AI. Researching crop disease detection with deep learning.',
    skills: ['Python', 'TensorFlow', 'OpenCV', 'Data Science'],
    interests: 'Machine Learning, Agriculture Tech, Computer Vision',
    projects: ['AI Crop Disease Detection (TÜBİTAK)'],
    github: 'github.com/nisanay',
    linkedin: 'linkedin.com/in/nisanay',
    requesting: 'Advisor for Crop Disease AI',
  },
  'Nurem Can': {
    initials: 'NC', color: '#3b82f6',
    dept: 'Electrical Engineering', year: '3rd Year', gpa: '3.2',
    bio: 'Working on smart water monitoring systems using IoT and embedded systems.',
    skills: ['Arduino', 'IoT', 'MQTT', 'Raspberry Pi'],
    interests: 'Embedded Systems, Smart Cities, IoT',
    projects: ['Smart Water IoT Monitoring (TÜBİTAK)'],
    github: 'github.com/nuremcan',
    linkedin: 'linkedin.com/in/nuremcan',
    requesting: 'Advisor for Smart Water IoT',
  },
  'Şan Yılmaz': {
    initials: 'ŞY', color: '#f59e0b',
    dept: 'Computer Engineering', year: '4th Year', gpa: '3.3',
    bio: 'Building AR campus navigation app for Teknofest. Interested in XR technologies.',
    skills: ['Unity', 'C#', 'ARCore', '3D Modeling'],
    interests: 'Augmented Reality, Game Dev, XR',
    projects: ['AR Campus Navigation (TEKNOFEST)'],
    github: 'github.com/sanyilmaz',
    linkedin: 'linkedin.com/in/sanyilmaz',
    requesting: 'Advisor for AR Campus App',
  }
};

// ========== OPEN PROFILE MODAL FUNCTION ==========
function openProfile(name) {
  const s = STUDENTS[name];
  if (!s) {
    console.error('Student not found:', name);
    return;
  }

  const chips = s.skills.map(sk => `<span class="apm-chip">${sk}</span>`).join('');
  const projList = s.projects.map(p => `<div class="apm-proj-item">📁 ${p}</div>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'apm-overlay';
  overlay.innerHTML = `
    <div class="apm-modal">
      <div class="apm-header">
        <button class="apm-close" id="apmClose">✕</button>
        <div class="apm-av" style="background:${s.color}">${s.initials}</div>
        <h2 class="apm-name">${name}</h2>
        <div class="apm-meta">${s.dept} · ${s.year}</div>
        <div class="apm-badge">📋 ${s.requesting}</div>
      </div>
      <div class="apm-body">
        <div class="apm-bio">${s.bio}</div>
        <div class="apm-stats">
          <div class="apm-stat"><span class="apm-stat-n">${s.gpa}</span><span class="apm-stat-l">GPA</span></div>
          <div class="apm-stat"><span class="apm-stat-n">${s.skills.length}</span><span class="apm-stat-l">Skills</span></div>
          <div class="apm-stat"><span class="apm-stat-n">${s.projects.length}</span><span class="apm-stat-l">Projects</span></div>
        </div>
        <div class="apm-sec-label">⚡ TECHNICAL SKILLS</div>
        <div class="apm-chips">${chips}</div>
        <div class="apm-sec-label">💡 INTERESTS</div>
        <div class="apm-interests">${s.interests}</div>
        <div class="apm-sec-label">📁 PREVIOUS PROJECTS</div>
        <div class="apm-projects">${projList}</div>
        <div class="apm-sec-label">🔗 LINKS</div>
        <div class="apm-links">
          <a class="apm-link" href="#">🐙 ${s.github}</a>
          <a class="apm-link" href="#">💼 ${s.linkedin}</a>
        </div>
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
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

// ────────────────────────────────────────────────────────────────
var activeCard = null;
var grid       = document.getElementById('cards-grid');

// ── OPEN PANEL ──────────────────────────────────────────
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});

// ── CLOSE BUTTON ────────────────────────────────────────

// ── TOPBAR BUTTONS ──────────────────────────────────────




// ── NAV HIGHLIGHT ───────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    item.classList.add('active');
  });
});
