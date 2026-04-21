/* ══════════════════════════════════════════
   INSTRUCTOR SETTINGS — Availability
   ══════════════════════════════════════════ */

function toast(msg, color = '#1a9e8f') {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '11px 20px',
    borderRadius: '8px',
    background: color,
    color: '#fff',
    fontFamily: "'DM Sans',sans-serif",
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    opacity: '0',
    transform: 'translateY(10px)',
    transition: 'all 0.25s',
    zIndex: '9999'
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
  });
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

function updateQuotaUI(activeProjects, maxAdvisees) {
  const safeMax = Math.max(1, Number(maxAdvisees) || 5);
  const used = Math.min(Number(activeProjects) || 0, safeMax);
  const remaining = Math.max(0, safeMax - used);
  const percent = Math.min(100, Math.round((used / safeMax) * 100));

  const quotaValue = document.getElementById('quota-value');
  const quotaFill = document.getElementById('quota-fill');
  const quotaHint = document.getElementById('quota-hint');

  if (quotaValue) quotaValue.textContent = `${used} / ${safeMax} slots used`;
  if (quotaFill) quotaFill.style.width = `${percent}%`;
  if (quotaHint) {
    quotaHint.innerHTML = remaining === 1
      ? 'You have <strong>1 slot remaining</strong>'
      : `You have <strong>${remaining} slots remaining</strong>`;
  }
}

function applyAvailability(data) {
  document.getElementById('avail-tubitak').checked = !!data.accepts_tubitak;
  document.getElementById('avail-teknofest').checked = !!data.accepts_teknofest;
  document.getElementById('max-advisees').value = String(data.max_concurrent_advisees || 5);
  document.getElementById('auto-hide-full').checked = !!data.auto_hide_when_full;
  document.getElementById('office-hours-note').value = data.office_hours_note || '';
  updateQuotaUI(data.active_projects || 0, data.max_concurrent_advisees || 5);
}

async function loadAvailability() {
  try {
    const data = await Instructor.getAvailability();
    applyAvailability(data);
  } catch (err) {
    toast('Error loading availability: ' + err.message, '#dc2626');
  }
}

function openSaveModal() {
  document.getElementById('saveConfirmModal')?.classList.add('show');
}

function closeSaveModal() {
  document.getElementById('saveConfirmModal')?.classList.remove('show');
}

async function saveChanges() {
  const acceptsTubitak = document.getElementById('avail-tubitak').checked;
  const acceptsTeknofest = document.getElementById('avail-teknofest').checked;
  const maxConcurrentAdvisees = Number(document.getElementById('max-advisees').value || 5);
  const autoHideWhenFull = document.getElementById('auto-hide-full').checked;
  const officeHoursNote = document.getElementById('office-hours-note').value.trim();
  const advisingStatus = acceptsTubitak || acceptsTeknofest ? 'Active' : 'Inactive';

  try {
    await Instructor.setAvailability({
      advising_status: advisingStatus,
      accepts_tubitak: acceptsTubitak,
      accepts_teknofest: acceptsTeknofest,
      max_concurrent_advisees: maxConcurrentAdvisees,
      auto_hide_when_full: autoHideWhenFull,
      office_hours_note: officeHoursNote,
    });
    toast('Availability settings saved.');
    await loadAvailability();
  } catch (err) {
    toast('Error saving settings: ' + err.message, '#dc2626');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['instructor']);
  if (user) {
    const sidebarName = document.querySelector('.user-name');
    const sidebarSub = document.querySelector('.user-sub');
    if (sidebarName) sidebarName.textContent = user.full_name;
    if (sidebarSub) sidebarSub.textContent = user.department || 'Instructor';
    await loadAvailability();
  }

  document.getElementById('profileBtn')?.addEventListener('click', () => {
    window.location.href = 'profile_instructor.html';
  });

  document.getElementById('btn-save')?.addEventListener('click', e => {
    e.preventDefault();
    openSaveModal();
  });

  document.getElementById('cancelSaveBtn')?.addEventListener('click', closeSaveModal);
  document.getElementById('confirmSaveBtn')?.addEventListener('click', async () => {
    closeSaveModal();
    await saveChanges();
  });

  document.getElementById('saveConfirmModal')?.addEventListener('click', e => {
    if (e.target.id === 'saveConfirmModal') {
      closeSaveModal();
    }
  });

  document.getElementById('max-advisees')?.addEventListener('change', e => {
    const currentUsed = document.getElementById('quota-value')?.textContent.match(/^(\d+)/);
    updateQuotaUI(currentUsed ? Number(currentUsed[1]) : 0, Number(e.target.value || 5));
  });
});
