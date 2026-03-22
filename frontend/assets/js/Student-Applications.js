/* ── Project data store ── */
const PD = {
  1:{title:'Autonomous Drone Navigation',type:'TEKNOFEST',
     desc:'Full autonomous drone for Teknofest 2026 UAV category — ROS2, sensor fusion, obstacle avoidance.',
     members:3,max:6,age:'2d',deadline:'April 15, 2026',budget:null,cap:'3/6 (3 open)',pct:50,
     team:[{i:'NC',n:'Nurem Can',r:'Project Lead / Hardware',c:'#00b8b8'},{i:'JS',n:'Jeren Student',r:'Computer Vision',c:'#6366f1'},{open:true,r:'ROS2 Engineer'},{open:true,r:'Computer Vision Dev'}],
     adv:{n:'Prof. Ömer Şahin',s:'ok'},roles:['Computer Vision Developer','ROS2 Engineer'],
     skills:['C++','ROS2','Python','Computer Vision','Sensor Fusion'],
     full:'30+ autonomous navigation sensors with obstacle detection. Targets Teknofest 2026 UAV Advanced category.'},
  2:{title:'Smart Water IoT',type:'TÜBİTAK',
     desc:'IoT sensor network for real-time water usage monitoring and leak detection on campus.',
     members:1,max:3,age:'5d',deadline:'April 15, 2026',budget:'₺9,000',cap:'1/3 (2 open)',pct:33,
     team:[{i:'NC',n:'Nurem Can',r:'Project Lead / Hardware',c:'#00b8b8'},{open:true,r:'IoT Hardware Developer'},{open:true,r:'Cloud Backend Dev'}],
     adv:{n:null,s:'seek'},roles:['IoT Hardware Developer','Cloud Backend Dev'],
     skills:['Arduino','MQTT','Raspberry Pi','Python','InfluxDB','Grafana'],
     full:'30+ low-power sensors stream data via MQTT. Anomaly detection flags leaks. Targets 20% reduction in campus water waste. Fully funded by TÜBİTAK if approved.'},
  3:{title:'E-Commerce Platform',type:'COURSE',
     desc:'SE405 course project. JWT auth, Stripe mock payment, real-time order tracking, seller analytics.',
     members:3,max:4,age:'7d',deadline:null,budget:null,cap:'3/4 (1 open)',pct:75,
     team:[{i:'BS',n:'Beza Sara',r:'Project Lead / Frontend',c:'#ef4444'},{i:'RH',n:'Rami Hassan',r:'Backend / Database',c:'#22c55e'},{i:'JS',n:'Jeren Student',r:'Frontend',c:'#6366f1'},{open:true,r:'Backend Developer'}],
     adv:{n:null,s:'none'},roles:['Frontend Developer','Backend Developer'],
     skills:['React','Node.js','MySQL','Tailwind CSS','REST API'],
     full:'SE405 course project. Features: JWT auth, Stripe mock payment, real-time order tracking, seller analytics. No advisor needed.'},
  4:{title:'AR Campus Navigation App',type:'TEKNOFEST',
     desc:'Augmented reality campus map using ARCore, real-time indoor positioning via BLE beacons.',
     members:2,max:4,age:'3d',deadline:null,budget:null,cap:'2/4 (2 open)',pct:50,
     team:[{i:'DK',n:'Deniz Kara',r:'Project Lead',c:'#f97316'},{i:'AL',n:'Alp Lale',r:'AR Developer',c:'#a855f7'},{open:true,r:'Backend / Firebase'},{open:true,r:'UI Designer'}],
     adv:{n:'Dr. Ayşe Kaya',s:'ok'},roles:['Backend / Firebase Developer','UI Designer'],
     skills:['Unity','ARCore','Firebase','Kotlin','BLE'],
     full:'AR-powered indoor navigation using BLE beacon positioning. Targets Teknofest Smart Campus category.'},
  5:{title:'Smart Campus Energy Monitor',type:'TEKNOFEST',
     desc:'Real-time energy usage tracking for campus buildings using embedded sensors and dashboards.',
     members:1,max:5,age:'1d',deadline:null,budget:null,cap:'1/5 (4 open)',pct:20,
     team:[{i:'MK',n:'Mert Koç',r:'Project Lead',c:'#00b8b8'},{open:true,r:'Embedded Systems'},{open:true,r:'Data Engineer'},{open:true,r:'Frontend Dev'},{open:true,r:'ML Engineer'}],
     adv:{n:null,s:'seek'},roles:['Embedded Systems Dev','Data Engineer','Frontend Developer','ML Engineer'],
     skills:['Raspberry Pi','Python','Grafana','InfluxDB','MQTT'],
     full:'Monitor real-time energy consumption across campus buildings. Targets 25% energy reduction via smart analytics.'},
  6:{title:'NLP News Summarizer',type:'TÜBİTAK',
     desc:'Turkish-language news summarization model using transformer fine-tuning on large corpus.',
     members:1,max:4,age:'6d',deadline:'May 30, 2026',budget:'₺12,000',cap:'1/4 (3 open)',pct:25,
     team:[{i:'ED',n:'Emre Doğan',r:'Project Lead / ML',c:'#6366f1'},{open:true,r:'NLP Researcher'},{open:true,r:'Data Engineer'},{open:true,r:'Backend Developer'}],
     adv:{n:'Prof. Emre Demir',s:'ok'},roles:['NLP Researcher','Data Engineer','Backend Developer'],
     skills:['Python','PyTorch','HuggingFace','NLP','FastAPI'],
     full:'Fine-tuning multilingual transformer models for Turkish news. Dataset 500k+ articles. TÜBİTAK 2209-A grant applied.'},
  7:{title:'Blockchain Supply Chain',type:'COURSE',
     desc:'CS480 course project. Smart contracts on Ethereum for supply chain transparency.',
     members:4,max:4,age:'9d',deadline:null,budget:null,cap:'4/4 (Full)',pct:100,
     team:[{i:'AK',n:'Ali Kaya',r:'Lead / Smart Contracts',c:'#f97316'},{i:'SÖ',n:'Selin Öz',r:'Frontend / Web3',c:'#a855f7'},{i:'CY',n:'Can Yıl',r:'Backend',c:'#22c55e'},{i:'NK',n:'Nur Kol',r:'Testing / DevOps',c:'#ef4444'}],
     adv:{n:null,s:'none'},roles:[],skills:['Solidity','Web3.js','React','Hardhat','IPFS'],
     full:'Ethereum smart contracts for transparent supply chain tracking. CS480 semester project. Team is full.'},
};

