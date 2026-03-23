/* ══════════════════════════════════════════
   PROJECT CATEGORIES — fully self-contained script
   ══════════════════════════════════════════ */

/* ── Data ── */
let cats = [
  { id:1, name:'Course Project',           size:'5–8', budget:'N/A',     adv:'No',  projects:22, locked:true,  enabled:true, desc:'Standard course capstone project.' },
  { id:2, name:'TÜBİTAK Student Project',  size:'1–4', budget:'₺9,000', adv:'Yes', projects:11, locked:true,  enabled:true, desc:'Undergraduate research funded by TÜBİTAK 2209-A/B.' },
  { id:3, name:'Teknofest Student Project', size:'2–6', budget:'Varies', adv:'Yes', projects:5,  locked:true,  enabled:true, desc:'Competition-based innovation projects.' },
];

let notifications = [
  { id:1, unread:true,  ico:'👤', bg:'rgba(0,168,181,.1)',  msg:'New user registered: Nisan Ay (Student)',             time:'2 min ago'   },
  { id:2, unread:true,  ico:'⚠️', bg:'rgba(231,76,60,.1)',  msg:'User "beza@uni.edu" deactivated',                     time:'1 hour ago'  },
  { id:3, unread:true,  ico:'📢', bg:'rgba(243,156,18,.1)', msg:'Announcement published: TÜBİTAK Applications Open',   time:'3 hours ago' },
  { id:4, unread:false, ico:'🎓', bg:'rgba(108,99,255,.1)', msg:'Dr. Selin Arslan reached full advisor quota',         time:'Yesterday'   },
  { id:5, unread:false, ico:'🗂️', bg:'rgba(39,174,96,.1)',  msg:'Category "Course Project" was edited',               time:'2 days ago'  },
  { id:6, unread:false, ico:'🔒', bg:'rgba(231,76,60,.1)',  msg:'Account osama@uni.edu locked (5 failed attempts)',   time:'3 days ago'  },
];

let editCatId = null;

