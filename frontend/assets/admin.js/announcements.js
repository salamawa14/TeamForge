/* ══════════════════════════════════════════
   ANNOUNCEMENTS — Connected to Backend API
   ══════════════════════════════════════════ */

/* ── Data ── */
let announcements = [];
let categories = [];

let notifications = [
  { id:1, unread:true,  ico:'👤', bg:'rgba(0,168,181,.1)',  msg:'New user registered: Nisan Ay (Student)',             time:'2 min ago'   },
  { id:2, unread:true,  ico:'⚠️', bg:'rgba(231,76,60,.1)',  msg:'User "beza@uni.edu" deactivated',                     time:'1 hour ago'  },
  { id:3, unread:true,  ico:'📢', bg:'rgba(243,156,18,.1)', msg:'Announcement published: TÜBİTAK Applications Open',   time:'3 hours ago' },
  { id:4, unread:false, ico:'🎓', bg:'rgba(108,99,255,.1)', msg:'Dr. Selin Arslan reached full advisor quota',         time:'Yesterday'   },
  { id:5, unread:false, ico:'🗂️', bg:'rgba(39,174,96,.1)',  msg:'Category "Course Project" was edited',               time:'2 days ago'  },
  { id:6, unread:false, ico:'🔒', bg:'rgba(231,76,60,.1)',  msg:'Account osama@uni.edu locked (5 failed attempts)',   time:'3 days ago'  },
];

const ANN_ICONS = { Tubitak:'🔬', Teknofest:'🚀', Course:'📋', System:'🔧' };
const ANN_BADGE  = { Tubitak:'bt', Teknofest:'bk', Course:'bc', System:'bp' };

/* ── Toast ── */
function toast(msg, type = 'tinf') {
  console.log(`[Toast] ${type}: ${msg}`);
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
  if (!q.trim()) { renderAnns(); return; }
  const ql = q.toLowerCase();
  const filtered = announcements.filter(a => 
    a.title.toLowerCase().includes(ql) || 
    a.description.toLowerCase().includes(ql)
  );
  renderAnns(filtered);
}

/* ── Render announcements ── */
function renderAnns(data = null) {
  const el = document.getElementById('anns-list');
  if (!el) return;
  
  const list = data || announcements;
  
  if (!list.length) {
    el.innerHTML = '<p class="empty-msg" style="text-align:center;padding:3rem;opacity:0.6">No announcements found.</p>';
    return;
  }
  
  el.innerHTML = list.map(a => `
    <div class="ann-item">
      <div class="ann-ico">${ANN_ICONS[a.category_name] || '📢'}</div>
      <div class="ann-body">
        <span class="bdg ${ANN_BADGE[a.category_name] || 'bc'}">${a.category_name || 'General'}</span>
        <div class="ann-title" style="font-weight:700; font-size:1.1rem; margin: 0.5rem 0">${a.title}</div>
        <div class="ann-desc" style="opacity:0.8; line-height:1.5">${a.description}</div>
        <div class="ann-foot" style="margin-top: 1rem; display:flex; gap:1.5rem; font-size:0.85rem; opacity:0.6">
          <span>📅 ${new Date(a.published_at).toLocaleDateString()}</span>
          ${a.deadline ? `<span>⏳ Expires ${new Date(a.deadline).toLocaleDateString()}</span>` : ''}
          <span style="margin-left:auto">Posted by: ${a.posted_by}</span>
        </div>
      </div>
      <div class="ann-actions" style="display:flex; flex-direction:column; gap:0.5rem">
        <button class="btn btn-o btn-sm" onclick="editAnn('${a.announcement_id}')">✏️ Edit</button>
        <button class="btn btn-er btn-sm" onclick="deleteAnn('${a.announcement_id}')">🗑 Delete</button>
      </div>
    </div>`).join('');
}

/* ── Fetch data ── */
async function loadData() {
  try {
    console.log("Fetching announcements and categories...");
    const [anns, cats] = await Promise.all([
      Admin.getAnnouncements(),
      Admin.getCategories()
    ]);
    announcements = anns;
    categories = cats;
    
    // Fill category dropdown
    const catSelect = document.getElementById('ann-cat');
    if (catSelect) {
      catSelect.innerHTML = '<option value="">General/System</option>' + 
                          categories.map(c => `<option value="${c.category_id}">${c.name}</option>`).join('');
    }
    
    renderAnns();
  } catch (err) {
    toast('Error loading data: ' + err.message, 'er');
    console.error(err);
  }
}

/* ── Open new announcement modal ── */
function openAnnModal() {
  document.getElementById('ann-title').value = '';
  document.getElementById('ann-desc').value = '';
  document.getElementById('ann-expiry').value = '';
  document.getElementById('ann-cat').value = '';
  document.getElementById('ann-priority').value = 'normal';
  document.getElementById('ann-modal').dataset.editId = '';
  document.getElementById('ann-modal-title').textContent = 'Publish Announcement';
  document.getElementById('ann-modal').style.display = 'flex';
}