/* ── Modal open ── */
function openModal(id) {
  const p = PD[id]; if (!p) return;
  const tc = p.type==='TEKNOFEST'?'b-teknofest':p.type==='TÜBİTAK'?'b-tubitak':'b-course';
  const infoHTML = (p.deadline||p.budget)?`<div class="m-infobox">${p.deadline?`📅 <strong style="color:var(--teal)">Deadline</strong> — ${p.deadline}<br>`:''}${p.budget?`💰 <strong style="color:var(--amber)">Budget</strong> — ${p.budget}`:''}</div>`:'';
  const teamHTML = p.team.map(m=>m.open
    ?`<div class="m-member"><div class="m-av open">+</div><div class="m-mbody"><b style="color:var(--t3)">Open Spot</b><span>${m.r}</span></div></div>`
    :`<div class="m-member"><div class="m-av" style="background:${m.c}">${m.i}</div><div class="m-mbody"><b>${m.n}</b><span>${m.r}</span></div></div>`
  ).join('');
  const advHTML = p.adv.s==='none'
    ?`<p style="font-size:.77rem;color:var(--t3);font-style:italic">No advisor required for this project type.</p>`
    :p.adv.s==='seek'
    ?`<div class="m-seeking">⚠ Seeking Advisor — Required for TÜBİTAK project</div>`
    :`<p class="m-advisor-name">🎓 ${p.adv.n}</p>`;
  const rolesHTML = p.roles.length
    ?p.roles.map(r=>`<div class="m-role">🔍 ${r}</div>`).join('')
    :`<p style="font-size:.77rem;color:var(--t3)">No specific roles listed.</p>`;
  const full = p.pct>=100;
  document.body.insertAdjacentHTML('beforeend',`
    <div class="overlay" id="mOverlay">
      <div class="modal-panel">
        <button class="modal-x" id="mClose">✕</button>
        <div class="m-badge"><span class="badge ${tc}">${p.type}</span></div>
        <h2 class="m-title">${p.title}</h2>
        <p class="m-desc">${p.desc}</p>
        <div class="m-stats">
          <div class="m-stat"><b>${p.members}</b><small>Members</small></div>
          <div class="m-stat"><b>${p.max}</b><small>Max Team</small></div>
          <div class="m-stat"><b>${p.age}</b><small>Age</small></div>
        </div>
        ${infoHTML}
        <div class="m-cap-row"><span>Team Capacity</span><span class="m-cap-val">${p.cap}</span></div>
        <div class="prog" style="margin-bottom:16px"><div class="prog-fill" style="width:${p.pct}%"></div></div>
        <div class="m-sec">👥 Team Members</div>${teamHTML}
        <div class="m-sec">🎓 Academic Advisor</div>${advHTML}
        <div class="m-sec">🔍 Roles Needed</div>${rolesHTML}
        <div class="m-sec">⚡ Required Skills</div>
        <div class="m-skills">${p.skills.map(s=>`<span class="chip">${s}</span>`).join('')}</div>
        <div class="m-sec">📄 Full Description</div>
        <div class="m-fulldesc">${p.full}</div>
        <div class="m-foot">
          <button class="btn btn-teal" id="mApply" ${full?'disabled':''}>
            ${full?'🔒 Team Full':'✅ Apply to Join'}
          </button>
          <button class="btn-notint" id="mNot">🤚 Not Interested</button>
        </div>
      </div>
    </div>`);
  document.body.style.overflow='hidden';
  const close=()=>{document.getElementById('mOverlay')?.remove();document.body.style.overflow=''};
  document.getElementById('mClose').onclick=close;
  document.getElementById('mOverlay').onclick=e=>{if(e.target.id==='mOverlay')close()};
  document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc)}});
  document.getElementById('mApply')?.addEventListener('click',()=>{close();showToast(`✓ Applied to "${p.title}"!`,'ok')});
  document.getElementById('mNot')?.addEventListener('click',()=>{close();showToast('Marked as not interested.')});
}

