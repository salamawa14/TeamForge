// Password show/hide toggle
document.querySelectorAll('.eye-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var input = document.getElementById(btn.getAttribute('data-target'));
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// Update Password
document.getElementById('btn-update-pw').addEventListener('click', function() {
  var curr = document.getElementById('current-pw').value;
  var nw   = document.getElementById('new-pw').value;
  var conf = document.getElementById('confirm-pw').value;

  if (!curr || !nw || !conf) return showToast('Please fill in all fields', 'red');
  if (nw.length < 8)          return showToast('New password must be at least 8 characters', 'red');
  if (nw !== conf)             return showToast('Passwords do not match', 'red');

  var btn = this;
  btn.textContent = '✓ Updated!';
  btn.style.background = '#16a34a';
  setTimeout(function() { btn.textContent = 'Update Password'; btn.style.background = ''; }, 2000);
  showToast('Password updated successfully');
});

// 2FA buttons
document.getElementById('btn-totp').addEventListener('click', function() {
  showToast('Authenticator App setup coming soon');
});
document.getElementById('btn-sms').addEventListener('click', function() {
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
document.getElementById('btn-save').addEventListener('click', function() {
  var btn = this;
  btn.textContent = '✓ Saved!';
  btn.style.background = '#16a34a';
  setTimeout(function() { btn.textContent = '💾 Save Changes'; btn.style.background = ''; }, 2000);
  showToast('Security settings saved');
});


document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
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