/* ── Edit announcement ── */
function editAnn(id) {
  const a = announcements.find(x => x.announcement_id === id);
  if (!a) return;
  document.getElementById('ann-title').value    = a.title;
  document.getElementById('ann-desc').value     = a.description;
  document.getElementById('ann-cat').value      = a.category_id || '';
  document.getElementById('ann-priority').value = 'normal';
  document.getElementById('ann-expiry').value   = a.deadline || '';
  document.getElementById('ann-modal').dataset.editId = id;
  document.getElementById('ann-modal-title').textContent = 'Edit Announcement';
  document.getElementById('ann-modal').style.display = 'flex';
}

/* ── Save announcement ── */
async function saveAnn() {
  const title       = document.getElementById('ann-title').value.trim();
  const description = document.getElementById('ann-desc').value.trim();
  const category_id = document.getElementById('ann-cat').value;
  const deadline    = document.getElementById('ann-expiry').value;

  if (!title || !description) { toast('Please fill title and description', 'er'); return; }

  const eId = document.getElementById('ann-modal').dataset.editId;
  const data = { 
    title, 
    description, 
    category_id: category_id || null, 
    deadline: deadline || null 
  };

  try {
    console.log("Saving announcement:", data);
    if (eId) {
      await Admin.updateAnnouncement(eId, data);
      toast('Announcement updated ✅', 'ok');
    } else {
      await Admin.createAnnouncement(data);
      toast('Announcement published! 📢', 'ok');
    }
    closeMol('ann-modal');
    await loadData();
  } catch (err) {
    toast('Error saving: ' + err.message, 'er');
    console.error("Save failed:", err);
  }
}

/* ── Delete announcement ── */
function deleteAnn(id) {
  const a = announcements.find(x => x.announcement_id === id);
  if (!a) return;
  document.getElementById('confirm-title').textContent = 'Delete Announcement';
  document.getElementById('confirm-body').innerHTML    = `Are you sure you want to delete <strong>"${a.title}"</strong>?`;
  
  _confirmCallback = async () => {
    try {
      await Admin.deleteAnnouncement(id);
      await loadData();
      toast('Announcement deleted.', 'er');
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
  if (_confirmCallback) _confirmCallback();
  closeConfirm();
}

/* ── Template bar ── */
function toggleTemplates() {
  document.getElementById('tpl-bar').classList.toggle('open');
}

function fillAnnTemplate(type) {
  const T = {
    tubitak:   { title:'TÜBİTAK 2209-A Deadline Reminder',    cat:'Tubitak',
                 desc:'Reminder: TÜBİTAK 2209-A undergraduate research project deadline is approaching. Ensure your team is complete and advisor is confirmed before submitting via the e-Bideb portal.' },
    teknofest: { title:'Teknofest 2026 Registration Now Open', cat:'Teknofest',
                 desc:'Teknofest 2026 project registrations are now open! Form interdisciplinary teams and register on the official Teknofest portal. Advisor confirmation is required for all teams.' },
    results:   { title:'Project Results Announced',            cat:'Tubitak',
                 desc:'Results for the latest project cycle have been announced. Students can check their project status via the e-Bideb portal or contact their advisor directly for further details.' },
    maint:     { title:'Scheduled Platform Maintenance',       cat:'System',
                 desc:'TeamForge will undergo scheduled maintenance. The platform will be temporarily unavailable during this window. Please save all your work beforehand. We apologize for any inconvenience.' },
  };
  const t = T[type]; if (!t) return;
  document.getElementById('tpl-bar').classList.remove('open');
  openAnnModal();
  document.getElementById('ann-title').value = t.title;
  document.getElementById('ann-desc').value  = t.desc;
  
  const cat = categories.find(c => c.name === t.cat);
  if (cat) document.getElementById('ann-cat').value = cat.category_id;
}

/* ── Notifications (Static for now) ── */
function renderNotifs() {
  const body = document.getElementById('notif-body');
  if (!body) return;
  body.innerHTML = notifications.map(n => `
    <div class="nit ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
      <div class="ni-ic" style="background:${n.bg}">${n.ico}</div>
      <div class="ni-txt">
        <div class="ni-msg">${n.msg}</div>
        <div class="ni-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="ni-dot"></div>' : ''}
    </div>`).join('');
}
function toggleNotifs() { document.getElementById('notif-panel').classList.toggle('open'); }
function closeNotifs() { document.getElementById('notif-panel').classList.remove('open'); }
function readNotif(id) { notifications.find(n => n.id === id).unread = false; renderNotifs(); }
function markAllRead() { notifications.forEach(n => n.unread = false); renderNotifs(); }

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Announcements page loaded.");
  await requireLogin(['admin']);
  loadData();
  renderNotifs();
});
