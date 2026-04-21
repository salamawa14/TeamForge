/* ══════════════════════════════════════════
   USER MANAGEMENT — Connected to Backend API
   ══════════════════════════════════════════ */

/* ── Data ── */
let users = [];

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

/* ── Search ── */
function gSearch(q) {
  loadUsers(q);
}

/* ── Render users table ── */
function renderUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem">No users found.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div style="font-weight:600">${u.full_name}</div>
        <div style="font-size:0.85rem; opacity:0.7">${u.email}</div>
      </td>
      <td><span class="role-badge role-${u.role}">${u.role}</span></td>
      <td>${u.department || 'N/A'}</td>
      <td>${new Date(u.created_at).toLocaleDateString()}</td>
      <td>
        <div class="cat-act-row">
          <button class="btn btn-er btn-sm" onclick="deleteUser('${u.user_id}', '${u.full_name}')" ${u.role === 'admin' ? 'disabled' : ''}>🗑 Delete</button>
        </div>
      </td>
    </tr>`).join('');

  const badge = document.getElementById('users-count-badge');
  if (badge) badge.textContent = users.length + ' user' + (users.length === 1 ? '' : 's');
}

/* ── Fetch data ── */
async function loadUsers(search = '') {
  try {
    const role = document.getElementById('role-filter').value;
    const params = {};
    if (role) params.role = role;
    if (search) params.search = search;
    
    users = await Admin.getUsers(params);
    renderUsers();
  } catch (err) {
    toast('Error loading users: ' + err.message, 'er');
  }
}

/* ── Create instructor ── */
function openUserModal() {
  document.getElementById('user-form').reset();
  document.getElementById('user-modal').style.display = 'flex';
}

async function saveUser() {
  const data = {
    full_name:      document.getElementById('u-name').value,
    email:          document.getElementById('u-email').value,
    password:       document.getElementById('u-pass').value,
    department:     document.getElementById('u-dept').value,
    academic_title: document.getElementById('u-title').value
  };

  try {
    await Admin.createInstructor(data);
    toast('Instructor account created successfully! ✅', 'ok');
    closeMol('user-modal');
    loadUsers();
  } catch (err) {
    toast('Error creating account: ' + err.message, 'er');
  }
}

/* ── Delete user ── */
function deleteUser(id, name) {
  document.getElementById('confirm-title').textContent = 'Delete User?';
  document.getElementById('confirm-body').innerHTML = `Are you sure you want to delete <strong>${name}</strong>?<br>This will permanently remove their account and data.`;
  
  _confirmCallback = async () => {
    try {
      await Admin.deleteUser(id);
      toast('User deleted successfully.', 'ok');
      loadUsers();
    } catch (err) {
      toast('Error deleting user: ' + err.message, 'er');
    }
  };
  document.getElementById('confirm-modal').style.display = 'flex';
}

/* ── Confirm modal logic ── */
let _confirmCallback = null;
function closeConfirm() {
  document.getElementById('confirm-modal').style.display = 'none';
  _confirmCallback = null;
}
function runConfirm() {
  if (_confirmCallback) _confirmCallback();
  closeConfirm();
}

/* ── Notifications (dummy for now) ── */
function toggleNotifs() { document.getElementById('notif-panel').classList.toggle('open'); }
function closeNotifs() { document.getElementById('notif-panel').classList.remove('open'); }
function markAllRead() { toast('All read.'); }

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  await requireLogin(['admin']);
  loadUsers();
});
