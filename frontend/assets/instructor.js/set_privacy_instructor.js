document.getElementById('btn-save').addEventListener('click', function() {
  var btn = this;
  btn.textContent = '✓ Saved!';
  btn.style.background = '#16a34a';
  setTimeout(function() { btn.textContent = '💾 Save Changes'; btn.style.background = ''; }, 2000);
  showToast('Privacy settings saved');
});

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
