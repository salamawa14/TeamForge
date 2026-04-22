document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['student']);
  if (!user) return;
loadNotifications();
  let profile = null;

  // ── Load profile ─────────────────────────────────────────────
  async function loadProfile() {
    try {
      profile = await Student.getProfile();
      renderProfile(profile);
    } catch(err) {
      showToast('Failed to load profile: ' + err.message, 'error');
    }
  }

  function renderProfile(p) {
    // Banner
    const parts = (p.full_name || '').trim().split(' ');
    const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
    document.getElementById('pbAv').textContent   = initials.toUpperCase();
    document.querySelector('.avatar').textContent = initials.toUpperCase();
    document.getElementById('pbName').textContent = p.full_name || '';
    document.getElementById('pbSub').textContent  =
      [p.department, p.academic_year ? p.academic_year + ' Year' : ''].filter(Boolean).join(' · ');

    const skills = Array.isArray(p.technical_skills) ? p.technical_skills : [];
    document.getElementById('pbChips').innerHTML =
      skills.map(s => `<span class="tag-dark">${s}</span>`).join('');

    const links = [];
    if (p.github_url)   links.push(`<a href="${p.github_url}"   class="pb-lnk" target="_blank">🔗 GitHub</a>`);
    if (p.linkedin_url) links.push(`<a href="${p.linkedin_url}" class="pb-lnk" target="_blank">💼 LinkedIn</a>`);
    document.getElementById('pbLinks').innerHTML = links.join('');

    // Personal Info fields
    const nameParts = (p.full_name || '').split(' ');
    document.getElementById('pfFirstName').value = nameParts[0] || '';
    document.getElementById('pfLastName').value  = nameParts.slice(1).join(' ') || '';
    document.getElementById('pfEmail').value     = p.email || '';
    document.getElementById('pfDept').value      = p.department || '';
    const yearSel = document.getElementById('pfYear');
    yearSel.value = p.academic_year || '';

    // Skills & Links fields
    document.getElementById('pfSkills').value   = skills.join(', ');
    document.getElementById('pfGithub').value   = p.github_url   || '';
    document.getElementById('pfLinkedin').value = p.linkedin_url || '';
    document.getElementById('pfBio').value      = p.bio          || '';
  }

  // ── Edit / Save — Personal Info ──────────────────────────────
  const infoFields = ['pfFirstName', 'pfLastName', 'pfDept'];
  document.getElementById('editInfoBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    infoFields.forEach(id => document.getElementById(id).removeAttribute('readonly'));
    document.getElementById('pfYear').removeAttribute('disabled');
    document.getElementById('editInfoBtn').style.display = 'none';
    document.getElementById('saveInfoBtn').style.display = '';
  });

  document.getElementById('saveInfoBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveInfoBtn');
    btn.textContent = 'Saving…'; btn.disabled = true;
    try {
      const full_name = (document.getElementById('pfFirstName').value.trim() + ' ' +
                         document.getElementById('pfLastName').value.trim()).trim();
      await Student.updateProfile({
        full_name,
        department:    document.getElementById('pfDept').value.trim(),
        academic_year: document.getElementById('pfYear').value || null,
        technical_skills: profile?.technical_skills || [],
        github_url:    profile?.github_url    || null,
        linkedin_url:  profile?.linkedin_url  || null,
        bio:           profile?.bio           || null,
      });
      await loadProfile();
      infoFields.forEach(id => document.getElementById(id).setAttribute('readonly', true));
      document.getElementById('pfYear').setAttribute('disabled', true);
      document.getElementById('editInfoBtn').style.display = '';
      document.getElementById('saveInfoBtn').style.display = 'none';
      showToast('✓ Profile updated!', 'ok');
    } catch(err) {
      showToast(err.message, 'error');
    } finally {
      btn.textContent = '💾 Save Changes'; btn.disabled = false;
    }
  });

  // ── Edit / Save — Skills & Links ─────────────────────────────
  const skillFields = ['pfSkills', 'pfGithub', 'pfLinkedin', 'pfBio'];
  document.getElementById('editSkillsBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    skillFields.forEach(id => document.getElementById(id).removeAttribute('readonly'));
    document.getElementById('editSkillsBtn').style.display = 'none';
    document.getElementById('saveSkillsBtn').style.display = '';
  });

  document.getElementById('saveSkillsBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveSkillsBtn');
    btn.textContent = 'Saving…'; btn.disabled = true;
    try {
      const skillsRaw = document.getElementById('pfSkills').value;
      const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
      await Student.updateProfile({
        full_name:        profile?.full_name   || user.full_name,
        department:       profile?.department  || '',
        academic_year:    profile?.academic_year || null,
        technical_skills: skills,
        github_url:       document.getElementById('pfGithub').value.trim()   || null,
        linkedin_url:     document.getElementById('pfLinkedin').value.trim() || null,
        bio:              document.getElementById('pfBio').value.trim()       || null,
      });
      await loadProfile();
      skillFields.forEach(id => document.getElementById(id).setAttribute('readonly', true));
      document.getElementById('editSkillsBtn').style.display = '';
      document.getElementById('saveSkillsBtn').style.display = 'none';
      showToast('✓ Skills & links updated!', 'ok');
    } catch(err) {
      showToast(err.message, 'error');
    } finally {
      btn.textContent = '💾 Save Changes'; btn.disabled = false;
    }
  });

  // ── Toast ─────────────────────────────────────────────────────
  function showToast(msg, type = '') {
    let t = document.getElementById('_toast');
    if (!t) { t = document.createElement('div'); t.id = '_toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 3400);
  }

  // ── Sidebar & notifications ───────────────────────────────────
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

  // ── Initial load ──────────────────────────────────────────────
  loadProfile();
});