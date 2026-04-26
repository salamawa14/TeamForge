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
  // ---> ADD LOGOUT HERE <---
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {  
      await Auth.logout();  
      window.location.href = '../auth/login.html';
  });
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
document.addEventListener('DOMContentLoaded', async () => {

  const user = await requireLogin(['student']);
  if (!user) return;
loadNotifications();

  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
  }

  /* ── Char counter ── */

  /* ── Char counter ── */
  const descTA = document.getElementById('cpDesc');
  const charCt = document.getElementById('charCount');
  descTA?.addEventListener('input', () => {
    const len = descTA.value.length;
    charCt.textContent = len + ' / 800';
    charCt.style.color = len > 750 ? 'var(--red)' : 'var(--t3)';
  });

  /* ── Project Type → show/hide advisor & budget sections ── */
  const cpType        = document.getElementById('cpType');
  const advisorSec    = document.getElementById('advisorSection');
  const advisorWrap   = document.getElementById('advisorWrap');
  const budgetSection = document.getElementById('budgetSection');
  const budgetWrap    = document.getElementById('budgetWrap');
  const advisorToggle = document.getElementById('advisorToggle');

  function handleTypeChange() {
    const t = cpType.value;
    // Budget: only for TÜBİTAK
    const showBudget = t === 'TÜBİTAK';
    budgetSection.style.display = showBudget ? '' : 'none';
    budgetWrap.style.display    = showBudget ? '' : 'none';
    // Advisor: hidden for COURSE, forced ON for TÜBİTAK/TEKNOFEST
    if (t === 'COURSE') {
      advisorSec.style.display  = 'none';
      advisorWrap.style.display = 'none';
      advisorToggle.checked     = false;
    } else {
      advisorSec.style.display  = '';
      advisorWrap.style.display = '';
      advisorToggle.checked     = true;
    }
  }
  cpType?.addEventListener('change', handleTypeChange);
  // init state
  budgetSection.style.display = 'none';
  budgetWrap.style.display    = 'none';

  /* ── Active/Inactive toggle hint ── */
  const activeToggle = document.getElementById('activeToggle');
  const statusHint   = document.getElementById('statusHint');
  activeToggle?.addEventListener('change', () => {
    const on = activeToggle.checked;
    statusHint.innerHTML = on
      ? '<span class="hint-dot active"></span> Project will be <strong>visible</strong> to all students after publishing'
      : '<span class="hint-dot inactive"></span> Project will be <strong>hidden</strong> from student listings';
  });

  /* ── Skills chip input ── */
  const skillInp  = document.getElementById('skillInp');
  const skillWrap = document.getElementById('skillsWrap');

  function addSkillChip(val) {
    val = val.replace(/,/g, '').trim();
    if (!val) return;
    // avoid duplicates
    const existing = [...skillWrap.querySelectorAll('.s-chip')].map(c => c.dataset.val);
    if (existing.includes(val.toLowerCase())) return;
    const chip = document.createElement('span');
    chip.className = 's-chip';
    chip.dataset.val = val.toLowerCase();
    chip.innerHTML = `${val} <button type="button">✕</button>`;
    chip.querySelector('button').addEventListener('click', e => {
      e.stopPropagation();
      chip.remove();
    });
    skillWrap.insertBefore(chip, skillInp);
    skillWrap.classList.remove('err');
    document.getElementById('cpSkillsErr').textContent = '';
  }

  skillInp?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkillChip(skillInp.value);
      skillInp.value = '';
    }
    if (e.key === 'Backspace' && !skillInp.value) {
      const chips = skillWrap.querySelectorAll('.s-chip');
      if (chips.length) chips[chips.length - 1].remove();
    }
  });
  skillInp?.addEventListener('blur', () => {
    if (skillInp.value.trim()) { addSkillChip(skillInp.value); skillInp.value = ''; }
  });

  /* ── Roles tagger ── */
  const roleInput = document.getElementById('roleInput');
  const addRoleBtn = document.getElementById('addRoleBtn');
  const rolesList  = document.getElementById('rolesList');

  function addRole() {
    const v = roleInput?.value.trim();
    if (!v) return;
    const tag = document.createElement('span');
    tag.className = 'role-tag';
    tag.innerHTML = `${v} <button type="button">✕</button>`;
    tag.querySelector('button').addEventListener('click', () => tag.remove());
    rolesList?.appendChild(tag);
    roleInput.value = '';
  }
  addRoleBtn?.addEventListener('click', addRole);
  roleInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addRole(); } });

  /* ── Visibility skill chips ── */
  const visSkillInp  = document.getElementById('visSkillInp');
  const visSkillWrap = document.getElementById('visSkillsWrap');

  function addVisChip(val) {
    val = val.replace(/,/g, '').trim();
    if (!val) return;
    const existing = [...visSkillWrap.querySelectorAll('.s-chip')].map(c => c.dataset.val);
    if (existing.includes(val.toLowerCase())) return;
    const chip = document.createElement('span');
    chip.className = 's-chip';
    chip.dataset.val = val.toLowerCase();
    chip.innerHTML = `${val} <button type="button">✕</button>`;
    chip.querySelector('button').addEventListener('click', e => {
      e.stopPropagation(); chip.remove(); updateVisPreview();
    });
    visSkillWrap.insertBefore(chip, visSkillInp);
    updateVisPreview();
  }

  visSkillInp?.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && visSkillInp.value.trim()) {
      e.preventDefault(); addVisChip(visSkillInp.value); visSkillInp.value = '';
    }
    if (e.key === 'Backspace' && !visSkillInp.value) {
      const chips = visSkillWrap.querySelectorAll('.s-chip');
      if (chips.length) { chips[chips.length - 1].remove(); updateVisPreview(); }
    }
  });
  visSkillInp?.addEventListener('blur', () => {
    if (visSkillInp.value.trim()) { addVisChip(visSkillInp.value); visSkillInp.value = ''; }
  });

  /* ── Visibility preview updater ── */
  function updateVisPreview() {
    const years   = [...document.querySelectorAll('#visYears input:checked')].map(c => c.value);
    const depts   = [...document.querySelectorAll('#visDepts input:checked')].map(c => c.value);
    const skills  = [...document.querySelectorAll('#visSkillsWrap .s-chip')].map(c => c.dataset.val);
    const allYears = document.querySelectorAll('#visYears input').length;
    const txt = document.getElementById('visPreviewTxt');
    if (!txt) return;

    let parts = [];
    if (years.length < allYears) parts.push(`${years.length} year(s)`);
    if (depts.length > 0)        parts.push(`${depts.length} dept(s)`);
    if (skills.length > 0)       parts.push(`"${skills.slice(0,2).join(', ')}" skills`);

    txt.innerHTML = parts.length === 0
      ? 'Visible to <strong>all students</strong>'
      : `Visible to students matching: <strong>${parts.join(' · ')}</strong>`;
  }

  // Attach to all checkboxes
  document.querySelectorAll('#visYears input, #visDepts input').forEach(cb => {
    cb.addEventListener('change', updateVisPreview);
  });

  /* ── Publish with validation ── */
  document.getElementById('publishBtn')?.addEventListener('click', () => {
    let ok = true;

    // text/select fields
    [
      ['cpTitle', 'cpTitleErr', 'Project title is required.'],
      ['cpType',  'cpTypeErr',  'Please select a project type.'],
      ['cpSize',  'cpSizeErr',  'Team size is required.'],
      ['cpDesc',  'cpDescErr',  'Description is required.'],
    ].forEach(([id, eid, msg]) => {
      const el  = document.getElementById(id);
      const err = document.getElementById(eid);
      const empty = !el.value.trim();
      if (err) err.textContent = empty ? msg : '';
      el.classList.toggle('err', empty);
      if (empty) ok = false;
    });

    // skills chips validation
    const chips = skillWrap.querySelectorAll('.s-chip');
    if (chips.length === 0) {
      skillWrap.classList.add('err');
      document.getElementById('cpSkillsErr').textContent = 'At least one skill is required.';
      ok = false;
    }

    if (!ok) return;

    // Collect visibility filters
    const visYears  = [...document.querySelectorAll('#visYears input:checked')].map(c => c.value);
    const visDepts  = [...document.querySelectorAll('#visDepts input:checked')].map(c => c.value);
    const visSkills = [...document.querySelectorAll('#visSkillsWrap .s-chip')].map(c => c.dataset.val);

    const projectTitle = document.getElementById('cpTitle').value.trim();
    const projectType  = document.getElementById('cpType').value;

    const typeColor = { 'TEKNOFEST':'#f97316','TÜBİTAK':'#6366f1','COURSE':'#00b8b8' };
    const typeIconBg = { 'TEKNOFEST':'rgba(249,115,22,.12)','TÜBİTAK':'rgba(99,102,241,.12)','COURSE':'rgba(0,184,184,.12)' };

    showConfirm({
      icon: '🚀',
      iconBg: typeIconBg[projectType] || 'rgba(0,184,184,.12)',
      title: 'Publish Project?',
      subtitle: projectTitle,
      desc: 'Your project will be visible to all eligible students and they can start applying to join your team.',
      confirmLabel: '🚀 Publish Now',
      confirmColor: typeColor[projectType] || '#00b8b8',
      confirmFg: projectType === 'TÜBİTAK' ? '#fff' : '#1a2540',
      onConfirm: async () => {
        const btn = document.getElementById('publishBtn');
        btn.disabled = true;
        document.getElementById('pubTxt').textContent = 'Publishing…';
        document.getElementById('pubSpin').style.display = 'inline-block';

        try {
          // Collect all form data
          const skills = [...document.querySelectorAll('#skillsWrap .s-chip')]
            .map(c => c.dataset.val);
          const roles = [...document.querySelectorAll('#rolesList .role-tag')]
            .map(t => t.textContent.replace('✕','').trim());
          const visYears  = [...document.querySelectorAll('#visYears input:checked')].map(c => c.value);
          const visDepts  = [...document.querySelectorAll('#visDepts input:checked')].map(c => c.value);
          const visSkills = [...document.querySelectorAll('#visSkillsWrap .s-chip')].map(c => c.dataset.val);

          await Projects.create({
            title:            document.getElementById('cpTitle').value.trim(),
            project_type:     document.getElementById('cpType').value,
            team_size_needed: parseInt(document.getElementById('cpSize').value),
            description:      document.getElementById('cpDesc').value.trim(),
            required_skills:  skills,
            roles_needed:     roles,
            advisor_required: document.getElementById('advisorToggle').checked ? 1 : 0,
            status:           document.getElementById('activeToggle').checked ? 'Active' : 'Inactive',
            visibility_filters: { academic_year: visYears, departments: visDepts, skills: visSkills },
          });

          showToast('🚀 Project published successfully!', 'ok');
          setTimeout(() => window.location.href = 'My-Projects.html', 1200);

        } catch (err) {
          btn.disabled = false;
          document.getElementById('pubTxt').textContent = '🚀 Publish Project';
          document.getElementById('pubSpin').style.display = 'none';
          showToast(err.message || 'Failed to publish. Try again.', 'error');
        }
      }
    });
  });
});
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