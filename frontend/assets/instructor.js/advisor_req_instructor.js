// ===== CONFIRMATION MODAL FUNCTION - NEW =====
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
  document.body.style.overflow = 'hidden';
  
  const btnConfirm = modal.querySelector('.btn-confirm');
  const btnCancel = modal.querySelector('.btn-cancel');
  
  const closeModal = () => {
    modal.remove();
    document.body.style.overflow = '';
  };
  
  btnConfirm.addEventListener('click', () => {
    closeModal();
    onConfirm();
  });
  
  btnCancel.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

/* ── Student data for profile modal ── */
const STUDENTS = {
  'Jeren Student': {
    initials: 'JS', color: '#3b82f6',
    dept: 'Computer Engineering', year: '3rd Year', gpa: '3.4',
    bio: 'Passionate about IoT and smart systems. Working on integrating ML with hardware for real-world applications.',
    skills: ['Python', 'TensorFlow', 'IoT', 'MQTT', 'React'],
    interests: 'Smart Cities, IoT, Machine Learning',
    projects: ['Smart Home Automation (COURSE)', 'Campus Sensor Network (TÜBİTAK)'],
    github: 'github.com/jerenstudent',
    linkedin: 'linkedin.com/in/jerenstudent',
    requesting: 'Advisor for Smart Campus IoT',
    type: 'TEKNOFEST',
  },
  'Osama Sami': {
    initials: 'OS', color: '#f59e0b',
    dept: 'Electrical Engineering', year: '4th Year', gpa: '3.5',
    bio: 'Final year student specializing in NLP and AI. Applying TÜBİTAK grant for healthcare research.',
    skills: ['Python', 'PyTorch', 'NLP', 'BERT', 'FastAPI'],
    interests: 'Natural Language Processing, Healthcare AI, Deep Learning',
    projects: ['Sentiment Analysis Tool (COURSE)', 'Medical NLP Prototype (TÜBİTAK)'],
    github: 'github.com/osamasami',
    linkedin: 'linkedin.com/in/osamasami',
    requesting: 'Advisor for AI Healthcare NLP',
    type: 'TÜBİTAK',
  },
  'Amara Diallo': {
    initials: 'AD', color: '#8b5cf6',
    dept: 'Computer Engineering', year: '2nd Year', gpa: '3.6',
    bio: 'Interested in social media analytics and real-time data processing. Strong background in ML pipelines.',
    skills: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn', 'Spark'],
    interests: 'Social Media Analysis, Big Data, ML',
    projects: ['Twitter Sentiment Bot (COURSE)', 'Real-Time Analytics Dashboard (COURSE)'],
    github: 'github.com/amaradiallo',
    linkedin: 'linkedin.com/in/amaradiallo',
    requesting: 'Advisor for Social Media Sentiment',
    type: 'TÜBİTAK',
  },
  'Hamza Kadir': {
    initials: 'HK', color: '#1a9e8f',
    dept: 'Computer Engineering', year: '4th Year', gpa: '3.7',
    bio: 'Experienced in autonomous systems and robotics. Leading Teknofest smart campus scheduling project.',
    skills: ['C++', 'ROS', 'Python', 'OpenCV', 'Linux'],
    interests: 'Robotics, Autonomous Systems, Computer Vision',
    projects: ['Robot Navigation System (COURSE)', 'Smart Campus Scheduling (TEKNOFEST)'],
    github: 'github.com/hamzakadir',
    linkedin: 'linkedin.com/in/hamzakadir',
    requesting: 'Advisor for Smart Campus Scheduling',
    type: 'TEKNOFEST',
  },
  'Nisan Ay': {
    initials: 'NA', color: '#3b82f6',
    dept: 'Computer Engineering', year: '3rd Year', gpa: '3.8',
    bio: 'Quantum computing enthusiast with strong theoretical foundation. Working on quantum algorithms implementation.',
    skills: ['Python', 'Quantum Computing', 'Qiskit', 'Math', 'Physics'],
    interests: 'Quantum Computing, Quantum Algorithms, Physics Simulation',
    projects: ['Quantum Circuit Simulator (COURSE)', 'Quantum Computing Sim (TÜBİTAK)'],
    github: 'github.com/nisanay',
    linkedin: 'linkedin.com/in/nisanay',
    requesting: 'Advisor for Quantum Computing Sim',
    type: 'TÜBİTAK',
  },
  'Mehmet Kaya': {
    initials: 'MK', color: '#ef4444',
    dept: 'Electrical Engineering', year: '3rd Year', gpa: '3.2',
    bio: 'Working on drone navigation systems and autonomous flight control. Interest in hardware-software integration.',
    skills: ['C', 'Embedded Systems', 'Python', 'Arduino', 'Control Systems'],
    interests: 'Drone Technology, Embedded Systems, Autonomous Flight',
    projects: ['Drone Flight Simulation (COURSE)', 'Drone Navigation (TEKNOFEST)'],
    github: 'github.com/mehmmetkaya',
    linkedin: 'linkedin.com/in/mehmmetkaya',
    requesting: 'Advisor for Drone Navigation',
    type: 'TEKNOFEST',
  }
};

