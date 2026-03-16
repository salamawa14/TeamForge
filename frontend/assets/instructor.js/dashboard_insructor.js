// Accept / Reject requests
document.querySelectorAll('.btn-accept, .btn-reject').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var id   = btn.getAttribute('data-id');
    var item = document.getElementById(id);
    var isAccept = btn.classList.contains('btn-accept');

    item.style.opacity   = '0';
    item.style.transform = 'translateX(' + (isAccept ? '20px' : '-20px') + ')';

    setTimeout(function() {
      item.remove();
      showToast(isAccept ? '✓ Request accepted' : '✗ Request rejected', isAccept ? 'green' : 'red');
    }, 300);
  });
});

document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});


// Availability toggle
document.querySelectorAll('.toggle-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var group = btn.getAttribute('data-group');
    document.querySelectorAll('[data-group="' + group + '"]').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
  });
});

// View Requests button scrolls to requests card
document.getElementById('btn-view').addEventListener('click', function() {
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
});

// Toast
function showToast(msg, color) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px',
    background: color === 'green' ? '#16a34a' : '#dc2626',
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
  }, 2800);
}