/* ── Toast ── */
function showToast(msg, type='') {
  let t = document.getElementById('_toast');
  if (!t) { t=document.createElement('div'); t.id='_toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.className='toast show'+(type?' '+type:'');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),3400);
}

/* ── Sidebar & header init ── */
document.addEventListener('DOMContentLoaded', () => {
  // active nav
  const page = location.pathname.split('/').pop()||'';
  document.querySelectorAll('.sb-link').forEach(a=>{
    if (a.getAttribute('href')===page) a.classList.add('active');
  });
  // burger
  const sb=document.getElementById('sb'), burg=document.getElementById('burg');
  burg?.addEventListener('click',()=>sb.classList.toggle('open'));
  document.addEventListener('click',e=>{
    if(sb?.classList.contains('open')&&!sb.contains(e.target)&&e.target!==burg) sb.classList.remove('open');
  });
  // notif
  const nBtn=document.getElementById('nBtn'), nPanel=document.getElementById('nPanel');
  nBtn?.addEventListener('click',e=>{e.stopPropagation();nPanel.classList.toggle('open')});
  document.addEventListener('click',e=>{if(nPanel&&!nPanel.contains(e.target)&&e.target!==nBtn)nPanel.classList.remove('open')});
  // global search
  const gs=document.getElementById('gs');
  gs?.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&gs.value.trim()){
      sessionStorage.setItem('bq',gs.value.trim());
      window.location.href='Browse-Projects.html';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById('pane-' + btn.dataset.tab).classList.add('active');
    });
  });
});

