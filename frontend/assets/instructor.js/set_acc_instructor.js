/* ══════════════════════════════════════════
   INSTRUCTOR SETTINGS — Account
   ══════════════════════════════════════════ */

let currentProfile = null;

async function loadAccountData() {
  try {
    console.log("Fetching instructor profile...");
    currentProfile = await Instructor.getProfile();
    console.log("Profile data received:", currentProfile);
    updateUI();
  } catch (err) {
    console.error("Failed to load profile:", err);
    showToast('Error loading account data: ' + err.message, 'red');
  }
}

function updateUI() {
  if (!currentProfile) return;
  const p = currentProfile;

  const fullName = p.full_name || 'Instructor';
  const department = p.department || 'Department not set';
  
  // 1. Update Sidebar & Header (using specific IDs)
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  
  const sidebarName = document.getElementById('sidebar-name');
  const sidebarSub = document.getElementById('sidebar-dept');
  const sidebarAvatar = document.getElementById('sidebar-avatar');

  if (sidebarName) sidebarName.textContent = fullName;
  if (sidebarSub) sidebarSub.textContent = department;
  if (sidebarAvatar) sidebarAvatar.textContent = initials || 'IN';

  // 2. Update Form Fields
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const fields = {
    'first-name': firstName,
    'last-name': lastName,
    'academic-title': p.academic_title || '',
    'department': department,
    'email': p.email || '',
    'expertise': (p.areas_of_expertise || []).join(', '),
    'research': p.research_interests || '',
    'bio': p.bio || ''
  };

  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = fields[id];
      el.placeholder = ""; // Clear the "Loading..." placeholder
    }
  });

  // 3. Update Profile Card in Content
  const contentAvatar = document.getElementById('profile-avatar-initials');
  const contentName = document.getElementById('profile-display-name');
  if (contentAvatar) contentAvatar.textContent = initials || 'IN';
  if (contentName) contentName.textContent = fullName;
}

async function saveAccountChanges() {
  try {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    
    const data = {
      full_name: `${firstName} ${lastName}`.trim(),
      academic_title: document.getElementById('academic-title').value.trim(),
      department: document.getElementById('department').value.trim(),
      areas_of_expertise: document.getElementById('expertise').value.split(',').map(s => s.trim()).filter(s => s),
      research_interests: document.getElementById('research').value.trim(),
      bio: document.getElementById('bio').value.trim()
    };

    await Instructor.updateProfile(data);
    showToast('Account settings saved successfully! ✅');
    await loadAccountData(); // Refresh everything
  } catch (err) {
    showToast('Error saving: ' + err.message, 'red');
  }
}

function showToast(msg, color = 'green') {
  const t = document.createElement('div');
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
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
  });
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

// Modal logic
const saveBtn = document.getElementById("btn-save");
const saveConfirmModal = document.getElementById("saveConfirmModal");
const cancelSaveBtn = document.getElementById("cancelSaveBtn");
const confirmSaveBtn = document.getElementById("confirmSaveBtn");

function openSaveModal() { saveConfirmModal?.classList.add("show"); }
function closeSaveModal() { saveConfirmModal?.classList.remove("show"); }

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Settings page initializing...");
  
  // Guard and pre-fill sidebar from session
  const user = await requireLogin(['instructor']);
  if (user) {
    console.log("User authenticated:", user.email);
    
    // Quick pre-fill of sidebar so it doesn't show "Loading..." for long
    const initials = (user.full_name || 'IN').split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
    if (document.getElementById('sidebar-name')) document.getElementById('sidebar-name').textContent = user.full_name || 'Instructor';
    if (document.getElementById('sidebar-dept')) document.getElementById('sidebar-dept').textContent = user.department || 'Instructor';
    if (document.getElementById('sidebar-avatar')) document.getElementById('sidebar-avatar').textContent = initials;

    await loadAccountData();
  }

  // Event Listeners
  saveBtn?.addEventListener("click", (e) => { e.preventDefault(); openSaveModal(); });
  cancelSaveBtn?.addEventListener("click", closeSaveModal);
  confirmSaveBtn?.addEventListener("click", async () => {
    closeSaveModal();
    await saveAccountChanges();
  });

  // Navigation
  document.getElementById("profileBtn")?.addEventListener("click", () => window.location.href = "profile_instructor.html");
  
  document.querySelectorAll('.snav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.id;
      if (panelId === 'accBtn') window.location.href = 'set_acc_instructor.html';
      if (panelId === 'notBtn') window.location.href = 'set_not_instructor.html';
      if (panelId === 'availBtn') window.location.href = 'set_avail_instructor.html';
      if (panelId === 'privacyBtn') window.location.href = 'set_privacy_instructor.html';
      if (panelId === 'secBtn') window.location.href = 'set_security_instructor.html';
    });
  });
});
