// Tab switching
document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
    tab.classList.add('active');
    document.getElementById('tab-' + tab.getAttribute('data-tab')).classList.add('active');
  });
});

// Accept / Reject
document.querySelectorAll('.btn-accept, .btn-reject').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var id = btn.getAttribute('data-id');
    var card = document.getElementById(id);
    var isAccept = btn.classList.contains('btn-accept');

    card.style.opacity   = '0';
    card.style.transform = 'translateX(' + (isAccept ? '20px' : '-20px') + ')';

    setTimeout(function() {
      card.remove();
      updateCount(isAccept ? 'accepted' : 'rejected');
      showToast(isAccept ? '✓ Request accepted' : '✗ Request rejected', isAccept);
    }, 300);
  });
});
document.getElementById("bellBtn").addEventListener("click", function () {
    window.location.href = "set_not_instructor.html";
});
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
// Update tab counts
var counts = { pending: 3, accepted: 4, rejected: 1 };

function updateCount(moved) {
  counts.pending = Math.max(0, counts.pending - 1);
  counts[moved]++;
  var labels = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected' };
  document.querySelectorAll('.tab').forEach(function(tab) {
    var key = tab.getAttribute('data-tab');
    tab.textContent = labels[key] + ' (' + counts[key] + ')';
  });
  var badge = document.querySelector('.nav-badge');
  if (badge) { badge.textContent = counts.pending; if (counts.pending === 0) badge.style.display = 'none'; }
}

// Toast
function showToast(msg, success) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px',
    background: success ? '#16a34a' : '#dc2626',
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
