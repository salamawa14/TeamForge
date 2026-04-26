document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['student']);
  if (!user) return;
  loadNotifications();

  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
  }

  const grid = document.getElementById('advGrid');
  let myProjects = [];

  async function loadMyProjects() {
    try {
      const data = await Student.myProjects();
      myProjects = data.owned || [];
    } catch(e) { myProjects = []; }
  }

  // ── Load & render advisor cards ───────────────────────────
  async function loadAdvisors(search = '') {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--t3)">Loading advisors…</div>`;
    try {
      const advisors = await Student.findAdvisors(search);
      window._advisorData = advisors;

      if (!advisors.length) {
        grid.innerHTML = `
          <div style="grid-column:1/-1;padding:60px;text-align:center;color:var(--t3)">
            <div style="font-size:2.5rem;margin-bottom:10px">🎓</div>
            <h3>No advisors found</h3>
            <p>Try a different search term.</p>
          </div>`;
        return;
      }

      const COLORS = ['#00b8b8','#6366f1','#f97316','#a855f7','#22c55e','#ef4444','#eab308'];

      grid.innerHTML = advisors.map((a, i) => {
        const color    = COLORS[i % COLORS.length];
        const initials = a.full_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
        const skills   = Array.isArray(a.areas_of_expertise)    ? a.areas_of_expertise    : [];
        const types    = Array.isArray(a.supervised_proj_types) ? a.supervised_proj_types : [];
        const isActive = a.advising_status === 'Active';
        const allTags  = [...skills, ...types].slice(0,5);

        return `
          <div class="adv-card au" data-advisor-id="${a.user_id}"
               style="cursor:pointer;transition:transform .15s,box-shadow .15s"
               onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,.25)'"
               onmouseleave="this.style.transform='';this.style.boxShadow=''">
            <div class="adv-top">
              <div class="adv-av" style="background:${color};font-size:1.1rem;font-weight:700">${initials}</div>
              <div>
                <div class="adv-name">${a.full_name}</div>
                <div class="adv-dept-txt">${a.department || 'Instructor'}</div>
                ${a.academic_title ? `<div style="font-size:.78rem;color:var(--t3)">🏛 ${a.academic_title}</div>` : ''}
              </div>
            </div>
            ${a.research_interests ? `<div style="font-size:.78rem;color:var(--t2);margin:8px 0;line-height:1.4">${a.research_interests.slice(0,90)}${a.research_interests.length>90?'…':''}</div>` : ''}
            <div class="adv-specs" style="margin-top:8px">
              ${allTags.map(t => `<span class="chip">${t}</span>`).join('') || '<span style="color:var(--t3);font-size:.75rem">No specializations listed</span>'}
            </div>
            <div class="adv-avail-row" style="margin-top:10px">
              <span class="avail ${isActive ? '' : 'busy'}">${isActive ? '● Available' : '● Unavailable'}</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button type="button" class="btn btn-outline btn-sm view-profile-btn" style="flex:1" data-id="${a.user_id}">
                👤 View Profile
              </button>
              ${isActive
                ? `<button type="button" class="btn btn-teal btn-sm send-req-btn" style="flex:1"
                     data-id="${a.user_id}" data-name="${a.full_name}">
                     📨 Request
                   </button>`
                : `<button type="button" class="btn btn-outline btn-sm" style="flex:1;opacity:.5;cursor:not-allowed" disabled>
                     Unavailable
                   </button>`
              }
            </div>
          </div>`;
      }).join('');

      // Clicking the card itself (not a button) opens profile
      grid.querySelectorAll('.adv-card').forEach(card => {
        card.addEventListener('click', e => {
          if (e.target.closest('button')) return; // let buttons handle themselves
          const adv = window._advisorData.find(a => a.user_id === card.dataset.advisorId);
          if (adv) openAdvisorProfile(adv);
        });
      });

      // View Profile button
      grid.querySelectorAll('.view-profile-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const adv = window._advisorData.find(a => a.user_id === btn.dataset.id);
          if (adv) openAdvisorProfile(adv);
        });
      });

      // Request button
      grid.querySelectorAll('.send-req-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          openRequestModal(btn.dataset.id, btn.dataset.name);
        });
      });

    } catch(err) {
      grid.innerHTML = `<div style="grid-column:1/-1;padding:20px;color:var(--red)">Error: ${err.message}</div>`;
    }
  }

  // ── Full Advisor Profile Modal ────────────────────────────
  function openAdvisorProfile(a) {
    // Remove any existing modal
    document.getElementById('_advProfileOv')?.remove();

    const COLORS = ['#00b8b8','#6366f1','#f97316','#a855f7','#22c55e','#ef4444','#eab308'];
    const color    = COLORS[Math.abs(a.full_name.charCodeAt(0)) % COLORS.length];
    const initials = a.full_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const skills   = Array.isArray(a.areas_of_expertise)    ? a.areas_of_expertise    : [];
    const types    = Array.isArray(a.supervised_proj_types) ? a.supervised_proj_types : [];
    const isActive = a.advising_status === 'Active';

    const ov = document.createElement('div');
    ov.id = '_advProfileOv';
    ov.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:rgba(0,0,0,.75)',
      'z-index:9999',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:20px',
      'pointer-events:all'
    ].join(';');

    ov.innerHTML = `
      <div id="_advModalBox" style="background:var(--navy,#1a2540);border-radius:16px;max-width:520px;width:100%;max-height:85vh;overflow-y:auto;padding:32px;position:relative;border:1px solid var(--border,#2a3a54)">
        <button type="button" id="_advClose" style="position:absolute;top:16px;right:16px;background:none;border:none;color:var(--t3);font-size:1.4rem;cursor:pointer;line-height:1;padding:4px 8px">✕</button>

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
          <div style="width:68px;height:68px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>
          <div>
            <h2 style="margin:0 0 3px;font-size:1.2rem;color:#fff">${a.full_name}</h2>
            <div style="color:var(--t3);font-size:.85rem">${a.department || 'Instructor'}</div>
            ${a.academic_title ? `<div style="color:var(--t2);font-size:.8rem;margin-top:2px">🏛 ${a.academic_title}</div>` : ''}
            <div style="margin-top:7px">
              <span style="background:${isActive?'rgba(34,197,94,.15)':'rgba(239,68,68,.15)'};color:${isActive?'#22c55e':'#ef4444'};padding:2px 12px;border-radius:20px;font-size:.75rem;font-weight:700">
                ${isActive ? '● Available' : '● Unavailable'}
              </span>
            </div>
          </div>
        </div>

        <!-- Research Interests -->
        ${a.research_interests ? `
          <div style="margin-bottom:16px">
            <div style="font-size:.78rem;font-weight:700;color:#00b8b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px">🔬 Research Interests</div>
            <p style="color:var(--t2,#8899aa);font-size:.88rem;line-height:1.65;margin:0">${a.research_interests}</p>
          </div>` : ''}

        <!-- Expertise -->
        ${skills.length ? `
          <div style="margin-bottom:16px">
            <div style="font-size:.78rem;font-weight:700;color:#00b8b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px">⚡ Areas of Expertise</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${skills.map(s => `<span style="background:rgba(99,102,241,.15);color:#818cf8;padding:3px 11px;border-radius:20px;font-size:.78rem">${s}</span>`).join('')}
            </div>
          </div>` : ''}

        <!-- Supervised Types -->
        ${types.length ? `
          <div style="margin-bottom:22px">
            <div style="font-size:.78rem;font-weight:700;color:#00b8b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px">📋 Supervises</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${types.map(t => {
                const tc = t.toLowerCase().includes('teknofest') ? '#f97316'
                         : t.toLowerCase().includes('tubitak')   ? '#6366f1'
                         : '#00b8b8';
                return `<span style="background:rgba(0,0,0,.25);color:${tc};padding:3px 11px;border-radius:20px;font-size:.78rem;border:1px solid ${tc}50">${t}</span>`;
              }).join('')}
            </div>
          </div>` : ''}

        <!-- Actions -->
        <div style="display:flex;gap:10px">
          ${isActive ? `
            <button type="button" id="_advSendReq"
              style="flex:1;padding:12px;background:#00b8b8;color:#0f1b2d;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.92rem">
              📨 Send Advisor Request
            </button>` : `
            <div style="flex:1;padding:12px;background:rgba(239,68,68,.1);color:#ef4444;border-radius:8px;font-size:.85rem;text-align:center">
              Not accepting requests
            </div>`}
          <button type="button" id="_advCloseBtn"
            style="padding:12px 22px;background:transparent;color:var(--t3);border:1px solid var(--border,#2a3a54);border-radius:8px;cursor:pointer;font-size:.92rem">
            Close
          </button>
        </div>
      </div>`;

    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';

    const close = () => { ov.remove(); document.body.style.overflow = ''; };

    // Close on backdrop click only
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    // Stop clicks inside modal box from reaching backdrop or page
    document.getElementById('_advModalBox').addEventListener('click', e => e.stopPropagation());
    document.getElementById('_advClose').addEventListener('click', close);
    document.getElementById('_advCloseBtn').addEventListener('click', close);

    document.getElementById('_advSendReq')?.addEventListener('click', () => {
      close();
      setTimeout(() => openRequestModal(a.user_id, a.full_name), 60);
    });
  }

  // ── Send Request Modal ──────────────────────────────────────
  function openRequestModal(advisorId, advisorName) {
    if (!myProjects.length) {
      showToast('You need to create a project first before requesting an advisor.', 'error');
      return;
    }

    const ov = document.createElement('div');
    ov.className = 'apc-overlay';
    ov.innerHTML = `
      <div class="apc-modal" style="border-top:4px solid #00b8b8">
        <div class="apc-icon-wrap" style="background:rgba(0,184,184,.1);color:#00b8b8">
          <span class="apc-icon">🎓</span>
        </div>
        <h3 class="apc-title">Request Advisor</h3>
        <p class="apc-project-name">${advisorName}</p>
        <p class="apc-desc">Select which of your projects you'd like this advisor for:</p>
        <select id="projectSelect" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--t1);margin-bottom:16px;font-size:.9rem">
          ${myProjects.map(p => `<option value="${p.project_id}">${p.title} (${p.project_type})</option>`).join('')}
        </select>
        <div class="apc-acts">
          <button type="button" class="apc-cancel" id="apcCancel">Cancel</button>
          <button type="button" class="apc-confirm" id="apcConfirm" style="background:#00b8b8;color:#0f1b2d">
            <span id="apcTxt">📨 Send Request</span>
          </button>
        </div>
      </div>`;

    document.body.appendChild(ov);
    setTimeout(() => ov.classList.add('visible'), 10);

    const close = () => { ov.classList.remove('visible'); setTimeout(() => ov.remove(), 250); };

    document.getElementById('apcCancel').addEventListener('click', e => { e.stopPropagation(); close(); });
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    ov.querySelector('.apc-modal').addEventListener('click', e => e.stopPropagation());

    document.getElementById('apcConfirm').addEventListener('click', async e => {
      e.stopPropagation();
      const btn = document.getElementById('apcConfirm');
      const txt = document.getElementById('apcTxt');
      const projectId = document.getElementById('projectSelect').value;
      btn.disabled = true; txt.textContent = 'Sending…';
      try {
        await Student.requestAdvisor(projectId, advisorId);
        showToast(`✓ Advisor request sent to ${advisorName}!`, 'ok');
        close();
      } catch(err) {
        btn.disabled = false; txt.textContent = '📨 Send Request';
        showToast(err.message, 'error');
      }
    });
  }

  function showToast(msg, type='') {
    let t = document.getElementById('_toast');
    if (!t) { t = document.createElement('div'); t.id='_toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast show'+(type?' '+type:'');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 3400);
  }

  // Search wiring
  const searchBtn = document.querySelector('.adv-search-row .btn');
  const searchInp = document.getElementById('advSearch');
  searchBtn?.addEventListener('click', e => { e.preventDefault(); loadAdvisors(searchInp?.value.trim()); });
  searchInp?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); loadAdvisors(searchInp.value.trim()); } });

  // Sidebar & logout
  const burg = document.getElementById('burg'), sb = document.getElementById('sb');
  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await Auth.logout();
    window.location.href = '../auth/login.html';
  });
  const nBtn = document.getElementById('nBtn'), nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => { e.stopPropagation(); nPanel?.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg) sb.classList.remove('open');
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('open');
  });

  await loadMyProjects();
  loadAdvisors();
});