function acceptApp(id, name) {
  showConfirm({
    icon: '✅', iconBg: 'rgba(34,197,94,.12)',
    title: 'Accept Application?',
    subtitle: name,
    desc: name + ' will be added to the project team and notified of your decision.',
    confirmLabel: '✅ Accept',
    confirmColor: '#22c55e', confirmFg: '#fff',
    onConfirm: () => {
      const el = document.getElementById(id);
      if (!el) return;
      el.querySelector('.app-right').innerHTML = '<span class="status s-accepted">ACCEPTED ✓</span>';
      el.style.opacity = '.7';
      showToast('✓ ' + name + ' has been accepted!', 'ok');
    }
  });
}

function declineApp(id) {
  const el   = document.getElementById(id);
  const name = el?.querySelector('strong')?.textContent?.split(' wants')[0] || 'Applicant';
  showConfirm({
    icon: '✕', iconBg: 'rgba(239,68,68,.10)',
    title: 'Decline Application?',
    subtitle: name,
    desc: name + ' will be notified that their application was declined.',
    confirmLabel: '✕ Decline',
    confirmColor: '#ef4444', confirmFg: '#fff',
    onConfirm: () => {
      const item = document.getElementById(id);
      if (!item) return;
      item.querySelector('.app-right').innerHTML = '<span class="status s-rejected">DECLINED ✕</span>';
      item.style.opacity = '.6';
      showToast('Application declined.', '');
    }
  });
}

/* ════════════════ APPLICANT PROFILE MODAL ════════════════ */

const APPLICANTS = {
  'Ali Kaya': {
    initials: 'AK', color: '#6366f1',
    dept: 'Computer Engineering', year: '3rd Year', gpa: '3.2',
    skills: ['Arduino', 'MQTT', 'Raspberry Pi', 'Python', 'C++'],
    interests: 'IoT, Embedded Systems, Smart Cities',
    bio: 'Passionate about IoT and smart systems. Looking to contribute to real-world hardware projects.',
    github: 'github.com/alikaya',
    linkedin: 'linkedin.com/in/alikaya',
    projects: ['Smart Home Automation (COURSE)', 'Campus Sensor Network (TÜBİTAK)'],
    applying: 'IoT Hardware Developer',
    project: 'Smart Water IoT',
  },
  'Selin Öz': {
    initials: 'SÖ', color: '#f97316',
    dept: 'Computer Engineering', year: '4th Year', gpa: '3.7',
    skills: ['Python', 'Computer Vision', 'OpenCV', 'ROS2', 'C++'],
    interests: 'Computer Vision, Autonomous Systems, Robotics',
    bio: 'Final year student specializing in computer vision and autonomous systems. Competed in Teknofest 2024.',
    github: 'github.com/selinoz',
    linkedin: 'linkedin.com/in/selinoz',
    projects: ['Line Following Robot (TEKNOFEST)', 'Object Detection System (TÜBİTAK)'],
    applying: 'Computer Vision Developer',
    project: 'Autonomous Drone Navigation',
  }
};

