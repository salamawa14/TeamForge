// Settings nav panel switching
document.querySelectorAll('.snav-item').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.snav-item').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var panel = document.getElementById('panel-' + btn.getAttribute('data-panel'));
    if (panel) panel.classList.add('active');
  });
});

// Availability toggles
document.querySelectorAll('.toggle-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var group = btn.getAttribute('data-group');
    document.querySelectorAll('[data-group="' + group + '"]').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
  });
});

document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});

document.getElementById("notBtn").addEventListener("click", function () {
    window.location.href = "set_not_instructor.html";
});
document.getElementById("accBtn").addEventListener("click", function () {
    window.location.href = "set_acc_instructor.html";
});
document.getElementById("availBtn").addEventListener("click", function () {
    window.location.href = "set_avail_instructor.html";
});
document.getElementById("privacyBtn").addEventListener("click", function () {
    window.location.href = "set_privacy_instructor.html";
});
document.getElementById("secBtn").addEventListener("click", function () {
    window.location.href = "set_security_instructor.html";
});
document.getElementById("zoneBtn").addEventListener("click", function () {
    window.location.href = "set_zone_instructor.html";
});
// Save Changes
document.getElementById('btn-save').addEventListener('click', function() {
  var btn = this;
  btn.textContent = '✓ Saved!';
  btn.style.background = '#16a34a';
  setTimeout(function() { btn.textContent = '💾 Save Changes'; btn.style.background = ''; }, 2000);
  showToast('Settings saved successfully');
});

// Danger zone
var dangerBtn = document.querySelector('.btn-danger');
if (dangerBtn) {
  dangerBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      showToast('Account deletion requested', 'red');
    }
  });
}

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
