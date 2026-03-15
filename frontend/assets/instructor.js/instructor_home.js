// Tabs
document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    tab.classList.add('active');
    document.getElementById('tab-' + tab.getAttribute('data-tab')).classList.add('active');
  });
});

// Accept / Reject
document.querySelectorAll('.acc, .rej').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = document.getElementById(btn.getAttribute('data-id'));
    var ok = btn.classList.contains('acc');
    item.style.opacity = '0'; item.style.transform = 'translateX(' + (ok ? '20px' : '-20px') + ')';
    setTimeout(function() { item.remove(); toast(ok ? '✓ Request accepted' : '✗ Request rejected', ok); }, 300);
  });
});
document.getElementById("bellBtn").addEventListener("click", function () {
    window.location.href = "set_not_instructor.html";
});
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
document.getElementById("adviseeBtn").addEventListener("click", function () {
    window.location.href = "advisees_instructor.html";
});
document.getElementById("editProfBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
const buttons = document.querySelectorAll(".btn-primary");

buttons.forEach(btn => {
    btn.addEventListener("click", function(){
        window.location.href ="advisor_req_insrtoctor.html";
    });
});
// Availability toggle
document.querySelectorAll('.avail-tag').forEach(function(tag) {
  tag.addEventListener('click', function() {
    if (tag.classList.contains('on')) { tag.classList.replace('on','off'); tag.textContent = '✗ Unavailable'; }
    else { tag.classList.replace('off','on'); tag.textContent = '✓ Available'; }
  });
});

// Toast
function toast(msg, ok) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, { position:'fixed', bottom:'22px', right:'22px', padding:'10px 18px', borderRadius:'8px', background: ok === false ? '#dc2626' : '#1a9e8f', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:'600', boxShadow:'0 4px 14px rgba(0,0,0,.15)', opacity:'0', transform:'translateY(10px)', transition:'all .25s', zIndex:'9999' });
  document.body.appendChild(t);
  requestAnimationFrame(function() { requestAnimationFrame(function() { t.style.opacity='1'; t.style.transform='translateY(0)'; }); });
  setTimeout(function() { t.style.opacity='0'; setTimeout(function() { t.remove(); }, 300); }, 2500);
}
