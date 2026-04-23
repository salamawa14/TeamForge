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

/* ── Create user: role-driven field visibility ──
 *
 * Fields shown per role:
 *   student    → full_name, email, password, department (required)
 *   instructor → full_name, email, password, department (required), academic_title (optional)
 *   admin      → full_name, email, password   (no department, no academic_title)
 */
function onRoleChange() {
  const role = document.getElementById('u-role').value;

  const deptWrap  = document.getElementById('u-dept-wrap');
  const titleWrap = document.getElementById('u-title-wrap');
  const deptInput = document.getElementById('u-dept');
  const deptReq   = document.getElementById('u-dept-req');

  // Department: visible + required for student/instructor, hidden for admin
  if (role === 'admin') {
    deptWrap.style.display = 'none';
    deptInput.required = false;
    deptInput.value = '';
    if (deptReq) deptReq.style.display = 'none';
  } else {
    deptWrap.style.display = '';
    deptInput.required = true;
    if (deptReq) deptReq.style.display = '';
  }

  // Academic Title: only visible for instructor
  if (role === 'instructor') {
    titleWrap.style.display = '';
  } else {
    titleWrap.style.display = 'none';
    document.getElementById('u-title').value = '';
  }
}

function openUserModal() {
  document.getElementById('user-form').reset();
  // After reset, re-apply role-driven visibility (default role = instructor, set in HTML)
  onRoleChange();
  document.getElementById('user-modal').style.display = 'flex';
}

/*
 * saveUser — sends a role-tagged payload to the backend.
 *
 * Expected backend endpoint (to be implemented by backend team):
 *   POST /admin/users                    via  Admin.createUser(data)
 *
 * Payload shape (only relevant fields per role are included):
 *   {
 *     role:           'student' | 'instructor' | 'admin',   // always sent
 *     full_name:      string,
 *     email:          string,
 *     password:       string,
 *     department?:    string,   // student + instructor only
 *     academic_title?:string    // instructor only
 *   }
 *
 * Backend is free to dispatch internally (e.g. createStudent / createInstructor
 * / createAdmin) — the frontend only knows about one unified endpoint.
 */
async function saveUser() {
  const role = document.getElementById('u-role').value;

  const data = {
    role,
    full_name: document.getElementById('u-name').value.trim(),
    email:     document.getElementById('u-email').value.trim(),
    password:  document.getElementById('u-pass').value,
  };

  // Only include role-relevant fields
  if (role === 'student' || role === 'instructor') {
    data.department = document.getElementById('u-dept').value.trim();
  }
  if (role === 'instructor') {
    const title = document.getElementById('u-title').value.trim();
    if (title) data.academic_title = title;
  }

  try {
    // Prefer a single unified endpoint. Fall back to createInstructor
    // for backwards-compat if backend hasn't shipped createUser yet.
    if (typeof Admin.createUser === 'function') {
      await Admin.createUser(data);
    } else if (role === 'instructor' && typeof Admin.createInstructor === 'function') {
      await Admin.createInstructor(data);
    } else {
      throw new Error('Backend endpoint Admin.createUser is not available yet.');
    }

    toast(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully! ✅`, 'ok');
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