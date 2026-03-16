// Live update profile card from form inputs
var fields = {
  'full-name':      '.profile-name',
  'department':     null,
  'academic-title': null,
  'expertise':      null,
};

document.getElementById('full-name').addEventListener('input', function() {
  document.querySelector('.profile-name').textContent = this.value;
});

// Toggle availability badges
document.querySelectorAll('.avail-badge').forEach(function(badge) {
  badge.addEventListener('click', function() {
    var isTubitak = badge.classList.contains('tubitak');
    var label     = isTubitak ? 'TÜBİTAK' : 'TEKNOFEST';

    if (badge.textContent.includes('AVAILABLE')) {
      badge.textContent = label + ': UNAVAILABLE';
      badge.style.background = '#6b7280';
    } else {
      badge.textContent = label + ': AVAILABLE';
      badge.style.background = isTubitak ? '#1a9e8f' : '#f59e0b';
    }
  });
});


// Save Changes
document.getElementById('btn-save').addEventListener('click', function() {
  var btn = this;
  btn.textContent = '✓ Saved!';
  btn.style.background = '#16a34a';
  setTimeout(function() {
    btn.textContent = 'Save Changes';
    btn.style.background = '';
  }, 2000);
  showToast('Profile saved successfully');
});

// Toast

document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
function showToast(msg) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px',
    background: '#1a9e8f', color: '#fff',
    fontFamily: "'DM Sans',sans-serif", fontSize: '13px', fontWeight: '600',
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
