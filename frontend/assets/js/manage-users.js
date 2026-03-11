/* ═══════════════════════════════════════════════
   data.js — Shared Mock Data
   TeamForge
═══════════════════════════════════════════════ */

const DATA = {

  /* ── PROJECTS ── */
  projects: [
    {
      id: 0,
      title: 'Smart Campus IoT System',
      type: 'teknofest',
      dept: 'Computer Engineering',
      desc: 'IoT + ML system for smart campus — occupancy, energy and water monitoring in real time.',
      long: 'Building a network of low-power IoT sensors that monitor occupancy, energy usage, and water consumption across campus buildings. Data flows via MQTT to a cloud dashboard with ML anomaly detection. Competing in Teknofest Smart Systems category.',
      skills: ['Python', 'IoT', 'MQTT', 'TensorFlow', 'React', 'Node.js'],
      roles: ['Backend Developer', 'UI/UX Designer'],
      mem: 3, max: 5, days: 2,
      leader: { name: 'Jeren Student', init: 'JS', color: '#00a8b5', year: '3rd Year' },
      members: [
        { name: 'Jeren Student', init: 'JS', color: '#00a8b5', role: 'Project Lead / ML' },
        { name: 'Nurem Can',     init: 'NC', color: '#0984e3', role: 'Hardware / Sensors' },
        { name: 'Hamza Kadir',   init: 'HK', color: '#a29bfe', role: 'Backend / API' },
      ],
      advisor: { has: false, seeking: true },
      deadline: 'May 1, 2026',
      budget: null,
      isMine: true,
      isOwner: true,
    },
    {
      id: 1,
      title: 'AI Crop Disease Detection',
      type: 'tubitak',
      dept: 'Computer Engineering',
      desc: 'Deep learning system to detect crop diseases from drone multispectral images.',
      long: 'Transfer learning on CNNs to identify disease type and severity from drone images. Dataset collected with an agricultural research institute. Final: mobile-ready API + farmer dashboard.',
      skills: ['Python', 'TensorFlow', 'OpenCV', 'Drone API', 'Data Annotation'],
      roles: ['ML Engineer', 'Field Researcher'],
      mem: 2, max: 4, days: 1,
      leader: { name: 'Nisan Ay', init: 'NA', color: '#27ae60', year: '3rd Year' },
      members: [
        { name: 'Nisan Ay',  init: 'NA', color: '#27ae60', role: 'Project Lead / ML' },
        { name: 'Beza Sara', init: 'BS', color: '#ff6b6b', role: 'Backend / API' },
      ],
      advisor: {
        has: true,
        name: 'Dr. Ahmet Kaplan',
        title: 'Associate Prof.',
        dept: 'Computer Engineering',
        init: 'AK',
        color: '#00a8b5',
      },
      deadline: 'April 15, 2026',
      budget: '₺9,000',
      isMine: false,
    },
    {
      id: 2,
      title: 'Autonomous Drone Navigation',
      type: 'teknofest',
      dept: 'Computer Engineering',
      desc: 'Full autonomous drone for Teknofest 2026 UAV category — ROS2, sensor fusion, obstacle avoidance.',
      long: 'Sensor fusion (IMU + depth camera + optical flow), YOLO obstacle avoidance, ROS2 Nav2 mission planning. Competing Teknofest Autonomous UAV. Looking for software and hardware contributors.',
      skills: ['C++', 'ROS2', 'Python', 'Computer Vision', 'Embedded', 'SolidWorks'],
      roles: ['ROS Developer', 'Mechanical Designer', 'Electronics Engineer'],
      mem: 3, max: 6, days: 1,
      leader: { name: 'Şan Yılmaz', init: 'ŞY', color: '#f39c12', year: '4th Year' },
      members: [
        { name: 'Şan Yılmaz',     init: 'ŞY', color: '#f39c12', role: 'Project Lead / ROS' },
        { name: 'Osama Sami',     init: 'OS', color: '#e17055', role: 'Embedded / Electronics' },
        { name: 'Jeren Student',  init: 'JS', color: '#00a8b5', role: 'Computer Vision' },
      ],
      advisor: {
        has: true,
        name: 'Prof. Ömer Şahin',
        title: 'Professor',
        dept: 'Mechanical Engineering',
        init: 'ÖŞ',
        color: '#f39c12',
      },
      deadline: 'May 1, 2026',
      budget: null,
      isMine: true,
      isOwner: false,
    },
    {
      id: 3,
      title: 'E-Commerce Web Platform',
      type: 'course',
      dept: 'Computer Engineering',
      desc: 'Full-stack marketplace with React frontend, Node.js backend, payment simulation and admin panel.',
      long: 'SE405 course project. JWT auth, Stripe mock, real-time order tracking, seller analytics. No advisor needed.',
      skills: ['React', 'Node.js', 'MySQL', 'Tailwind CSS', 'REST API'],
      roles: ['Frontend Developer', 'Backend Developer'],
      mem: 2, max: 4, days: 3,
      leader: { name: 'Beza Sara', init: 'BS', color: '#ff6b6b', year: '2nd Year' },
      members: [
        { name: 'Beza Sara',   init: 'BS', color: '#ff6b6b', role: 'Project Lead / Frontend' },
        { name: 'Rami Hassan', init: 'RH', color: '#00b894', role: 'Backend / Database' },
      ],
      advisor: { has: false, seeking: false },
      deadline: 'March 20, 2026',
      budget: null,
      isMine: false,
    },
    {
      id: 4,
      title: 'Smart Water IoT',
      type: 'tubitak',
      dept: 'Electrical Engineering',
      desc: 'IoT sensor network for real-time water usage monitoring and leak detection on campus.',
      long: '30+ low-power sensors stream data via MQTT. Anomaly detection flags leaks. Targets 20% campus water waste reduction. TÜBİTAK funded if approved.',
      skills: ['Arduino', 'MQTT', 'Raspberry Pi', 'Python', 'InfluxDB', 'Grafana'],
      roles: ['IoT Hardware Developer', 'Cloud Backend Dev'],
      mem: 1, max: 3, days: 5,
      leader: { name: 'Nurem Can', init: 'NC', color: '#0984e3', year: '3rd Year' },
      members: [
        { name: 'Nurem Can', init: 'NC', color: '#0984e3', role: 'Project Lead / Hardware' },
      ],
      advisor: { has: false, seeking: true },
      deadline: 'April 15, 2026',
      budget: '₺9,000',
      isMine: false,
    },
    {
      id: 5,
      title: 'SE302 Mobile App',
      type: 'course',
      dept: 'Computer Engineering',
      desc: 'React Native app for SE302 — Kanban board, Gantt chart, team chat and file sharing.',
      long: 'SE302 course project. React Native + Node.js + SQLite. Kanban, Gantt, team chat, file sharing. Looking for 1 backend developer.',
      skills: ['React Native', 'Node.js', 'SQLite', 'Redux'],
      roles: ['Backend Developer (Node.js)'],
      mem: 4, max: 5, days: 6,
      leader: { name: 'Jeren Student', init: 'JS', color: '#00a8b5', year: '3rd Year' },
      members: [
        { name: 'Jeren Student', init: 'JS', color: '#00a8b5', role: 'Project Lead' },
        { name: 'Amara Diallo',  init: 'AD', color: '#6c63ff', role: 'Frontend' },
        { name: 'Hamza Kadir',   init: 'HK', color: '#a29bfe', role: 'Database' },
        { name: 'Nisan Ay',      init: 'NA', color: '#27ae60', role: 'Testing' },
      ],
      advisor: { has: false, seeking: false },
      deadline: 'March 25, 2026',
      budget: null,
      isMine: true,
      isOwner: true,
    },
    {
      id: 6,
      title: 'AR Campus Navigation',
      type: 'teknofest',
      dept: 'Computer Engineering',
      desc: 'Mobile AR app overlaying directions, building labels and events onto the campus camera view.',
      long: 'ARCore + ARKit overlay 3D markers. Integrates campus database for room schedules and events. Competing Teknofest Mobile App category.',
      skills: ['Unity', 'C#', 'ARCore', 'ARKit', 'Firebase', 'REST API'],
      roles: ['AR/Unity Developer', 'Backend / Firebase Dev'],
      mem: 2, max: 5, days: 4,
      leader: { name: 'Amara Diallo', init: 'AD', color: '#6c63ff', year: '2nd Year' },
      members: [
        { name: 'Amara Diallo', init: 'AD', color: '#6c63ff', role: 'Project Lead / AR Dev' },
        { name: 'Nurem Can',    init: 'NC', color: '#0984e3', role: 'Backend / API' },
      ],
      advisor: {
        has: true,
        name: 'Dr. Selin Arslan',
        title: 'Lecturer',
        dept: 'Computer Engineering',
        init: 'SA',
        color: '#ff6b6b',
      },
      deadline: 'May 1, 2026',
      budget: null,
      isMine: false,
    },
  ],

  /* ── ADVISORS ── */
  advisors: [
    {
      id: 0,
      name: 'Dr. Ahmet Kaplan',
      title: 'Associate Professor',
      dept: 'Computer Engineering',
      exp: ['Machine Learning', 'Computer Vision', 'Deep Learning', 'IoT'],
      tubitak: true, teknofest: true,
      init: 'AK', color: '#00a8b5',
      used: 4, max: 5,
      bio: 'Research focuses on applied ML for industrial systems. Supervised 12 TÜBİTAK and 5 Teknofest projects.',
      projs: [
        { t: 'Autonomous Drone Vision', type: 'teknofest' },
        { t: 'Crop Disease Detection',  type: 'tubitak' },
        { t: 'Smart Traffic System',    type: 'tubitak' },
      ],
    },
    {
      id: 1,
      name: 'Prof. Ayşe Yıldız',
      title: 'Professor',
      dept: 'Electrical Engineering',
      exp: ['Robotics', 'Control Systems', 'Embedded Systems', 'FPGA'],
      tubitak: true, teknofest: false,
      init: 'AY', color: '#6c63ff',
      used: 3, max: 5,
      bio: 'Full professor with 15+ years in robotics. Prefers TÜBİTAK projects with industrial applications.',
      projs: [
        { t: 'Industrial Robot Arm',    type: 'tubitak' },
        { t: 'Self-Balancing Robot',    type: 'tubitak' },
      ],
    },
    {
      id: 2,
      name: 'Dr. Murat Demir',
      title: 'Assistant Professor',
      dept: 'Molecular Biology',
      exp: ['Bioinformatics', 'Genomics', 'Data Analysis', 'Python'],
      tubitak: true, teknofest: false,
      init: 'MD', color: '#27ae60',
      used: 2, max: 4,
      bio: 'Bridges biology and computer science. Open to interdisciplinary TÜBİTAK projects.',
      projs: [
        { t: 'Genome Sequence Analysis', type: 'tubitak' },
      ],
    },
    {
      id: 3,
      name: 'Dr. Selin Arslan',
      title: 'Lecturer',
      dept: 'Computer Engineering',
      exp: ['Web Technologies', 'Cloud Computing', 'React', 'Microservices'],
      tubitak: false, teknofest: true,
      init: 'SA', color: '#ff6b6b',
      used: 2, max: 4,
      bio: 'Industry background in full-stack development. Passionate about modern web tech and startup ideas.',
      projs: [
        { t: 'Campus Event Platform', type: 'teknofest' },
        { t: 'Smart Scheduling App',  type: 'teknofest' },
      ],
    },
    {
      id: 4,
      name: 'Prof. Ömer Şahin',
      title: 'Professor',
      dept: 'Mechanical Engineering',
      exp: ['Drone Systems', 'Aerodynamics', 'ROS', 'Simulation'],
      tubitak: true, teknofest: true,
      init: 'ÖŞ', color: '#f39c12',
      used: 5, max: 5,
      bio: 'Leading authority on UAV systems. Teknofest adviser for 4 consecutive years. Currently full.',
      projs: [
        { t: 'Fixed-Wing UAV',     type: 'teknofest' },
        { t: 'Drone Swarm Sim.',   type: 'tubitak' },
        { t: 'Delivery Drone',     type: 'teknofest' },
      ],
    },
    {
      id: 5,
      name: 'Dr. Fatma Çelik',
      title: 'Associate Professor',
      dept: 'Industrial Engineering',
      exp: ['Optimization', 'Data Analytics', 'Supply Chain', 'Operations Research'],
      tubitak: true, teknofest: false,
      init: 'FÇ', color: '#a29bfe',
      used: 1, max: 5,
      bio: 'Expert in data-driven optimization for logistics and manufacturing.',
      projs: [
        { t: 'Warehouse Optimization', type: 'tubitak' },
      ],
    },
    {
      id: 6,
      name: 'Dr. Kemal Tuncer',
      title: 'Assistant Professor',
      dept: 'Electrical Engineering',
      exp: ['Signal Processing', 'MATLAB', 'Control Theory', 'Embedded'],
      tubitak: true, teknofest: false,
      init: 'KT', color: '#00b894',
      used: 1, max: 3,
      bio: 'Focus on control and embedded systems. Welcomes students from multiple backgrounds.',
      projs: [
        { t: 'Motor Control System', type: 'tubitak' },
      ],
    },
    {
      id: 7,
      name: 'Dr. Layla Hassan',
      title: 'Lecturer',
      dept: 'Computer Engineering',
      exp: ['Cybersecurity', 'Network Security', 'Python', 'Ethical Hacking'],
      tubitak: false, teknofest: true,
      init: 'LH', color: '#e17055',
      used: 3, max: 4,
      bio: 'Certified cybersecurity professional. Runs the university cyber defense club.',
      projs: [
        { t: 'Network Security Audit', type: 'teknofest' },
        { t: 'Phishing Detection AI',  type: 'teknofest' },
      ],
    },
  ],

  /* ── ANNOUNCEMENTS ── */
  announcements: [
    {
      id: 0,
      ico: '📋',
      type: 'general',
      title: 'Gantt Chart Submission Due Sunday',
      body: 'All teams registered in SE302 and SE404 must upload their Gantt charts to the LMS before Sunday March 8 at 23:59. Late submissions will receive a 20% grade penalty. Contact your lab assistant if you have questions.',
      date: 'March 7, 2026',
      deadline: 'March 8, 2026',
      badge: 'General',
      bc: 'bc',
    },
    {
      id: 1,
      ico: '🔬',
      type: 'tubitak',
      title: 'TÜBİTAK 2209-A Applications Now Open',
      body: 'The application window for TÜBİTAK 2209-A (2026 term) is now open. Max 4 students, budget up to ₺9,000. Academic advisor mandatory. Submit via the e-Bideb portal. Projects must align with national priorities.',
      date: 'March 5, 2026',
      deadline: 'April 15, 2026',
      badge: 'TÜBİTAK',
      bc: 'bt',
    },
    {
      id: 2,
      ico: '🚀',
      type: 'teknofest',
      title: 'Teknofest 2026 Registration Open',
      body: 'Teknofest 2026 registration is live. Interdisciplinary teams encouraged. Categories: Autonomous Systems, Smart Agriculture, Cybersecurity, Aerospace. Register on the official portal before the deadline.',
      date: 'Feb 28, 2026',
      deadline: 'May 1, 2026',
      badge: 'Teknofest',
      bc: 'bk',
    },
    {
      id: 3,
      ico: '📋',
      type: 'tubitak',
      title: 'TÜBİTAK 2209-B Results Announced',
      body: 'Results for TÜBİTAK 2209-B projects submitted in October 2025 are published. Check your status on e-Bideb. Accepted projects should contact the research office within 2 weeks for fund disbursement.',
      date: 'Feb 20, 2026',
      deadline: null,
      badge: 'TÜBİTAK',
      bc: 'bt',
    },
    {
      id: 4,
      ico: '📢',
      type: 'general',
      title: 'New Bulletin Board System Launched',
      body: 'The new TeamForge digital bulletin board is live. Students can browse projects, find advisors, and manage applications in one place. Instructors can manage advisor requests from their dashboard.',
      date: 'Feb 15, 2026',
      deadline: null,
      badge: 'General',
      bc: 'bc',
    },
  ],

  /* ── ACTIVITY FEED ── */
  feed: [
    { ico: '📁', cls: 'af-p', t: 'New project: <strong>Quantum Simulation Tool</strong>',        s: 'TÜBİTAK · Physics Dept. · 2 members needed',         time: '5 min ago',   chip: 'TÜBİTAK',  cc: 'c-t' },
    { ico: '📢', cls: 'af-a', t: '<strong>Admin:</strong> Gantt Chart due Sunday March 8',        s: 'Upload to LMS before 23:59',                         time: '1 hour ago',  chip: 'Urgent',    cc: 'c-er' },
    { ico: '✅', cls: 'af-r', t: 'Dr. Selin Arslan accepted a student advisor request',           s: 'Smart Campus Scheduling – Teknofest',                time: '2 hours ago', chip: 'Accepted',  cc: 'c-ok' },
    { ico: '👤', cls: 'af-n', t: 'New student joined: <strong>Amara Diallo</strong>',             s: 'Computer Engineering · 2nd Year · Python, React',   time: '3 hours ago', chip: 'New',       cc: 'c-new' },
    { ico: '📁', cls: 'af-p', t: 'Project <strong>AR Campus Navigation</strong> needs 3 members', s: 'Teknofest · Unity, C#, ARCore · by Amara D.',        time: '4 hours ago', chip: 'Teknofest', cc: 'c-k' },
    { ico: '📢', cls: 'af-a', t: 'TÜBİTAK 2209-A applications now open',                         s: 'Deadline: April 15, 2026. Budget ₺9,000.',           time: '2 days ago',  chip: 'TÜBİTAK',  cc: 'c-t' },
  ],

  /* ── STUDENTS (for instructor view) ── */
  students: [
    { id: 0, name: 'Jeren Student',  init: 'JS', color: '#00a8b5', dept: 'Computer Engineering', year: '3rd Year', gpa: 3.4, skills: ['Python','React','Node.js','TensorFlow','IoT'],     seeking: true,  projects: 2 },
    { id: 1, name: 'Amara Diallo',   init: 'AD', color: '#6c63ff', dept: 'Computer Engineering', year: '2nd Year', gpa: 3.7, skills: ['Unity','C#','ARCore','Firebase'],                  seeking: false, projects: 1 },
    { id: 2, name: 'Nurem Can',      init: 'NC', color: '#0984e3', dept: 'Electrical Engineering',year: '3rd Year', gpa: 3.2, skills: ['Arduino','MQTT','Raspberry Pi','Python'],          seeking: true,  projects: 2 },
    { id: 3, name: 'Nisan Ay',       init: 'NA', color: '#27ae60', dept: 'Computer Engineering', year: '3rd Year', gpa: 3.8, skills: ['Python','TensorFlow','OpenCV','Django'],            seeking: false, projects: 1 },
    { id: 4, name: 'Beza Sara',      init: 'BS', color: '#ff6b6b', dept: 'Computer Engineering', year: '2nd Year', gpa: 3.5, skills: ['React','Node.js','MySQL','CSS'],                   seeking: true,  projects: 1 },
    { id: 5, name: 'Osama Sami',     init: 'OS', color: '#e17055', dept: 'Computer Engineering', year: '4th Year', gpa: 3.1, skills: ['C++','ROS2','Embedded','SolidWorks'],              seeking: false, projects: 2 },
    { id: 6, name: 'Hamza Kadir',    init: 'HK', color: '#a29bfe', dept: 'Computer Engineering', year: '2nd Year', gpa: 3.3, skills: ['Node.js','Express','PostgreSQL','Docker'],          seeking: true,  projects: 2 },
    { id: 7, name: 'Rami Hassan',    init: 'RH', color: '#00b894', dept: 'Computer Engineering', year: '3rd Year', gpa: 3.6, skills: ['Java','Spring Boot','MySQL','REST API'],           seeking: true,  projects: 1 },
    { id: 8, name: 'Şan Yılmaz',    init: 'ŞY', color: '#f39c12', dept: 'Computer Engineering', year: '4th Year', gpa: 3.9, skills: ['C++','ROS2','Python','Computer Vision','ROS'],     seeking: false, projects: 2 },
  ],

  /* ── LABEL MAPS ── */
  TL: { course: 'Course', tubitak: 'TÜBİTAK', teknofest: 'Teknofest' },
  BC: { course: 'bc',     tubitak: 'bt',       teknofest: 'bk' },
  TCLR: {
    course:    'linear-gradient(135deg,#1e3560,#2d4a8a)',
    tubitak:   'linear-gradient(135deg,#007a8a,#00a8b5)',
    teknofest: 'linear-gradient(135deg,#b8770d,#f39c12)',
  },
};