/* ── Open Profile Modal ── */
function openProfile(name, itemId) {
  const s = STUDENTS[name];
  if (!s) return;

  const chips    = s.skills.map(sk => `<span class="apm-chip">${sk}</span>`).join('');
  const projList = s.projects.map(p => `<div class="apm-proj-item">📁 ${p}</div>`).join('');

  // Check if this is from accepted or rejected section
  const isAcceptedOrRejected = itemId && (itemId.startsWith('acc-') || itemId.startsWith('rej-'));
  
  // Only show Accept/Reject buttons for pending items
  const footerButtons = isAcceptedOrRejected ? 
    `<button class="apm-close-btn" id="apmCloseBtn">Close</button>` :
    `<button class="apm-accept"  id="apmAccept">✓ Accept</button>
     <button class="apm-decline" id="apmDecline">✗ Reject</button>
     <button class="apm-close-btn" id="apmCloseBtn">Close</button>`;

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
        ${footerButtons}
      </div>
    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function close() { overlay.remove(); document.body.style.overflow = ''; }

  document.getElementById('apmClose').onclick    = close;
  document.getElementById('apmCloseBtn').onclick = close;
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });

  // Only add listeners if buttons exist (pending items)
  const acceptBtn = document.getElementById('apmAccept');
  const rejectBtn = document.getElementById('apmDecline');
  
  if (acceptBtn) acceptBtn.onclick  = () => { close(); acceptReq(itemId, name); };
  if (rejectBtn) rejectBtn.onclick = () => { close(); rejectReq(itemId); };
}

/* ── Accept / Reject ── */
var counts = { pending: 3, accepted: 4, rejected: 1 };

function acceptReq(id, name) {
  showConfirmModal(
    'Confirm Application',
    `Are you sure you want to ACCEPT ${name}'s request?`,
    () => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.transition = 'all .3s';
      el.style.opacity = '0'; el.style.transform = 'translateX(20px)';
      setTimeout(() => {
        el.remove();
        counts.pending = Math.max(0, counts.pending - 1);
        counts.accepted++;
        updateTabs();
        showToast('✓ ' + name + ' accepted!', 'ok');
      }, 300);
    }
  );
}

function rejectReq(id) {
  const name = document.getElementById(id)?.querySelector('strong')?.textContent || 'Student';
  showConfirmModal(
    'Confirm Rejection',
    `Are you sure you want to REJECT ${name}'s request?`,
    () => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.transition = 'all .3s';
      el.style.opacity = '0'; el.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        el.remove();
        counts.pending = Math.max(0, counts.pending - 1);
        counts.rejected++;
        updateTabs();
        showToast('Request rejected.', 'err');
      }, 300);
    }
  );
}

function updateTabs() {
  const labels = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected' };
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const key = btn.dataset.tab;
    const teal = key === 'pending' ? ' teal' : '';
    btn.innerHTML = `${labels[key]} <span class="tab-count${teal}">${counts[key]}</span>`;
  });
  const badge = document.querySelector('.nav-badge');
  if (badge) { badge.textContent = counts.pending; if (!counts.pending) badge.style.display = 'none'; }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  // burger
  const sb = document.querySelector('.sidebar'), burg = document.getElementById('burg');
  burg?.addEventListener('click', () => sb.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sb.classList.contains('open') && !sb.contains(e.target) && e.target !== burg)
      sb.classList.remove('open');
  });

  // notification panel
  const nBtn = document.getElementById('nBtn'), nPanel = document.getElementById('nPanel');
  nBtn.addEventListener('click', e => { e.stopPropagation(); nPanel.classList.toggle('open'); });
  document.addEventListener('click', e => { if (!nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('open'); });

  // tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pane-' + btn.dataset.tab).classList.add('active');
    });
  });
});

/* ── Toast ── */
function showToast(msg, type = '') {
  let t = document.getElementById('_toast');
  if (!t) { t = document.createElement('div'); t.id = '_toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3400);
}