function openApplicantProfile(name, itemId) {
  const a = APPLICANTS[name];
  if (!a) return;

  const skillChips = a.skills.map(s =>
    `<span class="apm-chip">${s}</span>`
  ).join('');

  const projectList = a.projects.map(p =>
    `<div class="apm-proj-item">📁 ${p}</div>`
  ).join('');

  const overlay = document.createElement('div');
  overlay.className = 'apm-overlay';
  overlay.id = 'apmOverlay';
  overlay.innerHTML = `
    <div class="apm-modal">

      <!-- Header -->
      <div class="apm-header">
        <button class="apm-close" id="apmClose">✕</button>
        <div class="apm-av" style="background:${a.color}">${a.initials}</div>
        <h2 class="apm-name">${name}</h2>
        <div class="apm-meta">${a.dept} · ${a.year}</div>
        <div class="apm-applying-badge">Applying for: <strong>${a.applying}</strong> → ${a.project}</div>
      </div>

      <!-- Body -->
      <div class="apm-body">

        <!-- Bio -->
        <div class="apm-bio">${a.bio}</div>

        <!-- Stats row -->
        <div class="apm-stats">
          <div class="apm-stat"><span class="apm-stat-n">${a.gpa}</span><span class="apm-stat-l">GPA</span></div>
          <div class="apm-stat"><span class="apm-stat-n">${a.skills.length}</span><span class="apm-stat-l">Skills</span></div>
          <div class="apm-stat"><span class="apm-stat-n">${a.projects.length}</span><span class="apm-stat-l">Projects</span></div>
        </div>

        <!-- Skills -->
        <div class="apm-sec-label">⚡ TECHNICAL SKILLS</div>
        <div class="apm-chips">${skillChips}</div>

        <!-- Interests -->
        <div class="apm-sec-label">💡 INTERESTS</div>
        <div class="apm-interests">${a.interests}</div>

        <!-- Previous Projects -->
        <div class="apm-sec-label">📁 PREVIOUS PROJECTS</div>
        <div class="apm-projects">${projectList}</div>

        <!-- Links -->
        <div class="apm-sec-label">🔗 LINKS</div>
        <div class="apm-links">
          <a class="apm-link" href="#">🐙 ${a.github}</a>
          <a class="apm-link" href="#">💼 ${a.linkedin}</a>
        </div>

      </div>

      <!-- Footer -->
      <div class="apm-foot">
        <button class="apm-accept" id="apmAccept">✓ Accept</button>
        <button class="apm-decline" id="apmDecline">✕ Decline</button>
        <button class="apm-close-btn" id="apmCloseBtn">Close</button>
      </div>

    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function closeModal() {
    overlay.remove();
    document.body.style.overflow = '';
  }

  document.getElementById('apmClose').addEventListener('click', closeModal);
  document.getElementById('apmCloseBtn').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', esc); }
  });

  // Accept from profile
  document.getElementById('apmAccept').addEventListener('click', () => {
    closeModal();
    acceptApp(itemId, name);
  });

  // Decline from profile
  document.getElementById('apmDecline').addEventListener('click', () => {
    closeModal();
    declineApp(itemId);
  });
}
/* ═══════════════════════════════════════════════════
   showConfirm(options) — Shared Confirm Popup
   options: {
     icon, iconBg, title, subtitle, desc,
     confirmLabel, confirmColor,
     cancelLabel, onConfirm
   }
═══════════════════════════════════════════════════ */
function showConfirm(opts) {
  document.getElementById('_confirmOv')?.remove();

  const ov = document.createElement('div');
  ov.id = '_confirmOv';
  ov.className = 'sc-overlay';

  const iconBg    = opts.iconBg    || 'rgba(0,184,184,.12)';
  const confirmBg = opts.confirmColor || '#00b8b8';
  const confirmFg = opts.confirmFg   || '#1a2540';

  ov.innerHTML = `
    <div class="sc-box">
      <div class="sc-icon-wrap" style="background:${iconBg}">
        <span class="sc-icon">${opts.icon || '❓'}</span>
      </div>
      <h3 class="sc-title">${opts.title}</h3>
      ${opts.subtitle ? `<div class="sc-subtitle">${opts.subtitle}</div>` : ''}
      ${opts.desc     ? `<p class="sc-desc">${opts.desc}</p>` : ''}
      <div class="sc-acts">
        <button class="sc-cancel" id="scCancel">${opts.cancelLabel || 'Cancel'}</button>
        <button class="sc-confirm" id="scConfirm"
          style="background:${confirmBg};color:${confirmFg}">
          <span id="scTxt">${opts.confirmLabel || 'Confirm'}</span>
          <span class="sc-spin" id="scSpin"></span>
        </button>
      </div>
    </div>`;

  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('visible'));

  const closeIt = () => {
    ov.classList.remove('visible');
    setTimeout(() => ov.remove(), 260);
  };

  document.getElementById('scCancel').onclick = closeIt;
  ov.addEventListener('click', e => { if (e.target === ov) closeIt(); });

  document.getElementById('scConfirm').onclick = () => {
    if (opts.loading !== false) {
      const btn = document.getElementById('scConfirm');
      btn.disabled = true;
      document.getElementById('scTxt').textContent = 'Please wait…';
      document.getElementById('scSpin').style.display = 'inline-block';
    }
    setTimeout(() => { closeIt(); if (opts.onConfirm) opts.onConfirm(); }, 900);
  };
}