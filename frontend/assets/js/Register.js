/* ══════════════════════════════════════
   register.js — TeamForge Create Account
══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Elements ── */
  const form           = document.getElementById('registerForm');
  const roleTabs       = document.querySelectorAll('.role-tab');
  const studentFields  = document.getElementById('studentFields');
  const instructorFields = document.getElementById('instructorFields');

  const firstNameIn    = document.getElementById('firstName');
  const lastNameIn     = document.getElementById('lastName');
  const emailIn        = document.getElementById('email');
  const universityIn   = document.getElementById('university');
  const departmentIn   = document.getElementById('department');
  const studentNumIn   = document.getElementById('studentNumber');
  const yearIn         = document.getElementById('yearOfStudy');
  const titleIn        = document.getElementById('title');
  const passwordIn     = document.getElementById('password');
  const termsIn        = document.getElementById('terms');

  const toggleBtn      = document.getElementById('togglePwd');
  const eyeIcon        = document.getElementById('eyeIcon');
  const pwdStrength    = document.getElementById('pwdStrength');
  const strengthFill   = document.getElementById('strengthFill');
  const strengthLabel  = document.getElementById('strengthLabel');

  const createBtn      = document.getElementById('createBtn');
  const btnText        = createBtn.querySelector('.btn-text');
  const spinner        = document.getElementById('btnSpinner');
  const toast          = document.getElementById('toast');

  let activeRole = 'student';

  /* ─────────────────────────────
     Role Tab Switching
  ───────────────────────────── */
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRole = tab.dataset.role;

      if (activeRole === 'student') {
        studentFields.hidden    = false;
        instructorFields.hidden = true;
        emailIn.placeholder     = 'you@university.edu';
      } else {
        studentFields.hidden    = true;
        instructorFields.hidden = false;
        emailIn.placeholder     = 'instructor@university.edu';
      }
    });
  });

  /* ─────────────────────────────
     Password Visibility Toggle
  ───────────────────────────── */
  const eyeOpen = `
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>`;
  const eyeClosed = `
    <line x1="17.94" y1="17.94" x2="22" y2="22"/>
    <line x1="1" y1="1" x2="6.06" y2="6.06"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="M6.63 6.63A18.5 18.5 0 0 0 1 12s4 8 11 8a9.12 9.12 0 0 0 4.76-1.24"/>`;

  let pwdVisible = false;
  toggleBtn.addEventListener('click', () => {
    pwdVisible = !pwdVisible;
    passwordIn.type    = pwdVisible ? 'text' : 'password';
    eyeIcon.innerHTML  = pwdVisible ? eyeClosed : eyeOpen;
  });

  /* ─────────────────────────────
     Password Strength Meter
  ───────────────────────────── */
  passwordIn.addEventListener('input', () => {
    const val = passwordIn.value;
    if (!val) {
      pwdStrength.hidden = true;
      return;
    }
    pwdStrength.hidden = false;

    let score = 0;
    if (val.length >= 8)               score++;
    if (/[A-Z]/.test(val))            score++;
    if (/[0-9]/.test(val))            score++;
    if (/[^A-Za-z0-9]/.test(val))     score++;

    const levels = [
      { pct: 25,  color: '#ef4444', label: 'Weak' },
      { pct: 50,  color: '#f59e0b', label: 'Fair' },
      { pct: 75,  color: '#3b82f6', label: 'Good' },
      { pct: 100, color: '#22c55e', label: 'Strong' },
    ];

    const idx = Math.max(0, score - 1);
    const lvl = levels[idx];

    strengthFill.style.width      = lvl.pct + '%';
    strengthFill.style.background = lvl.color;
    strengthLabel.textContent     = lvl.label;
    strengthLabel.style.color     = lvl.color;
  });

  /* ─────────────────────────────
     Validation Helpers
  ───────────────────────────── */
  function err(id, msg) {
    const el = document.getElementById(id + 'Error');
    if (el) el.textContent = msg;
  }

  function clearErr(id) { err(id, ''); }

  function markError(input, errId, msg) {
    if (input) input.classList.toggle('error', !!msg);
    err(errId, msg);
  }

  function required(val, label) {
    return val.trim() ? '' : `${label} is required.`;
  }

  function validateEmail(val) {
    if (!val.trim()) return 'Email address is required.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? '' : 'Enter a valid email address.';
  }

  function validatePassword(val) {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }

  /* ─────────────────────────────
     Live blur validation
  ───────────────────────────── */
  [
    [firstNameIn,  'firstName',    () => required(firstNameIn.value,  'First name')],
    [lastNameIn,   'lastName',     () => required(lastNameIn.value,   'Last name')],
    [emailIn,      'email',        () => validateEmail(emailIn.value)],
    [universityIn, 'university',   () => universityIn.value ? '' : 'Please select your university.'],
    [departmentIn, 'department',   () => departmentIn.value ? '' : 'Please select your department.'],
    [passwordIn,   'pwd',          () => validatePassword(passwordIn.value)],
  ].forEach(([input, key, validate]) => {
    if (!input) return;
    input.addEventListener('blur', () => markError(input, key, validate()));
    input.addEventListener('input', () => {
      if (document.getElementById(key + 'Error')?.textContent) {
        markError(input, key, validate());
      }
    });
  });

  /* ─────────────────────────────
     Full Form Validation
  ───────────────────────────── */
  function validateAll() {
    let valid = true;

    const checks = [
      [firstNameIn,  'firstName',  required(firstNameIn.value,  'First name')],
      [lastNameIn,   'lastName',   required(lastNameIn.value,   'Last name')],
      [emailIn,      'email',      validateEmail(emailIn.value)],
      [universityIn, 'university', universityIn.value ? '' : 'Please select your university.'],
      [departmentIn, 'department', departmentIn.value ? '' : 'Please select your department.'],
      [passwordIn,   'pwd',        validatePassword(passwordIn.value)],
    ];

    // Role-specific
    if (activeRole === 'student') {
      checks.push([studentNumIn, 'studentNumber', required(studentNumIn.value, 'Student number')]);
      checks.push([yearIn,       'year',          yearIn.value ? '' : 'Please select your year.']);
    } else {
      checks.push([titleIn, 'title', titleIn.value ? '' : 'Please select your title.']);
    }

    checks.forEach(([input, key, msg]) => {
      markError(input, key, msg);
      if (msg) valid = false;
    });

    if (!termsIn.checked) {
      err('terms', 'You must agree to the terms.');
      valid = false;
    } else {
      err('terms', '');
    }

    return valid;
  }

  /* ─────────────────────────────
     Loading State
  ───────────────────────────── */
  function setLoading(on) {
    createBtn.disabled = on;
    btnText.hidden     = on;
    spinner.hidden     = !on;
  }

  /* ─────────────────────────────
     Toast
  ───────────────────────────── */
  let toastTimer;
  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className   = 'toast show' + (type === 'error' ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ─────────────────────────────
     Fake Register API
     Replace with real fetch()
  ───────────────────────────── */
  function fakeRegisterRequest(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate duplicate email check (demo)
        if (data.email === 'taken@university.edu') {
          reject(new Error('An account with this email already exists.'));
        } else {
          resolve({ id: 'user-' + Date.now(), ...data });
        }
      }, 1300);
    });
  }

  /* ─────────────────────────────
     Form Submit
  ───────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);

    const payload = {
      role:       activeRole,
      firstName:  firstNameIn.value.trim(),
      lastName:   lastNameIn.value.trim(),
      email:      emailIn.value.trim(),
      university: universityIn.value,
      department: departmentIn.value,
      password:   passwordIn.value,
      ...(activeRole === 'student'
        ? { studentNumber: studentNumIn.value.trim(), year: yearIn.value }
        : { title: titleIn.value }),
    };

    try {
      await fakeRegisterRequest(payload);
      showToast('✓ Account created! Redirecting to sign in…');
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    }
  });

  /* ─────────────────────────────
     Hero CTA → redirect to register
  ───────────────────────────── */
  const heroBtn = document.querySelector('.btn-hero-primary');
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => firstNameIn.focus(), 600);
    });
  }

  /* ─────────────────────────────
     Floating cards subtle parallax
  ───────────────────────────── */
  const heroSection = document.querySelector('.hero-section');
  const floatCards  = document.querySelectorAll('.float-card');

  if (heroSection && floatCards.length) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const mx   = (e.clientX - rect.left) / rect.width  - 0.5;
      const my   = (e.clientY - rect.top)  / rect.height - 0.5;

      floatCards.forEach((card, i) => {
        const depth = (i + 1) * 6;
        card.style.transform = `translateY(${my * depth}px) translateX(${mx * depth}px)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      floatCards.forEach(card => { card.style.transform = ''; });
    });
  }

})();