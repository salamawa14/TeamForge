// Highlight active nav on click
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    item.classList.add('active');
  });
});

// Card click — simple highlight feedback
document.querySelectorAll('.advisee-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var name = card.querySelector('.advisee-name').textContent;
    showToast('Viewing ' + name + "'s profile");
  });
});
document.getElementById("bellBtn").addEventListener("click", function () {
    window.location.href = "set_not_instructor.html";
});
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
document.getElementById("bellBtn").addEventListener("click", function () {
    window.location.href = "set_not_instructor.html";
});
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
// Toast
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
