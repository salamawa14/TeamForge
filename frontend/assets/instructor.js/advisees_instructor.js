var activeCard = null;
var panel      = document.getElementById('detail-panel');
var grid       = document.getElementById('cards-grid');

// ── OPEN PANEL ──────────────────────────────────────────
function openPanel(card) {
  var d = card.dataset;

  document.getElementById('panel-av').textContent      = d.av;
  document.getElementById('panel-av').style.background = d.color;
  document.getElementById('panel-name').textContent    = d.name;
  document.getElementById('panel-year').textContent    = d.year;
  document.getElementById('panel-dept').textContent    = '📍 ' + d.dept + '  ⭐ GPA ' + d.gpa;
  document.getElementById('panel-bio').textContent     = d.bio;
  document.getElementById('panel-proj-num').textContent = d.projects;
  document.getElementById('panel-gpa').textContent     = d.gpa;
  document.getElementById('panel-seeking').textContent = d.seeking;

  // Skills
  var sk = document.getElementById('panel-skills');
  sk.innerHTML = '';
  d.skills.split(',').forEach(function(s) {
    var el = document.createElement('span');
    el.textContent = s.trim();
    sk.appendChild(el);
  });

  // Interests
  var inf = document.getElementById('panel-interests');
  inf.innerHTML = '';
  d.interests.split(',').forEach(function(s) {
    var el = document.createElement('span');
    el.textContent = s.trim();
    inf.appendChild(el);
  });

  // Project
  var isTek = d.projTag === 'TEKNOFEST';
  document.getElementById('panel-proj-box').innerHTML =
    '<div class="panel-proj-entry">' +
      '<span class="proj-tag ' + (isTek ? 'tek' : 'tub') + '">' + d.projTag + '</span>' +
      '<div class="proj-name">' + d.projName + '</div>' +
    '</div>';

  // Active card style
  if (activeCard) activeCard.classList.remove('active');
  card.classList.add('active');
  activeCard = card;

  // Open panel + shrink grid
  panel.classList.add('open');
  grid.classList.add('shrink');
}

// ── CLOSE PANEL ─────────────────────────────────────────
function closePanel() {
  panel.classList.remove('open');
  grid.classList.remove('shrink');
  if (activeCard) { activeCard.classList.remove('active'); activeCard = null; }
}
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
// ── CARD CLICKS ─────────────────────────────────────────
document.querySelectorAll('.advisee-card').forEach(function(card) {
  card.addEventListener('click', function() {
    if (activeCard === card) {
      closePanel();
    } else {
      openPanel(card);
    }
  });
});

// ── CLOSE BUTTON ────────────────────────────────────────
document.getElementById('panel-close').addEventListener('click', closePanel);

// ── VIEW FULL PROFILE ───────────────────────────────────
document.getElementById('btn-full-profile').addEventListener('click', function() {
  window.location.href = 'profile_instructor.html';
});

// ── TOPBAR BUTTONS ──────────────────────────────────────




// ── NAV HIGHLIGHT ───────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    item.classList.add('active');
  });
});
