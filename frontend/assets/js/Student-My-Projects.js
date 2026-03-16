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

/* ════════════════ MANAGE PROJECT PANEL ════════════════ */

const MANAGE_DATA = {
  1: {
    title:       'Autonomous Drone Navigation',
    type:        'TEKNOFEST',
    typeClass:   'b-teknofest',
    desc:        'Full autonomous drone for Teknofest 2026 UAV category — ROS2, sensor fusion, obstacle avoidance.',
    skills:      ['C++', 'ROS2', 'Python', 'Computer Vision', 'Sensor Fusion'],
    roles:       ['Computer Vision Developer', 'ROS2 Engineer'],
    size:        6,
    deadline:    '2026-04-15',
    budget:      '',
    active:      true,
    advisorNeeded: true,
    advisor:     'Prof. Ömer Şahin',
    requests: [
      { id: 'r1', name: 'Ali Kaya',  initials: 'AK', color: '#6366f1', role: 'Computer Vision Developer', year: '3rd Year', dept: 'Computer Eng.', skills: ['Python', 'OpenCV', 'C++'], time: '2 days ago' },
      { id: 'r2', name: 'Mert Koç', initials: 'MK', color: '#22c55e', role: 'ROS2 Engineer',              year: '4th Year', dept: 'Computer Eng.', skills: ['ROS2', 'C++', 'Linux'], time: '5 days ago' },
    ]
  },
  2: {
    title:       'Smart Water IoT',
    type:        'TÜBİTAK',
    typeClass:   'b-tubitak',
    desc:        'IoT sensor network for real-time water usage monitoring and leak detection on campus.',
    skills:      ['Arduino', 'MQTT', 'Raspberry Pi', 'Python', 'InfluxDB'],
    roles:       ['IoT Hardware Developer', 'Cloud Backend Dev'],
    size:        3,
    deadline:    '2026-04-15',
    budget:      '₺9,000',
    active:      true,
    advisorNeeded: true,
    advisor:     null,
    requests: [
      { id: 'r3', name: 'Selin Öz', initials: 'SÖ', color: '#f97316', role: 'IoT Hardware Developer', year: '2nd Year', dept: 'Electrical Eng.', skills: ['Arduino', 'MQTT', 'Python'], time: '1 day ago' },
    ]
  }
};

