/* ═══════════════════════════════════════════════════
   Student-My-Projects.js — Backend Connected
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['student']);
  if (!user) return;
  loadNotifications();

  // Avatar initials
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2);
  }

  // ── Load Projects ────────────────────────────────────────────
  async function loadMyProjects() {
    const paneOwned  = document.getElementById('pane-owner')?.querySelector('.proj-grid');
    const paneMember = document.getElementById('pane-member')?.querySelector('.proj-grid');
    if (!paneOwned || !paneMember) return;

    try {
      const data = await Student.myProjects();
      renderProjects(data.owned  || [], paneOwned,  true);
      renderProjects(data.joined || [], paneMember, false);

      // Update tab counts
      const ownerTab  = document.querySelector('[data-tab="owner"]');
      const memberTab = document.querySelector('[data-tab="member"]');
      if (ownerTab)  ownerTab.textContent  = `Owner ${(data.owned  || []).length}`;
      if (memberTab) memberTab.textContent = `Member ${(data.joined || []).length}`;

    } catch (err) {
      paneOwned.innerHTML  = `<div style="color:var(--red);grid-column:1/-1">Error: ${err.message}</div>`;
      paneMember.innerHTML = `<div style="color:var(--red);grid-column:1/-1">Error: ${err.message}</div>`;
    }
  }

  // ── Render Cards ─────────────────────────────────────────────
  function renderProjects(projects, container, isOwner) {
    if (!projects.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--t3)">
          <div style="font-size:2.5rem;margin-bottom:10px">📁</div>
          <h3>No projects found</h3>
          <p>${isOwner ? "You haven't created any projects yet." : "You haven't joined any teams yet."}</p>
        </div>`;
      return;
    }

    container.innerHTML = '';
    projects.forEach(p => {
      let badgeClass = 'b-course';
      if (p.project_type === 'Tubitak')   badgeClass = 'b-tubitak';
      if (p.project_type === 'Teknofest') badgeClass = 'b-teknofest';

      let skillsHtml = '';
      try {
        const skills = typeof p.required_skills === 'string'
          ? JSON.parse(p.required_skills) : (p.required_skills || []);
        skillsHtml = skills.map(s => `<span class="chip">${s}</span>`).join('');
      } catch(e) {}

      const current    = p.member_count || 1;
      const max        = p.team_size_needed || 1;
      const pct        = Math.min(100, Math.round((current / max) * 100));
      const spotsOpen  = max - current;

      const card = document.createElement('div');
      card.className = 'mp-card au';
      card.innerHTML = `
        <div class="mp-top">
          <span class="badge ${badgeClass}">${p.project_type}</span>
          ${spotsOpen > 0
            ? `<span class="spot-open">${spotsOpen} spots open</span>`
            : `<span style="color:var(--red);font-size:12px;font-weight:700">FULL</span>`}
        </div>
        <div class="mp-title">${p.title}</div>
        <div class="mp-desc">${p.description || 'No description provided.'}</div>
        <div class="mp-chips">${skillsHtml}</div>
        <div class="mp-row">
          <span>👥 ${current}/${max} members</span>
          <span class="mp-pct">${pct}%</span>
        </div>
        <div class="prog" style="margin-bottom:11px">
          <div class="prog-fill" style="width:${pct}%;background:${pct===100?'var(--red)':'var(--teal)'}"></div>
        </div>
        <div class="mp-acts" style="margin-top:auto;padding-top:15px">
          ${isOwner
            ? `<button class="btn-manage" data-id="${p.project_id}" style="width:100%;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--white);cursor:pointer">⚙ Manage Project</button>`
            : `<button class="btn-vd" style="width:100%;padding:8px;border-radius:6px;border:none;background:var(--bg);color:var(--t1);cursor:pointer">👁 View Details</button>`}
        </div>`;
      container.appendChild(card);
    });

    // Wire Manage buttons
    container.querySelectorAll('.btn-manage').forEach(btn => {
      btn.addEventListener('click', () => openManageModal(btn.dataset.id));
    });
  }

  // ── Manage Project Modal ─────────────────────────────────────
  async function openManageModal(projectId) {
    // Show loading overlay
    const ov = document.createElement('div');
    ov.id = 'mgOv';
    ov.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px`;
    ov.innerHTML = `<div style="background:var(--card);border-radius:14px;padding:30px;color:var(--t1);font-size:1rem">Loading…</div>`;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';

    try {
      // Load project details + incoming requests in parallel
      const [project, requests] = await Promise.all([
        Projects.get(projectId),
        Student.incomingRequests(),
      ]);

      const pendingReqs = (requests || []).filter(r =>
        r.project_id === projectId && r.status === 'Pending'
      );

      renderManageModal(ov, project, pendingReqs);
    } catch (err) {
      ov.innerHTML = `
        <div style="background:var(--card);border-radius:14px;padding:30px;max-width:400px;text-align:center">
          <div style="color:var(--red);margin-bottom:16px">Failed to load project: ${err.message}</div>
          <button onclick="document.getElementById('mgOv').remove();document.body.style.overflow=''"
            style="padding:8px 20px;border-radius:8px;border:1px solid var(--border);cursor:pointer;background:var(--bg);color:var(--t1)">Close</button>
        </div>`;
    }
  }

  function renderManageModal(ov, project, pendingReqs) {
    const skills = Array.isArray(project.required_skills) ? project.required_skills : [];
    const members = project.members || [];

    ov.innerHTML = `
      <div id="mgPanel" style="
        background:var(--card,#1a2540);
        border-radius:16px;
        width:100%;
        max-width:680px;
        max-height:90vh;
        overflow-y:auto;
        padding:28px;
        position:relative;
        color:var(--t1,#fff);
        box-shadow:0 20px 60px rgba(0,0,0,.5)">

        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div>
            <div style="font-size:1.4rem;font-weight:700">${project.title}</div>
            <div style="color:var(--t3,#888);font-size:.85rem;margin-top:4px">${project.project_type}</div>
          </div>
          <button id="mgClose" style="background:none;border:none;color:var(--t3);font-size:1.4rem;cursor:pointer;padding:4px 8px;border-radius:6px">✕</button>
        </div>

        <!-- Tabs -->
        <div style="display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--border,#2a3a5c);padding-bottom:12px">
          <button class="mg-tab active" data-pane="edit"     style="padding:7px 16px;border-radius:8px;border:none;cursor:pointer;font-size:.85rem;font-weight:600;background:var(--teal,#00b8b8);color:#fff">✏️ Edit</button>
          <button class="mg-tab"        data-pane="members"  style="padding:7px 16px;border-radius:8px;border:none;cursor:pointer;font-size:.85rem;font-weight:600;background:var(--bg2,#0f1b2d);color:var(--t1)">👥 Members (${members.length})</button>
          <button class="mg-tab"        data-pane="requests" style="padding:7px 16px;border-radius:8px;border:none;cursor:pointer;font-size:.85rem;font-weight:600;background:var(--bg2,#0f1b2d);color:var(--t1)">📨 Requests ${pendingReqs.length > 0 ? `<span style="background:var(--red);color:#fff;border-radius:10px;padding:1px 6px;font-size:.75rem">${pendingReqs.length}</span>` : ''}</button>
          <button class="mg-tab"        data-pane="danger"   style="padding:7px 16px;border-radius:8px;border:none;cursor:pointer;font-size:.85rem;font-weight:600;background:var(--bg2,#0f1b2d);color:var(--red,#ef4444)">🗑 Delete</button>
        </div>

        <!-- EDIT PANE -->
        <div id="mg-pane-edit">
          <div style="margin-bottom:14px">
            <label style="display:block;font-size:.8rem;color:var(--t3);margin-bottom:6px">Project Title</label>
            <input id="mg-title" value="${project.title}" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border,#2a3a5c);background:var(--bg,#0f1b2d);color:var(--t1);font-size:.95rem;box-sizing:border-box"/>
          </div>
          <div style="margin-bottom:14px">
            <label style="display:block;font-size:.8rem;color:var(--t3);margin-bottom:6px">Description</label>
            <textarea id="mg-desc" rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border,#2a3a5c);background:var(--bg,#0f1b2d);color:var(--t1);font-size:.9rem;resize:vertical;box-sizing:border-box">${project.description || ''}</textarea>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
            <div>
              <label style="display:block;font-size:.8rem;color:var(--t3);margin-bottom:6px">Team Size</label>
              <input id="mg-size" type="number" min="1" max="10" value="${project.team_size_needed}" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border,#2a3a5c);background:var(--bg,#0f1b2d);color:var(--t1);font-size:.95rem;box-sizing:border-box"/>
            </div>
            <div>
              <label style="display:block;font-size:.8rem;color:var(--t3);margin-bottom:6px">Status</label>
              <select id="mg-status" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border,#2a3a5c);background:var(--bg,#0f1b2d);color:var(--t1);font-size:.95rem;box-sizing:border-box">
                <option value="Active"   ${project.status==='Active'   ? 'selected' : ''}>Active</option>
                <option value="Inactive" ${project.status==='Inactive' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-size:.8rem;color:var(--t3);margin-bottom:6px">Required Skills (press Enter or comma to add)</label>
            <div id="mg-skills-wrap" style="display:flex;flex-wrap:wrap;gap:6px;padding:8px;border-radius:8px;border:1px solid var(--border,#2a3a5c);background:var(--bg,#0f1b2d);min-height:44px;align-items:center;cursor:text">
              ${skills.map(s => `<span class="mg-skill-chip" data-val="${s}" style="background:var(--teal-10,rgba(0,184,184,.15));color:var(--teal,#00b8b8);padding:3px 10px;border-radius:20px;font-size:.8rem;display:flex;align-items:center;gap:6px">${s}<button type="button" style="background:none;border:none;cursor:pointer;color:var(--teal);font-size:.9rem;padding:0;line-height:1" onclick="this.parentElement.remove()">✕</button></span>`).join('')}
              <input id="mg-skill-inp" placeholder="add skill…" style="border:none;background:none;outline:none;color:var(--t1);font-size:.85rem;min-width:100px;flex:1"/>
            </div>
          </div>
          <button id="mg-save" style="width:100%;padding:11px;border-radius:8px;border:none;background:var(--teal,#00b8b8);color:#1a2540;font-weight:700;font-size:.95rem;cursor:pointer">Save Changes</button>
        </div>

        <!-- MEMBERS PANE -->
        <div id="mg-pane-members" style="display:none">
          ${members.length === 0
            ? `<div style="text-align:center;padding:40px;color:var(--t3)">No members yet.</div>`
            : members.map(m => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;background:var(--bg,#0f1b2d);margin-bottom:8px">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--teal,#00b8b8);display:flex;align-items:center;justify-content:center;font-weight:700;color:#1a2540;flex-shrink:0">
                  ${m.full_name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div style="flex:1">
                  <div style="font-weight:600">${m.full_name} ${m.is_leader ? '<span style="font-size:.7rem;background:var(--teal);color:#1a2540;padding:2px 7px;border-radius:10px;margin-left:6px">Leader</span>' : ''}</div>
                  <div style="font-size:.8rem;color:var(--t3)">${m.department || ''} ${m.role ? '· ' + m.role : ''}</div>
                </div>
                ${!m.is_leader
                  ? `<button class="mg-kick" data-uid="${m.user_id}" data-name="${m.full_name}"
                       style="padding:6px 12px;border-radius:6px;border:1px solid var(--red,#ef4444);background:none;color:var(--red);font-size:.8rem;cursor:pointer">Remove</button>`
                  : ''}
              </div>`).join('')}
        </div>

        <!-- REQUESTS PANE -->
        <div id="mg-pane-requests" style="display:none">
          ${pendingReqs.length === 0
            ? `<div style="text-align:center;padding:40px;color:var(--t3)">No pending applications.</div>`
            : pendingReqs.map(r => `
              <div id="req-${r.request_id}" style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;background:var(--bg,#0f1b2d);margin-bottom:8px">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--indigo,#6366f1);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;flex-shrink:0">
                  ${(r.applicant_name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div style="flex:1">
                  <div style="font-weight:600">${r.applicant_name}</div>
                  <div style="font-size:.8rem;color:var(--t3)">${r.department || ''} · ${new Date(r.requested_at).toLocaleDateString()}</div>
                </div>
                <div style="display:flex;gap:8px">
                  <button class="mg-accept" data-id="${r.request_id}" data-name="${r.applicant_name}"
                    style="padding:6px 12px;border-radius:6px;border:none;background:var(--teal,#00b8b8);color:#1a2540;font-weight:700;font-size:.8rem;cursor:pointer">✓ Accept</button>
                  <button class="mg-reject" data-id="${r.request_id}"
                    style="padding:6px 12px;border-radius:6px;border:1px solid var(--red);background:none;color:var(--red);font-size:.8rem;cursor:pointer">✕ Reject</button>
                </div>
              </div>`).join('')}
        </div>

        <!-- DANGER PANE -->
        <div id="mg-pane-danger" style="display:none;text-align:center;padding:20px">
          <div style="font-size:3rem;margin-bottom:12px">⚠️</div>
          <div style="font-size:1.1rem;font-weight:700;margin-bottom:8px">Delete "${project.title}"?</div>
          <div style="color:var(--t3);font-size:.9rem;margin-bottom:24px">This will permanently delete the project, all memberships, and all requests. This cannot be undone.</div>
          <button id="mg-delete" style="padding:11px 32px;border-radius:8px;border:none;background:var(--red,#ef4444);color:#fff;font-weight:700;font-size:.95rem;cursor:pointer">🗑 Yes, Delete Project</button>
        </div>

        <!-- Toast -->
        <div id="mgToast" style="display:none;position:sticky;bottom:0;left:0;right:0;padding:10px 16px;border-radius:8px;font-size:.9rem;font-weight:600;text-align:center;margin-top:16px"></div>
      </div>`;

    const close = () => {
      ov.remove();
      document.body.style.overflow = '';
      loadMyProjects(); // refresh cards
    };

    const mgToast = (msg, ok = true) => {
      const t = document.getElementById('mgToast');
      t.textContent = msg;
      t.style.display = 'block';
      t.style.background = ok ? 'var(--teal,#00b8b8)' : 'var(--red,#ef4444)';
      t.style.color = ok ? '#1a2540' : '#fff';
      setTimeout(() => { t.style.display = 'none'; }, 3000);
    };

    // Close
    document.getElementById('mgClose').onclick = close;
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    // Tab switching
    document.querySelectorAll('.mg-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mg-tab').forEach(b => {
          b.style.background = 'var(--bg2,#0f1b2d)';
          b.style.color = b.dataset.pane === 'danger' ? 'var(--red)' : 'var(--t1)';
        });
        btn.style.background = btn.dataset.pane === 'danger' ? 'var(--red)' : 'var(--teal,#00b8b8)';
        btn.style.color = '#fff';
        ['edit','members','requests','danger'].forEach(p => {
          const el = document.getElementById(`mg-pane-${p}`);
          if (el) el.style.display = p === btn.dataset.pane ? 'block' : 'none';
        });
      });
    });

    // Skill chip input
    const skillInp = document.getElementById('mg-skill-inp');
    const skillWrap = document.getElementById('mg-skills-wrap');

    function addSkillChip(val) {
      val = val.trim().replace(/,/g, '');
      if (!val) return;
      const chip = document.createElement('span');
      chip.className = 'mg-skill-chip';
      chip.dataset.val = val;
      chip.style.cssText = 'background:var(--teal-10,rgba(0,184,184,.15));color:var(--teal,#00b8b8);padding:3px 10px;border-radius:20px;font-size:.8rem;display:flex;align-items:center;gap:6px';
      chip.innerHTML = `${val}<button type="button" style="background:none;border:none;cursor:pointer;color:var(--teal);font-size:.9rem;padding:0;line-height:1">✕</button>`;
      chip.querySelector('button').addEventListener('click', () => chip.remove());
      skillWrap.insertBefore(chip, skillInp);
    }

    skillInp.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addSkillChip(skillInp.value);
        skillInp.value = '';
      }
      if (e.key === 'Backspace' && !skillInp.value) {
        const chips = skillWrap.querySelectorAll('.mg-skill-chip');
        if (chips.length) chips[chips.length - 1].remove();
      }
    });

    skillWrap.addEventListener('click', () => skillInp.focus());

    // Save changes
    document.getElementById('mg-save').addEventListener('click', async () => {
      const btn = document.getElementById('mg-save');
      btn.disabled = true;
      btn.textContent = 'Saving…';

      const updatedSkills = [...skillWrap.querySelectorAll('.mg-skill-chip')].map(c => c.dataset.val);

      try {
        await Projects.update(project.project_id, {
          title:            document.getElementById('mg-title').value.trim(),
          description:      document.getElementById('mg-desc').value.trim(),
          team_size_needed: parseInt(document.getElementById('mg-size').value),
          status:           document.getElementById('mg-status').value,
          required_skills:  updatedSkills,
          roles_needed:     project.roles_needed || [],
          advisor_required: project.advisor_required || 0,
        });
        mgToast('✓ Project updated successfully!');
      } catch (err) {
        mgToast(err.message, false);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save Changes';
      }
    });

    // Remove member
    document.querySelectorAll('.mg-kick').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm(`Remove ${btn.dataset.name} from this project?`)) return;
        btn.disabled = true;
        try {
          // Call the remove member endpoint
          await apiRequest(
            `/students/applications.php?remove_member=1&project_id=${project.project_id}&student_id=${btn.dataset.uid}`,
            'DELETE'
          );
          btn.closest('div[style*="display:flex"]').remove();
          mgToast(`✓ ${btn.dataset.name} removed.`);
        } catch (err) {
          mgToast(err.message, false);
          btn.disabled = false;
        }
      });
    });

    // Accept request
    document.querySelectorAll('.mg-accept').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await Student.reviewRequest(btn.dataset.id, 'accept');
          const row = document.getElementById(`req-${btn.dataset.id}`);
          if (row) row.innerHTML = `<div style="padding:12px;color:var(--teal);font-weight:600">✓ ${btn.dataset.name} accepted — added to team!</div>`;
          mgToast(`✓ ${btn.dataset.name} accepted!`);
        } catch (err) {
          mgToast(err.message, false);
          btn.disabled = false;
        }
      });
    });

    // Reject request
    document.querySelectorAll('.mg-reject').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await Student.reviewRequest(btn.dataset.id, 'reject');
          const row = document.getElementById(`req-${btn.dataset.id}`);
          if (row) row.innerHTML = `<div style="padding:12px;color:var(--t3)">✕ Application rejected.</div>`;
          mgToast('Application rejected.');
        } catch (err) {
          mgToast(err.message, false);
          btn.disabled = false;
        }
      });
    });

    // Delete project
    document.getElementById('mg-delete').addEventListener('click', async () => {
      const btn = document.getElementById('mg-delete');
      btn.disabled = true;
      btn.textContent = 'Deleting…';
      try {
        await Projects.delete(project.project_id);
        close();
        showToast('Project deleted.', 'ok');
      } catch (err) {
        mgToast(err.message, false);
        btn.disabled = false;
        btn.textContent = '🗑 Yes, Delete Project';
      }
    });
  }

  // ── Toast (shared) ───────────────────────────────────────────
  function showToast(msg, type = '') {
    let t = document.getElementById('_toast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 3400);
  }

  // ── Initial load ─────────────────────────────────────────────
  loadMyProjects();

  // ── Tab switching ─────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pane-' + btn.dataset.tab)?.classList.add('active');
    });
  });

  // ── Sidebar & Logout ─────────────────────────────────────────
  const sb   = document.getElementById('sb');
  const burg = document.getElementById('burg');
  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg)
      sb.classList.remove('open');
  });

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await Auth.logout();
    window.location.href = '../auth/login.html';
  });

  const nBtn   = document.getElementById('nBtn');
  const nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => { e.stopPropagation(); nPanel?.classList.toggle('show'); });
  document.addEventListener('click', e => {
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('show');
  });
});