/* ── Toast ── */
function toast(msg, type = 'tinf') {
  const t = document.createElement('div');
  t.className = 'toast t' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ── Close modal ── */
function closeMol(id) {
  document.getElementById(id).style.display = 'none';
}

/* ── Toggle helper ── */
function tn(el, key) {
  const val = el.checked !== undefined
    ? (el.checked ? 'enabled' : 'disabled')
    : `set to "${el.value}"`;
  toast(`${key}: ${val}`, val === 'disabled' ? 'tinf' : 'ok');
}

/* ── Search ── */
function gSearch(q) {
  if (!q.trim()) return;
  const ql = q.toLowerCase();
  if (cats.some(c => c.name.toLowerCase().includes(ql))) {
    toast(`Showing results for "${q}"`, 'tinf');
  } else {
    window.location = 'announcements.html';
  }
}

/* ── Render categories table ── */
function renderCats() {
  const tbody = document.getElementById('cats-tbody');
  if (!tbody) return;
  tbody.innerHTML = cats.map(c => `
    <tr>
      <td>
        <div class="cat-name-row">
          <strong>${c.name}</strong>
          ${c.locked ? '<span class="bdg bc bdg-def">Default</span>' : ''}
        </div>
        ${c.desc ? `<div class="cat-desc-row">${c.desc}</div>` : ''}
      </td>
      <td>${c.size}</td>
      <td>${c.budget}</td>
      <td><span class="bdg ${c.adv === 'Yes' ? 'bacc' : 'bc'}">${c.adv === 'Yes' ? 'Required' : 'Not Required'}</span></td>
      <td>${c.projects}</td>
      <td>
        <div class="cat-act-row">
          <button class="btn btn-o btn-sm" onclick="openCatModal(${c.id})">✏️ Edit</button>
          <button class="btn btn-er btn-sm" onclick="deleteCat(${c.id})">🗑 Delete</button>
        </div>
      </td>
    </tr>`).join('');

  const badge = document.getElementById('cats-count-badge');
  if (badge) badge.textContent = cats.length + ' categor' + (cats.length === 1 ? 'y' : 'ies');
}

/* ── Modal tabs ── */
function cmTab(id) {
  document.querySelectorAll('.cm-tab').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.cmp').forEach(p => p.classList.remove('on'));
  document.getElementById('cmt-' + id)?.classList.add('on');
  document.getElementById('cmp-' + id)?.classList.add('on');
}

/* ── Open/edit category modal ── */
function openCatModal(id = null) {
  editCatId = id;
  const c = id ? cats.find(x => x.id === id) : null;
  const titleEl = document.getElementById('cat-modal-title');

  if (c) {
    titleEl.innerHTML = c.locked
      ? `Edit Category <span class="bdg bc bdg-def">Default</span>`
      : 'Edit Category';
    document.getElementById('cat-name').value   = c.name;
    document.getElementById('cat-size').value   = c.size;
    const bv = c.budget.replace(/[₺,\s]/g, '');
    document.getElementById('cat-budget').value = isNaN(bv) ? '' : bv;
    document.getElementById('cat-adv').value    = c.adv === 'Yes' ? 'yes' : 'no';
    document.getElementById('cat-desc').value   = c.desc || '';
  } else {
    titleEl.textContent = 'Add Project Category';
    ['cat-name', 'cat-budget', 'cat-desc'].forEach(i => document.getElementById(i).value = '');
    document.getElementById('cat-size').value = '';
    document.getElementById('cat-adv').value  = 'yes';
  }

  cmTab('info');
  document.getElementById('cat-modal').style.display = 'flex';
}

/* ── Save category ── */
function saveCat() {
  const name = document.getElementById('cat-name').value.trim();
  if (!name) { toast('Category name is required', 'er'); return; }

  const size   = document.getElementById('cat-size').value || 'TBD';
  const bRaw   = document.getElementById('cat-budget').value;
  const budget = bRaw ? '₺' + Number(bRaw).toLocaleString() : 'N/A';
  const adv    = document.getElementById('cat-adv').value === 'yes' ? 'Yes' : 'No';
  const desc   = document.getElementById('cat-desc').value.trim();

  if (editCatId) {
    Object.assign(cats.find(x => x.id === editCatId), { name, size, budget, adv, desc });
    toast('Category updated ✅', 'ok');
  } else {
    cats.push({ id: Date.now(), name, size, budget, adv, desc, projects: 0, locked: false, enabled: true });
    toast(`Category "${name}" added ✅`, 'ok');
  }

  closeMol('cat-modal');
  renderCats();
}

/* ── Delete category ── */
function deleteCat(id) {
  const c = cats.find(x => x.id === id);
  if (!c) return;

  const extra = c.locked
    ? `<span style="color:var(--warn);font-weight:600">⚠️ Default category</span> — used by <strong>${c.projects}</strong> active project(s). Deleting it will remove it from all listings.<br><br>`
    : '';

  document.getElementById('confirm-icon').textContent   = '🗂️';
  document.getElementById('confirm-title').textContent  = 'Delete Category';
  document.getElementById('confirm-sub').textContent    = 'This action cannot be undone.';
  document.getElementById('confirm-body').innerHTML     = `${extra}Are you sure you want to delete <strong>"${c.name}"</strong>?`;
  _confirmCallback = () => {
    cats = cats.filter(x => x.id !== id);
    renderCats();
    toast(`Category "${c.name}" deleted.`, 'er');
  };
  document.getElementById('confirm-modal').style.display = 'flex';
}

/* ── Confirm modal ── */
let _confirmCallback = null;
function closeConfirm() {
  document.getElementById('confirm-modal').style.display = 'none';
  _confirmCallback = null;
}
function runConfirm() {
  const cb = _confirmCallback;
  closeConfirm();
  if (cb) cb();
}

/* ── Notifications ── */
function renderNotifs() {
  document.getElementById('notif-body').innerHTML = notifications.map(n => `
    <div class="nit ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
      <div class="ni-ic" style="background:${n.bg}">${n.ico}</div>
      <div class="ni-txt">
        <div class="ni-msg">${n.msg}</div>
        <div class="ni-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="ni-dot"></div>' : ''}
    </div>`).join('');
  document.getElementById('notif-dot').style.display =
    notifications.some(n => n.unread) ? 'block' : 'none';
}

function toggleNotifs() {
  const p = document.getElementById('notif-panel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) renderNotifs();
}
function closeNotifs() { document.getElementById('notif-panel').classList.remove('open'); }
function readNotif(id) { notifications.find(n => n.id === id).unread = false; renderNotifs(); }
function markAllRead() {
  notifications.forEach(n => n.unread = false);
  renderNotifs();
  toast('All notifications marked as read ✅', 'ok');
}

/* ── Click outside closes notif panel ── */
document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn   = document.getElementById('notif-btn');
  if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target))
    closeNotifs();
});

/* ── Boot ── */
renderCats();
renderNotifs();