/*
 ─────────────────────────────────────────────────────────────────
 NOTE FOR BACKEND TEAM:
 This file contains mock data used during frontend development.
 When the PHP backend is ready, replace this file's DATA object
 by loading real data from the API like this:

   const DATA = await fetch('/SE302-TeamForge/api/data.php').then(r => r.json());

 Or inject it server-side from PHP into a <script> tag.
 ─────────────────────────────────────────────────────────────────
*/


/* ═══════════════════════════════════════════════════════════════
   main.js — Shared Utility Functions
   SE302 TeamForge
   ─────────────────────────────────────────────────────────────
   Used by: student.js, instructor.js, admin.js
   ─────────────────────────────────────────────────────────────
   Exports (globals):
     nav(id)                              → switch page
     stab(el, panelId)                   → switch tab (auto-scope)
     htab(el, panelId, scopeId)          → switch tab (manual scope)
     toast(msg, type)                    → show notification
     gSearch(val)                        → global search → browse
     openProjPanel(id, pState, opts)     → open project side panel
     closeProjPanel()
     openAdvPanel(id)                    → open advisor side panel
     closeAdvPanel()
     openAnnDialog(id)                   → open announcement modal
     closeAnnDialog()
     mkProjectCard(p, pState)            → returns project card HTML
     mkAdvisorCard(a)                    → returns advisor card HTML
     mkProgressBar(current, max, color)  → returns progress bar HTML
     renderAnnList(containerId, items)   → render announcements list
     renderFeedList(containerId)         → render activity feed
     addSkillPill(event, arr, wrapperId) → handle skill input
     removeSkillPill(i, arr, wrapperId)  → remove skill pill
     renderSkillPills(arr, wrapperId)    → re-render skill pills
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */

