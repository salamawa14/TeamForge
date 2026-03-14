// Pause Account
document.getElementById('btn-pause').addEventListener('click', function() {
  var btn = this;
  var paused = btn.textContent === 'Resume Account';
  btn.textContent = paused ? 'Pause Account' : 'Resume Account';
  btn.style.background = paused ? '' : '#fff7ed';
  btn.style.color      = paused ? '' : '#f59e0b';
  btn.style.borderColor= paused ? '' : '#fed7aa';
  showToast(paused ? 'Account resumed — visible to students' : 'Account paused — hidden from searches', paused ? 'teal' : 'orange');
});

// Export Data
document.getElementById('btn-export').addEventListener('click', function() {
  var btn = this;
  btn.textContent = 'Preparing…';
  btn.disabled = true;
  setTimeout(function() {
    btn.textContent = '✓ Export Ready';
    showToast('Your data export is ready for download');
    setTimeout(function() { btn.textContent = 'Export Data'; btn.disabled = false; }, 3000);
  }, 1500);
});
document.getElementById("bellBtn").addEventListener("click", function () {
    window.location.href = "set_not_instructor.html";
});
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
// Delete Account
document.getElementById('btn-delete').addEventListener('click', function() {
  var confirmed = confirm('Are you absolutely sure?\n\nThis will permanently delete your account and all associated data. This action cannot be undone.');
  if (confirmed) showToast('Account deletion requested. You will receive a confirmation email.', 'red');
});

// Save Changes
document.getElementById('btn-save').addEventListener('click', function() {
  showToast('Settings saved');
});

// Toast
function showToast(msg, color) {
  var bg = color === 'red' ? '#dc2626' : color === 'orange' ? '#f59e0b' : '#1a9e8f';
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px', background: bg,
    color: '#fff', fontFamily: "'DM Sans',sans-serif",
    fontSize: '13px', fontWeight: '600',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)', maxWidth: '320px',
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
  }, 3000);
}
