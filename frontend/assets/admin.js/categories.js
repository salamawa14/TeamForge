/* ══════════════════════════════════════════
   PROJECT CATEGORIES — Connected to Backend API
   ══════════════════════════════════════════ */

/* ── Data ── */
let cats = [];

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
    // window.location = 'announcements.html';
  }
}

/* ── Render categories table ── */
function renderCats() {
  const tbody = document.getElementById('cats-tbody');
  if (!tbody) return;
  
  if (cats.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem">No categories found.</td></tr>';
    return;
  }

  tbody.innerHTML = cats.map(c => `
    <tr>
      <td>
        <div class="cat-name-row">
          <strong>${c.name}</strong>
          ${c.locked ? '<span class="bdg bc bdg-def">Default</span>' : ''}
        </div>
        ${c.description ? `<div class="cat-desc-row">${c.description}</div>` : ''}
      </td>
      <td>Max ${c.max_members}</td>
      <td>₺${Number(c.budget_tl).toLocaleString()}</td>
      <td><span class="bdg ${c.advisor_required ? 'bacc' : 'bc'}">${c.advisor_required ? 'Required' : 'Not Required'}</span></td>
      <td>${c.projects_count || 0}</td>
      <td>
        <div class="cat-act-row">
          <button class="btn btn-o btn-sm" onclick="openCatModal('${c.category_id}')">✏️ Edit</button>
          <button class="btn btn-er btn-sm" onclick="deleteCat('${c.category_id}')">🗑 Delete</button>
        </div>
      </td>
    </tr>`).join('');

  const badge = document.getElementById('cats-count-badge');
  if (badge) badge.textContent = cats.length + ' categor' + (cats.length === 1 ? 'y' : 'ies');
}

/* ── Fetch data from API ── */
async function loadCats() {
  try {
    cats = await Admin.getCategories();
    renderCats();
  } catch (err) {
    toast('Failed to load categories: ' + err.message, 'er');
  }
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
  const c = id ? cats.find(x => x.category_id === id) : null;
  const titleEl = document.getElementById('cat-modal-title');

  if (c) {
    titleEl.textContent = 'Edit Category';
    document.getElementById('cat-name').value   = c.name;
    document.getElementById('cat-size').value   = c.max_members;
    document.getElementById('cat-budget').value = c.budget_tl;
    document.getElementById('cat-adv').value    = c.advisor_required ? 'yes' : 'no';
    document.getElementById('cat-desc').value   = c.description || '';
  } else {
    titleEl.textContent = 'Add Project Category';
    ['cat-name', 'cat-budget', 'cat-desc', 'cat-size'].forEach(i => document.getElementById(i).value = '');
    document.getElementById('cat-adv').value  = 'yes';
  }

  cmTab('info');
  document.getElementById('cat-modal').style.display = 'flex';
}

/* ── Save category ── */
async function saveCat() {
  const name = document.getElementById('cat-name').value.trim();
  if (!name) { toast('Category name is required', 'er'); return; }

  const data = {
    name,
    max_members: document.getElementById('cat-size').value || 5,
    budget_tl:   document.getElementById('cat-budget').value || 0,
    advisor_required: document.getElementById('cat-adv').value === 'yes' ? 1 : 0,
    description: document.getElementById('cat-desc').value.trim()
  };

  try {
    if (editCatId) {
      await Admin.updateCategory(editCatId, data);
      toast('Category updated ✅', 'ok');
    } else {
      await Admin.createCategory(data);
      toast(`Category "${name}" added ✅`, 'ok');
    }
    closeMol('cat-modal');
    loadCats(); // Refresh list
  } catch (err) {
    toast('Error saving category: ' + err.message, 'er');
  }
}

/* ── Delete category ── */
function deleteCat(id) {
  const c = cats.find(x => x.category_id === id);
  if (!c) return;

  document.getElementById('confirm-icon').textContent   = '🗂️';
  document.getElementById('confirm-title').textContent  = 'Delete Category';
  document.getElementById('confirm-sub').textContent    = 'This action cannot be undone.';
  document.getElementById('confirm-body').innerHTML     = `Are you sure you want to delete <strong>"${c.name}"</strong>?`;
  
  _confirmCallback = async () => {
    try {
      await Admin.deleteCategory(id);
      loadCats();
      toast(`Category "${c.name}" deleted.`, 'er');
    } catch (err) {
      toast('Error deleting: ' + err.message, 'er');
    }
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
document.addEventListener('DOMContentLoaded', async () => {
  await requireLogin(['admin']);
  loadCats();
  renderNotifs();
});