function openManagePanel(projectId) {
  const p = MANAGE_DATA[projectId];
  if (!p) return;

  const typeColor = { 'TEKNOFEST': '#f97316', 'TÜBİTAK': '#6366f1', 'COURSE': '#00b8b8' };
  const typeBg    = { 'TEKNOFEST': 'rgba(249,115,22,.10)', 'TÜBİTAK': 'rgba(99,102,241,.10)', 'COURSE': 'rgba(0,184,184,.10)' };

  const skillChips = p.skills.map(s =>
    `<span class="mg-chip" data-skill="${s}">${s} <button type="button" onclick="this.parentElement.remove()">✕</button></span>`
  ).join('');

  const roleItems = p.roles.map((r, i) =>
    `<div class="mg-role-item" id="role_${i}">
      <span>${r}</span>
      <button type="button" onclick="this.closest('.mg-role-item').remove()">✕</button>
    </div>`
  ).join('');

  const requestItems = p.requests.length === 0
    ? `<div class="mg-empty">No pending join requests.</div>`
    : p.requests.map(r => `
        <div class="mg-req-item" id="mgreq_${r.id}">
          <div class="mg-req-av" style="background:${r.color}">${r.initials}</div>
          <div class="mg-req-body">
            <strong>${r.name}</strong>
            <span>${r.role} · ${r.dept} · ${r.year}</span>
            <div class="mg-req-skills">${r.skills.map(s => `<span class="mg-req-chip">${s}</span>`).join('')}</div>
            <span class="mg-req-time">📅 ${r.time}</span>
          </div>
          <div class="mg-req-acts">
            <button class="mg-acc" onclick="mgAccept('mgreq_${r.id}','${r.name}')">✓</button>
            <button class="mg-dec" onclick="mgDecline('mgreq_${r.id}')">✕</button>
          </div>
        </div>`
      ).join('');

  const overlay = document.createElement('div');
  overlay.className = 'mg-overlay';
  overlay.id = 'mgOverlay';
  overlay.innerHTML = `
    <div class="mg-panel">

      <!-- Header -->
      <div class="mg-header">
        <div class="mg-header-l">
          <span class="mg-type-badge" style="background:${typeBg[p.type]};color:${typeColor[p.type]}">${p.type}</span>
          <h2 class="mg-title">${p.title}</h2>
        </div>
        <button class="mg-close" id="mgClose">✕</button>
      </div>

      <!-- Scrollable body -->
      <div class="mg-body">

        <!-- ── Section: Edit Details ── -->
        <div class="mg-sec-label">✏️ EDIT PROJECT DETAILS</div>

        <div class="mg-fg">
          <label>Project Title</label>
          <input type="text" id="mgTitle" value="${p.title}"/>
        </div>

        <div class="mg-fg">
          <label>Description</label>
          <textarea id="mgDesc" rows="3">${p.desc}</textarea>
        </div>

        <div class="mg-row2">
          <div class="mg-fg">
            <label>Max Team Size</label>
            <input type="number" id="mgSize" value="${p.size}" min="2" max="20"/>
          </div>
          <div class="mg-fg">
            <label>Deadline</label>
            <input type="date" id="mgDeadline" value="${p.deadline}"/>
          </div>
        </div>

        ${p.budget !== undefined ? `
        <div class="mg-fg">
          <label>Budget</label>
          <input type="text" id="mgBudget" value="${p.budget}" placeholder="e.g. ₺9,000"/>
        </div>` : ''}

        <!-- Skills -->
        <div class="mg-fg">
          <label>Required Skills</label>
          <div class="mg-chips-wrap" id="mgSkillsWrap" onclick="document.getElementById('mgSkillInp').focus()">
            ${skillChips}
            <input class="mg-chip-inp" id="mgSkillInp" type="text" placeholder="+ Add skill"/>
          </div>
        </div>

        <!-- Roles -->
        <div class="mg-fg">
          <label>Roles Needed</label>
          <div class="mg-roles-list" id="mgRolesList">${roleItems}</div>
          <div class="mg-add-role-row">
            <input type="text" id="mgRoleInp" placeholder="e.g. Backend Developer"/>
            <button type="button" id="mgAddRole">+ Add</button>
          </div>
        </div>

        <!-- ── Section: Status ── -->
        <div class="mg-sec-label" style="margin-top:20px">🔘 PROJECT STATUS</div>

        <div class="mg-toggle-row">
          <div class="mg-toggle-l">
            <b>Active</b>
            <span>Active projects are visible to students. Inactive projects are hidden.</span>
          </div>
          <label class="mg-sw">
            <input type="checkbox" id="mgActive" ${p.active ? 'checked' : ''}/>
            <div class="mg-sw-track"></div>
            <div class="mg-sw-thumb"></div>
          </label>
        </div>
        <div class="mg-status-hint" id="mgStatusHint">
          <span class="mg-dot ${p.active ? 'on' : 'off'}"></span>
          <span id="mgStatusTxt">Project is currently <strong>${p.active ? 'visible' : 'hidden'}</strong></span>
        </div>

        ${p.advisorNeeded ? `
        <div class="mg-toggle-row" style="margin-top:10px">
          <div class="mg-toggle-l">
            <b>Advisor Needed</b>
            <span>${p.advisor ? `Assigned: ${p.advisor}` : 'Currently seeking an advisor'}</span>
          </div>
          <label class="mg-sw">
            <input type="checkbox" id="mgAdvisor" checked/>
            <div class="mg-sw-track"></div>
            <div class="mg-sw-thumb"></div>
          </label>
        </div>` : ''}

        <!-- ── Section: Join Requests ── -->
        <div class="mg-sec-label" style="margin-top:20px">
          📨 JOIN REQUESTS
          <span class="mg-req-count">${p.requests.length}</span>
        </div>
        <div id="mgRequestsList">${requestItems}</div>

      </div>

      <!-- Footer -->
      <div class="mg-footer">
        <button class="mg-save" id="mgSave">💾 Save Changes</button>
        <button class="mg-cancel" id="mgCancel">Cancel</button>
      </div>

    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  /* ── Close ── */
  function closePanel() {
    overlay.remove();
    document.body.style.overflow = '';
  }
  document.getElementById('mgClose').addEventListener('click', closePanel);
  document.getElementById('mgCancel').addEventListener('click', closePanel);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePanel(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closePanel(); document.removeEventListener('keydown', esc); }
  });

  /* ── Skills chips ── */
  const mgSkillInp  = document.getElementById('mgSkillInp');
  const mgSkillWrap = document.getElementById('mgSkillsWrap');
  function addMgChip(val) {
    val = val.replace(/,/g, '').trim();
    if (!val) return;
    const chip = document.createElement('span');
    chip.className = 'mg-chip';
    chip.innerHTML = `${val} <button type="button" onclick="this.parentElement.remove()">✕</button>`;
    mgSkillWrap.insertBefore(chip, mgSkillInp);
  }
  mgSkillInp?.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && mgSkillInp.value.trim()) {
      e.preventDefault(); addMgChip(mgSkillInp.value); mgSkillInp.value = '';
    }
    if (e.key === 'Backspace' && !mgSkillInp.value) {
      const chips = mgSkillWrap.querySelectorAll('.mg-chip');
      if (chips.length) chips[chips.length - 1].remove();
    }
  });

  /* ── Roles ── */
  const mgRoleInp = document.getElementById('mgRoleInp');
  document.getElementById('mgAddRole')?.addEventListener('click', () => {
    const v = mgRoleInp.value.trim();
    if (!v) return;
    const idx = Date.now();
    const item = document.createElement('div');
    item.className = 'mg-role-item';
    item.innerHTML = `<span>${v}</span><button type="button" onclick="this.closest('.mg-role-item').remove()">✕</button>`;
    document.getElementById('mgRolesList')?.appendChild(item);
    mgRoleInp.value = '';
  });
  mgRoleInp?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('mgAddRole')?.click(); }
  });

  /* ── Active toggle hint ── */
  document.getElementById('mgActive')?.addEventListener('change', function() {
    const on = this.checked;
    document.getElementById('mgStatusTxt').innerHTML = `Project is currently <strong>${on ? 'visible' : 'hidden'}</strong>`;
    const dot = document.querySelector('.mg-dot');
    if (dot) { dot.className = 'mg-dot ' + (on ? 'on' : 'off'); }
  });

  /* ── Save ── */
  document.getElementById('mgSave')?.addEventListener('click', () => {
    const saveBtn = document.getElementById('mgSave');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    setTimeout(() => {
      closePanel();
      showToast('✓ Project updated successfully!', 'ok');
    }, 1000);
  });
}

/* ── Accept / Decline from manage panel ── */
function mgAccept(itemId, name) {
  const el = document.getElementById(itemId);
  if (!el) return;
  el.style.background = 'rgba(34,197,94,.06)';
  el.style.borderColor = 'rgba(34,197,94,.25)';
  el.querySelector('.mg-req-acts').innerHTML = '<span style="font-size:.75rem;font-weight:700;color:var(--green)">✓ Accepted</span>';
  showToast(`✓ ${name} accepted!`, 'ok');
}

function mgDecline(itemId) {
  const el = document.getElementById(itemId);
  if (el) { el.style.opacity = '.4'; el.style.pointerEvents = 'none'; }
  showToast('Request declined.', '');
}