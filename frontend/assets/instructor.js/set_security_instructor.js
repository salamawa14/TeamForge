function toast(msg) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, { position:'fixed', bottom:'22px', right:'22px', padding:'10px 18px', borderRadius:'8px', background:'#1a9e8f', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:'600', boxShadow:'0 4px 14px rgba(0,0,0,.15)', opacity:'0', transform:'translateY(10px)', transition:'all .25s', zIndex:'9999' });
  document.body.appendChild(t);
  
  requestAnimationFrame(function() { requestAnimationFrame(function() { t.style.opacity='1'; t.style.transform='translateY(0)'; }); });
  setTimeout(function() { t.style.opacity='0'; setTimeout(function() { t.remove(); }, 300); }, 2500);
}
// Password show/hide toggle
document.querySelectorAll('.eye-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var input = document.getElementById(btn.getAttribute('data-target'));
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

async function updatePassword() {
  var currInput = document.getElementById('current-pw');
  var newInput = document.getElementById('new-pw');
  var confirmInput = document.getElementById('confirm-pw');
  var btn = document.getElementById('btn-update-pw');

  var curr = currInput.value.trim();
  var nw = newInput.value;
  var conf = confirmInput.value;

  if (!curr || !nw || !conf) return showToast('Please fill in all fields', 'red');
  if (nw.length < 8) return showToast('New password must be at least 8 characters', 'red');
  if (nw !== conf) return showToast('Passwords do not match', 'red');
  if (curr === nw) return showToast('New password must be different from current password', 'red');

  btn.disabled = true;
  var originalText = btn.textContent;
  btn.textContent = 'Updating...';

  try {
    await Auth.changePassword(curr, nw);
    currInput.value = '';
    newInput.value = '';
    confirmInput.value = '';
    btn.textContent = '✓ Updated!';
    btn.style.background = '#16a34a';
    showToast('Password updated successfully');
  } catch (err) {
    showToast(err.message || 'Failed to update password', 'red');
  } finally {
    setTimeout(function() {
      btn.disabled = false;
      btn.textContent = originalText;
      btn.style.background = '';
    }, 1600);
  }
}

document.getElementById('btn-update-pw')?.addEventListener('click', function() {
  updatePassword();
});

// 2FA buttons
document.getElementById('btn-totp')?.addEventListener('click', function() {
  showToast('Authenticator App setup coming soon');
});
document.getElementById('btn-sms')?.addEventListener('click', function() {
  var btn = this;
  if (btn.textContent === 'Enable') {
    btn.textContent = 'Disable';
    btn.style.background = '#fee2e2';
    btn.style.color = '#ef4444';
    btn.style.borderColor = '#fecaca';
    showToast('SMS Verification enabled');
  } else {
    btn.textContent = 'Enable';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
    showToast('SMS Verification disabled', 'red');
  }
});

// Save Changes



document.getElementById("profileBtn")?.addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
const saveBtn = document.getElementById("btn-save");
const saveConfirmModal = document.getElementById("saveConfirmModal");
const cancelSaveBtn = document.getElementById("cancelSaveBtn");
const confirmSaveBtn = document.getElementById("confirmSaveBtn");

function openSaveModal() {
  saveConfirmModal?.classList.add("show");
}

function closeSaveModal() {
  saveConfirmModal?.classList.remove("show");
}

function saveChanges() {
  toast('Settings saved');
}

saveBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  openSaveModal();
});

cancelSaveBtn?.addEventListener("click", function () {
  closeSaveModal();
});

confirmSaveBtn?.addEventListener("click", function () {
  closeSaveModal();
  saveChanges();
});

// Optional: close when clicking outside the modal
saveConfirmModal?.addEventListener("click", function (e) {
  if (e.target === saveConfirmModal) {
    closeSaveModal();
  }
});
// Toast
function showToast(msg, color) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px',
    background: color === 'red' ? '#dc2626' : '#1a9e8f',
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

document.addEventListener('DOMContentLoaded', async function () {
  const user = await requireLogin(['instructor']);
  if (!user) return;

  const sidebarName = document.querySelector('.user-name');
  const sidebarSub = document.querySelector('.user-sub');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const fullName = user.full_name || 'Instructor';
  const department = user.department || 'Instructor';
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();

  if (sidebarName) sidebarName.textContent = fullName;
  if (sidebarSub) sidebarSub.textContent = department;
  if (sidebarAvatar) sidebarAvatar.textContent = initials || 'IN';
});
