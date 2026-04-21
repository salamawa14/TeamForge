/* ══════════════════════════════════════════
   INSTRUCTOR PROFILE — Connected to Backend
   ══════════════════════════════════════════ */

/* ── Data ── */
let currentProfile = null;

/* ── Fetch Profile ── */
async function loadProfile() {
  try {
    currentProfile = await Instructor.getProfile();
    updateUI();
  } catch (err) {
    showToast('Error loading profile: ' + err.message, 'red');
  }
}

function updateUI() {
  if (!currentProfile) return;

  const p = currentProfile;
  const initials = p.full_name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  
  // Update Form
  document.getElementById('full-name').value = p.full_name;
  document.getElementById('department').value = p.department || '';
  document.getElementById('academic-title').value = p.academic_title || '';
  document.getElementById('expertise').value = (p.areas_of_expertise || []).join(', ');
  document.getElementById('research').value = p.research_interests || '';
  document.getElementById('supervised').value = (p.supervised_proj_types || []).join(', ');

  // Update Profile Card
  const profileAvatar = document.getElementById('profile-avatar');
  if (profileAvatar) profileAvatar.textContent = initials || 'IN';
  document.querySelector('.profile-name').textContent = p.full_name;
  document.querySelector('.profile-role').textContent = `${p.academic_title || ''} · ${p.department || ''}`;
  
  const skillTags = document.querySelector('.skill-tags');
  if (skillTags) {
    skillTags.innerHTML = (p.areas_of_expertise || []).map(s => `<span class="skill-tag">${s}</span>`).join('');
  }

  const sidebarName = document.querySelector('.user-name');
  if (sidebarName) sidebarName.textContent = p.full_name;
  const sidebarSub = document.querySelector('.user-sub');
  if (sidebarSub) sidebarSub.textContent = p.department || 'Instructor';
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  if (sidebarAvatar) sidebarAvatar.textContent = initials || 'IN';
}

/* ── Save Profile ── */
async function saveProfile() {
  const btn = document.getElementById('btn-save');
  const originalText = btn.textContent;
  
  const data = {
    full_name: document.getElementById('full-name').value.trim(),
    department: document.getElementById('department').value.trim(),
    academic_title: document.getElementById('academic-title').value.trim(),
    areas_of_expertise: document.getElementById('expertise').value.split(',').map(s => s.trim()).filter(s => s),
    research_interests: document.getElementById('research').value.trim(),
    supervised_proj_types: document.getElementById('supervised').value.split(',').map(s => s.trim()).filter(s => s),
  };

  try {
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    await Instructor.updateProfile(data);
    
    btn.textContent = '✓ Saved!';
    btn.style.background = '#16a34a';
    showToast('Profile updated successfully! ✅', 'green');
    
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = originalText;
      btn.style.background = '';
      loadProfile(); // Refresh
    }, 2000);
  } catch (err) {
    btn.disabled = false;
    btn.textContent = originalText;
    showToast('Error saving: ' + err.message, 'red');
  }
}

// Live update name on card
document.getElementById('full-name').addEventListener('input', function() {
  const cardName = document.querySelector('.profile-name');
  if (cardName) cardName.textContent = this.value;
  const initials = this.value.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const profileAvatar = document.getElementById('profile-avatar');
  if (profileAvatar) profileAvatar.textContent = initials || 'IN';
});

// Save Changes listener
document.getElementById('btn-save').addEventListener('click', saveProfile);

document.getElementById("profileBtn")?.addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});

function showToast(msg, color = 'green') {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px',
    background: color === 'green' ? '#1a9e8f' : '#dc2626',
    color: '#fff', fontFamily: "'DM Sans',sans-serif",
    fontSize: '13px', fontWeight: '600',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    opacity: '0', transform: 'translateY(10px)',
    transition: 'all 0.25s', zIndex: '9999'
  });
  document.body.appendChild(t);
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
  });
  setTimeout(function() {
    t.style.opacity = '0';
    setTimeout(function() { t.remove(); }, 300);
  }, 2500);
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['instructor']);
  if (user) {
    const sidebarName = document.querySelector('.user-name');
    const sidebarSub = document.querySelector('.user-sub');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    if (sidebarName) sidebarName.textContent = user.full_name;
    if (sidebarSub) sidebarSub.textContent = user.department || 'Instructor';
    if (sidebarAvatar) {
      sidebarAvatar.textContent = user.full_name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'IN';
    }
    loadProfile();
  }
});
