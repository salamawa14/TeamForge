/* ═══════════════════════════════════════════════════ 
   Student-My-Profile.js — Backend Connected 
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Guard — redirect to login if not logged in
  const user = await requireLogin(['student']);
  if (!user) return;

  // Show user name in header
  document.querySelectorAll('.user-name, [data-user-name]').forEach(el => el.textContent = user.full_name);

  const form = document.getElementById('profileForm') || document.querySelector('form');
  const chipInp = document.getElementById('chipInp');
  const chipContainer = chipInp ? chipInp.parentElement : null;

  // 2. Fetch Profile Data from Database
  async function loadProfile() {
    try {
      // Assuming you create a profile.php endpoint
      const data = await apiRequest('/students/profile.php', 'GET');
      
      if (data && data.profile) {
        const p = data.profile;
        
        // Populate standard fields
        if(document.getElementById('fullName')) document.getElementById('fullName').value = p.full_name || '';
        if(document.getElementById('email')) document.getElementById('email').value = p.email || '';
        if(document.getElementById('department')) document.getElementById('department').value = p.department || '';
        if(document.getElementById('academicYear')) document.getElementById('academicYear').value = p.academic_year || '';
        if(document.getElementById('bio')) document.getElementById('bio').value = p.bio || '';
        if(document.getElementById('github')) document.getElementById('github').value = p.github_url || '';
        if(document.getElementById('linkedin')) document.getElementById('linkedin').value = p.linkedin_url || '';

        // Populate skills chips
        if (chipContainer && p.technical_skills) {
          let skills = [];
          try {
             skills = typeof p.technical_skills === 'string' ? JSON.parse(p.technical_skills) : p.technical_skills;
          } catch(e) {}
          
          skills.forEach(skill => addChip(skill));
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      if (typeof showToast === 'function') showToast('Could not load profile data', 'error');
    }
  }

  // Helper to add a skill chip visually
  function addChip(val) {
      if (!val || !chipContainer || !chipInp) return;
      const chip = document.createElement('span');
      chip.className = 's-chip';
      chip.innerHTML = `${val} <button type="button" onclick="event.stopPropagation();this.parentElement.remove()">✕</button>`;
      chipContainer.insertBefore(chip, chipInp);
  }

  // 3. Handle Skill Input
  if (chipInp) {
      chipInp.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ',') && chipInp.value.trim()) {
          e.preventDefault();
          const val = chipInp.value.replace(',', '').trim();
          addChip(val);
          chipInp.value = '';
        }
        if (e.key === 'Backspace' && !chipInp.value) {
          const chips = chipContainer.querySelectorAll('.s-chip');
          if (chips.length) chips[chips.length - 1].remove();
        }
      });
  }

  // 4. Save Profile Data
  if (form) {
      form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = form.querySelector('button[type="submit"]') || document.getElementById('saveBtn');
          const originalText = btn.textContent;
          btn.disabled = true;
          btn.textContent = 'Saving...';

          // Gather skills from chips
          const skills = Array.from(document.querySelectorAll('.s-chip')).map(chip => chip.childNodes[0].textContent.trim());

          const payload = {
              full_name: document.getElementById('fullName')?.value,
              department: document.getElementById('department')?.value,
              academic_year: document.getElementById('academicYear')?.value,
              bio: document.getElementById('bio')?.value,
              github_url: document.getElementById('github')?.value,
              linkedin_url: document.getElementById('linkedin')?.value,
              technical_skills: JSON.stringify(skills) // Send as JSON string
          };

          try {
              await apiRequest('/students/profile.php', 'POST', payload);
              if (typeof showToast === 'function') showToast('✓ Profile updated successfully!', 'ok');
          } catch (err) {
              if (typeof showToast === 'function') showToast(err.message, 'error');
          } finally {
              btn.disabled = false;
              btn.textContent = originalText;
          }
      });
  }

  // 5. Initial Load
  loadProfile();

  // 6. Keep UI Toggles working
  const burg = document.getElementById('burg');
  const sb = document.getElementById('sb');
  if(burg && sb) burg.addEventListener('click', () => sb.classList.toggle('open'));
});