/**
 * Switch the visible page section.
 * @param {string} id - Page ID (matches id="p-{id}" and id="ni-{id}")
 */
function nav(id) {
  // Hide all pages, show target
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
  const page = document.getElementById('p-' + id);
  if (page) page.classList.add('on');

  // Update topbar title
  const ttl = document.getElementById('ttl');
  if (ttl && window.PAGE_TITLES) ttl.textContent = window.PAGE_TITLES[id] || id;

  // Update sidebar active state
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('on'));
  const ni = document.getElementById('ni-' + id);
  if (ni) ni.classList.add('on');

  // Notify page-specific JS (student.js / instructor.js / admin.js)
  if (window.onNavChange) window.onNavChange(id);

  window.scrollTo(0, 0);
}

/* ─────────────────────────────────────────
   TABS
───────────────────────────────────────── */

/**
 * Switch tab — auto-scopes within parent .pg
 * @param {HTMLElement} el      - Clicked tab element
 * @param {string}      panelId - Target tab panel ID
 */
function stab(el, panelId) {
  el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  const scope = el.closest('.pg') || document.body;
  scope.querySelectorAll(':scope > .tp').forEach(t => t.classList.remove('on'));
  const p = document.getElementById(panelId);
  if (p) p.classList.add('on');
}

/**
 * Switch tab — manual scope (when .tp panels are not direct children of .pg)
 * @param {HTMLElement} el      - Clicked tab element
 * @param {string}      panelId - Target tab panel ID
 * @param {string}      scopeId - Container element ID for scoping
 */
function htab(el, panelId, scopeId) {
  const scope = scopeId ? document.getElementById(scopeId) : el.closest('.pg');
  if (scope) {
    scope.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
    scope.querySelectorAll('.tp').forEach(t => t.classList.remove('on'));
  }
  el.classList.add('on');
  const p = document.getElementById(panelId);
  if (p) p.classList.add('on');
}

/* ─────────────────────────────────────────
   TOAST NOTIFICATIONS
───────────────────────────────────────── */

/**
 * Show a toast notification that disappears after 3.5s
 * @param {string} msg  - Message text
 * @param {string} type - 'ok' | 'er' | 'inf' | 'warn'
 */
function toast(msg, type = 'inf') {
  const t = document.createElement('div');
  t.className = `toast t${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ─────────────────────────────────────────
   GLOBAL SEARCH
───────────────────────────────────────── */

/**
 * Triggered from topbar search input — redirects to browse page
 * @param {string} val - Search query
 */
function gSearch(val) {
  if (val.length > 2) {
    nav('browse');
    const q = document.getElementById('br-q');
    if (q) q.value = val;
    if (window.renderBrowse) renderBrowse();
  }
}

/* ─────────────────────────────────────────
   PROJECT CARD BUILDER
───────────────────────────────────────── */

/**
 * Build HTML for a project card
 * @param {Object} p       - Project object from DATA.projects
 * @param {Object} pState  - Application state map { projectId: 'applied'|'ignored' }
 * @returns {string} HTML string
 */
function mkProjectCard(p, pState = {}) {
  const st   = pState[p.id];
  const full = p.mem >= p.max;
  const { TL, BC } = DATA;

  const spotsBadge = full
    ? `<span class="chip c-er">Full</span>`
    : `<span class="chip c-ok">${p.max - p.mem} open</span>`;

  const statusBadge = st === 'applied'
    ? `<span class="chip c-ok">✓ Applied</span>`
    : st === 'ignored'
    ? `<span class="chip c-gr">Skipped</span>`
    : '';

  return `
    <div class="pc" onclick="openProjPanel(${p.id})" style="${st === 'ignored' ? 'opacity:.52' : ''}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.4rem;flex-wrap:wrap;gap:.3rem">
        <span class="bdg ${BC[p.type]}">${TL[p.type]}</span>
        <div style="display:flex;gap:.3rem;align-items:center">${spotsBadge}${statusBadge}</div>
      </div>
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="tags" style="margin-bottom:.7rem">
        ${p.skills.slice(0, 4).map(s => `<span class="tg">${s}</span>`).join('')}
        ${p.skills.length > 4 ? `<span class="tg">+${p.skills.length - 4}</span>` : ''}
      </div>
      <div class="pc-meta">
        <span>👥 ${p.mem}/${p.max}</span>
        <span>👑 ${p.leader.name}</span>
        <span>📅 ${p.days}d ago</span>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────
   ADVISOR CARD BUILDER
───────────────────────────────────────── */

/**
 * Build HTML for an advisor card
 * @param {Object} a - Advisor object from DATA.advisors
 * @returns {string} HTML string
 */
function mkAdvisorCard(a) {
  const full = a.used >= a.max;
  return `
    <div class="advc" onclick="openAdvPanel(${a.id})">
      <div class="advc-top">
        <div class="advc-av" style="background:${a.color}">${a.init}</div>
        <div class="advc-name">${a.name}</div>
        <div class="advc-title">${a.title}</div>
        <div class="advc-dept">📍 ${a.dept}</div>
        <div class="tags" style="justify-content:center;margin-bottom:.65rem">
          ${a.exp.slice(0, 3).map(e => `<span class="tg">${e}</span>`).join('')}
          ${a.exp.length > 3 ? `<span class="tg">+${a.exp.length - 3}</span>` : ''}
        </div>
        <div style="display:flex;gap:.3rem;justify-content:center;flex-wrap:wrap">
          ${a.tubitak   ? `<span class="avchip av-t">TÜBİTAK ✓</span>` : ''}
          ${a.teknofest ? `<span class="avchip av-k">Teknofest ✓</span>` : ''}
          ${full
            ? `<span class="avchip av-full">Full ✗</span>`
            : `<span class="avchip av-open">${a.max - a.used} open</span>`}
        </div>
      </div>
      <div class="advc-foot">
        <span>📁 ${a.projs.length} supervised</span>
        <span>🎓 ${a.used}/${a.max}</span>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────
   PROGRESS BAR BUILDER
───────────────────────────────────────── */

/**
 * @param {number} current
 * @param {number} max
 * @param {string} color - CSS color value
 * @returns {string} HTML string
 */
function mkProgressBar(current, max, color = 'var(--teal)') {
  const pct  = Math.round((current / max) * 100);
  const full = current >= max;
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem">
      <span style="font-size:.78rem;color:var(--gr)">👥 ${current}/${max}</span>
      <span style="font-size:.78rem;font-weight:700;color:${full ? 'var(--err)' : 'var(--ok)'}">${pct}%</span>
    </div>
    <div class="pbar">
      <div class="pbar-f" style="width:${pct}%;background:${full ? 'var(--err)' : color}"></div>
    </div>`;
}

/* ─────────────────────────────────────────
   LIST RENDERERS
───────────────────────────────────────── */

/**
 * Render a list of announcements into a container
 * @param {string} containerId
 * @param {Array}  items - Filtered subset of DATA.announcements
 */
function renderAnnList(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(a => `
    <div class="ann-row" onclick="openAnnDialog(${a.id})">
      <div class="ann-ic">${a.ico}</div>
      <div>
        <div style="margin-bottom:.18rem"><span class="bdg ${a.bc}">${a.badge}</span></div>
        <div class="ann-n">${a.title}</div>
        <div class="ann-d">${a.body.substring(0, 100)}…</div>
        <div class="ann-f">
          <span>📅 ${a.date}</span>
          ${a.deadline ? `<span>⏰ Deadline: ${a.deadline}</span>` : ''}
        </div>
      </div>
    </div>`).join('');
}

/**
 * Render the activity feed into a container
 * @param {string} containerId
 */
function renderFeedList(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = DATA.feed.map(f => `
    <div class="af">
      <div class="af-ic ${f.cls}">${f.ico}</div>
      <div>
        <div class="af-t">${f.t}</div>
        <div class="af-s">${f.s}</div>
        <div class="af-f">
          <span>${f.time}</span>
          <span class="chip ${f.cc}">${f.chip}</span>
        </div>
      </div>
    </div>`).join('');
}

/* ─────────────────────────────────────────
   SKILL PILL INPUT
───────────────────────────────────────── */

function addSkillPill(event, skillsArray, wrapperId) {
  if (event.key !== 'Enter' && event.key !== ',') return;
  event.preventDefault();
  const val = event.target.value.trim().replace(/,$/, '');
  if (val && !skillsArray.includes(val)) {
    skillsArray.push(val);
    renderSkillPills(skillsArray, wrapperId);
  }
  event.target.value = '';
}

function removeSkillPill(index, skillsArray, wrapperId) {
  skillsArray.splice(index, 1);
  renderSkillPills(skillsArray, wrapperId);
}

function renderSkillPills(skillsArray, wrapperId) {
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  const inp = wrap.querySelector('input');
  wrap.querySelectorAll('.skill-pill').forEach(p => p.remove());
  skillsArray.forEach((s, i) => {
    const pill = document.createElement('div');
    pill.className = 'skill-pill';
    pill.innerHTML = `${s}<button onclick="removeSkillPill(${i}, cpSkills, '${wrapperId}')">✕</button>`;
    wrap.insertBefore(pill, inp);
  });
}

/* ─────────────────────────────────────────
   PROJECT DETAIL PANEL
───────────────────────────────────────── */

/**
 * Open the project side panel
 * @param {number} id      - Project ID
 * @param {Object} pState  - Application state object (passed from page JS)
 * @param {Object} opts    - { isMineView: bool }
 */
function openProjPanel(id, pState, opts = {}) {
  const p = DATA.projects.find(x => x.id === id);
  if (!p) return;

  const full  = p.mem >= p.max;
  const st    = pState ? pState[id] : undefined;
  const spots = p.max - p.mem;
  const { TL, BC, TCLR } = DATA;

  document.getElementById('prj-top').style.background = TCLR[p.type];
  document.getElementById('prj-topbadge').innerHTML =
    `<span class="bdg ${BC[p.type]}" style="font-size:.75rem;padding:.2rem .75rem">${TL[p.type]}</span>`;
  document.getElementById('prj-title').textContent = p.title;
  document.getElementById('prj-short').textContent = p.desc;

  document.getElementById('prj-stats').innerHTML = `
    <div class="pstat"><div class="pstat-v">${p.mem}</div><div class="pstat-l">Members</div></div>
    <div class="pstat"><div class="pstat-v">${p.max}</div><div class="pstat-l">Max Team</div></div>
    <div class="pstat"><div class="pstat-v">${p.days}d</div><div class="pstat-l">Age</div></div>`;

  // Meta row (deadline / budget)
  const meta = document.getElementById('prj-meta');
  if (p.deadline || p.budget) {
    meta.style.display = '';
    meta.innerHTML =
      (p.deadline ? `<div><div style="font-size:.73rem;color:var(--gr)">📅 Deadline</div><strong style="font-size:.88rem;color:var(--navy)">${p.deadline}</strong></div>` : '') +
      (p.budget   ? `<div><div style="font-size:.73rem;color:var(--gr)">💰 Budget</div><strong style="font-size:.88rem;color:var(--navy)">${p.budget}</strong></div>` : '');
  } else {
    meta.style.display = 'none';
  }

  // Team capacity bar
  const pct = Math.round((p.mem / p.max) * 100);
  document.getElementById('prj-teambar').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
      <span style="font-size:.84rem;font-weight:600;color:var(--tm)">Team Capacity</span>
      <span style="font-size:.84rem;font-weight:700;color:${full ? 'var(--err)' : 'var(--ok)'}">
        ${p.mem}/${p.max} ${full ? '(Full)' : '(' + spots + ' open)'}
      </span>
    </div>
    <div class="pbar"><div class="pbar-f" style="width:${pct}%;background:${full ? 'var(--err)' : 'var(--teal)'}"></div></div>`;

  // Members list
  document.getElementById('prj-members').innerHTML =
    p.members.map(m => `
      <div class="mem-row">
        <div class="mem-av" style="background:${m.color}">${m.init}</div>
        <div>
          <div style="font-weight:700;font-size:.87rem;color:var(--navy)">${m.name}</div>
          <div style="font-size:.76rem;color:var(--gr)">${m.role}</div>
        </div>
      </div>`).join('') +
    Array.from({ length: spots }, (_, i) => `
      <div class="mem-row" style="border-style:dashed;background:transparent">
        <div class="mem-av" style="background:var(--gl);border:2px dashed var(--gr)">
          <span style="color:var(--gr)">+</span>
        </div>
        <div>
          <div style="font-weight:700;font-size:.87rem;color:var(--gr)">Open Spot</div>
          <div style="font-size:.76rem;color:var(--gr)">${p.roles[i] || 'Open Role'}</div>
        </div>
      </div>`).join('');

  // Advisor status
  let advHtml;
  if (p.advisor.has) {
    advHtml = `
      <div class="mem-row">
        <div class="mem-av" style="background:${p.advisor.color}">${p.advisor.init}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:.87rem;color:var(--navy)">${p.advisor.name}</div>
          <div style="font-size:.76rem;color:var(--gr)">${p.advisor.title} · ${p.advisor.dept}</div>
        </div>
        <span class="chip c-ok">✓ Confirmed</span>
      </div>`;
  } else if (p.advisor.seeking) {
    advHtml = `
      <div class="mem-row" style="background:rgba(243,156,18,.06);border-color:rgba(243,156,18,.3)">
        <div class="mem-av" style="background:var(--warn)">?</div>
        <div>
          <div style="font-weight:700;font-size:.87rem;color:var(--warn)">Seeking Advisor</div>
          <div style="font-size:.76rem;color:var(--gr)">Required for ${TL[p.type]} project</div>
        </div>
      </div>`;
  } else {
    advHtml = `<div style="font-size:.84rem;color:var(--gr);font-style:italic;padding:.3rem 0">No advisor required.</div>`;
  }
  document.getElementById('prj-advisor').innerHTML = advHtml;

  // Roles & Skills
  document.getElementById('prj-roles').innerHTML = p.roles.length
    ? p.roles.map(r => `
        <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;background:rgba(0,168,181,.05);border:1.5px solid rgba(0,168,181,.18);border-radius:8px;font-size:.83rem;color:var(--tm)">
          🔍 ${r}
        </div>`).join('')
    : `<div style="font-size:.84rem;color:var(--gr);font-style:italic">No specific roles listed.</div>`;

  document.getElementById('prj-skills').innerHTML =
    p.skills.map(s => `<span class="tg" style="font-size:.78rem">${s}</span>`).join('');
  document.getElementById('prj-long').textContent = p.long;

  // Action buttons
  const applyBtn = document.getElementById('prj-apply-btn');
  const skipBtn  = document.getElementById('prj-skip-btn');
  skipBtn.style.display = '';

  if (opts.isMineView) {
    applyBtn.textContent = '📁 View in My Projects';
    applyBtn.disabled = false;
    applyBtn.style.background = '';
    applyBtn.onclick = () => { closeProjPanel(); nav('my-projects'); };
    skipBtn.style.display = 'none';
  } else if (st === 'applied') {
    applyBtn.textContent = '✓ Application Sent';
    applyBtn.disabled = true;
    applyBtn.style.background = 'var(--gr)';
    skipBtn.textContent = 'Undo';
    skipBtn.onclick = () => { if (pState) delete pState[id]; openProjPanel(id, pState, opts); };
  } else if (full) {
    applyBtn.textContent = '⛔ Team is Full';
    applyBtn.disabled = true;
    applyBtn.style.background = 'var(--gr)';
    skipBtn.textContent = '👎 Not Interested';
    skipBtn.onclick = () => { if (pState) pState[id] = 'ignored'; closeProjPanel(); if (window.refreshAll) refreshAll(); toast('Project skipped.', 'inf'); };
  } else {
    applyBtn.textContent = '✅ Apply to Join';
    applyBtn.disabled = false;
    applyBtn.style.background = '';
    applyBtn.onclick = () => { if (window.showApplyDialog) showApplyDialog(id); };
    skipBtn.textContent = '👎 Not Interested';
    skipBtn.onclick = () => { if (pState) pState[id] = 'ignored'; closeProjPanel(); if (window.refreshAll) refreshAll(); toast('Project skipped.', 'inf'); };
  }

  document.getElementById('prj-ov').style.display = 'flex';
}

function closeProjPanel() {
  document.getElementById('prj-ov').style.display = 'none';
}

/* ─────────────────────────────────────────
   ADVISOR PROFILE PANEL
───────────────────────────────────────── */

function openAdvPanel(id) {
  const a = DATA.advisors.find(x => x.id === id);
  if (!a) return;
  const full = a.used >= a.max;
  const { TL, BC } = DATA;

  document.getElementById('adv-ptop').style.background = `linear-gradient(135deg,${a.color}dd,${a.color}77)`;
  document.getElementById('adv-pav').style.background   = a.color;
  document.getElementById('adv-pav').textContent        = a.init;
  document.getElementById('adv-pname').textContent      = a.name;
  document.getElementById('adv-psub').textContent       = a.title;
  document.getElementById('adv-pdept').textContent      = '📍 ' + a.dept;
  document.getElementById('adv-pbio').textContent       = a.bio;

  document.getElementById('adv-pexp').innerHTML =
    a.exp.map(e => `<span class="tg" style="font-size:.76rem">${e}</span>`).join('');

  document.getElementById('adv-pavail').innerHTML = `
    ${a.tubitak   ? `<span class="avchip av-t">TÜBİTAK ✓</span>` : ''}
    ${a.teknofest ? `<span class="avchip av-k">Teknofest ✓</span>` : ''}
    ${full
      ? `<span class="avchip av-full">Currently Full</span>`
      : `<span class="avchip av-open">${a.max - a.used} Slot(s) Open</span>`}`;

  document.getElementById('adv-pstats').innerHTML = `
    <div class="pstat"><div class="pstat-v">${a.projs.length}</div><div class="pstat-l">Supervised</div></div>
    <div class="pstat"><div class="pstat-v">${a.used}</div><div class="pstat-l">Active</div></div>
    <div class="pstat"><div class="pstat-v" style="color:${full ? 'var(--err)' : 'var(--ok)'}">${a.max - a.used}</div><div class="pstat-l">Open Slots</div></div>`;

  document.getElementById('adv-pprojs').innerHTML = a.projs.map(proj => `
    <div style="padding:.7rem .85rem;background:var(--off);border-radius:10px;border:1.5px solid var(--gl);margin-bottom:.5rem">
      <span class="bdg ${BC[proj.type] || 'bc'}" style="margin-bottom:.3rem;display:inline-block">${TL[proj.type] || proj.type}</span>
      <div style="font-weight:700;font-size:.86rem;color:var(--navy)">${proj.t}</div>
    </div>`).join('');

  const btn = document.getElementById('adv-req-btn');
  if (full) {
    btn.textContent = '⛔ Advisor at Full Capacity';
    btn.disabled = true;
    btn.style.background = 'var(--gr)';
  } else {
    btn.textContent = '📨 Send Advisor Request';
    btn.disabled = false;
    btn.style.background = '';
    btn.onclick = () => { closeAdvPanel(); if (window.showAdvReqDialog) showAdvReqDialog(id); };
  }

  document.getElementById('adv-ov').style.display = 'flex';
}

function closeAdvPanel() {
  document.getElementById('adv-ov').style.display = 'none';
}

/* ─────────────────────────────────────────
   ANNOUNCEMENT DIALOG
───────────────────────────────────────── */

function openAnnDialog(id) {
  const a = DATA.announcements.find(x => x.id === id);
  if (!a) return;
  document.getElementById('ann-dt').textContent = a.title;
  document.getElementById('ann-db').innerHTML   = `<span class="bdg ${a.bc}">${a.badge}</span>`;
  document.getElementById('ann-dd').textContent = a.body;
  document.getElementById('ann-dm').innerHTML   =
    `<span>📅 Published: ${a.date}</span>` +
    (a.deadline ? `<span>⏰ Deadline: <strong style="color:var(--err)">${a.deadline}</strong></span>` : '');
  document.getElementById('ann-ov').style.display = 'flex';
}

function closeAnnDialog() {
  document.getElementById('ann-ov').style.display = 'none';
}


/* ═══════════════════════════════════════════════════════════════
   admin.js — Admin Portal Page Logic
   SE302 TeamForge
   Depends on: main.js (must load first)
═══════════════════════════════════════════════════════════════ */

window.PAGE_TITLES = {
  dash:     '📊 Dashboard',
  users:    '👥 Manage Users',
  projects: '📁 Manage Projects',
  ann:      '📢 Announcements',
};

window.onNavChange = function (id) {
  switch (id) {
    case 'dash':     renderAdminDash();    break;
    case 'users':    renderManageUsers();  break;
    case 'projects': renderManageProjs();  break;
    case 'ann':      renderManageAnn();    break;
  }
};

/* ─── Render functions (to be implemented) ─── */
function renderAdminDash()   { /* TODO */ }
function renderManageUsers() { /* TODO */ }
function renderManageProjs() { /* TODO */ }
function renderManageAnn()   { /* TODO */ }

document.addEventListener('DOMContentLoaded', () => {
  renderAdminDash();
});