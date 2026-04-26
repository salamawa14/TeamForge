/* ══════════════════════════════════════
   login.js — TeamForge Sign In Logic
══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Elements ── */
  const form       = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const pwdInput   = document.getElementById('password');
  const emailErr   = document.getElementById('emailError');
  const pwdErr     = document.getElementById('pwdError');
  const toggleBtn  = document.getElementById('togglePwd');
  const eyeIcon    = document.getElementById('eyeIcon');
  const signInBtn  = document.getElementById('signInBtn');
  const btnText    = signInBtn.querySelector('.btn-text');
  const spinner    = document.getElementById('btnSpinner');
  const toast      = document.getElementById('toast');
  const roleTabs   = document.querySelectorAll('.role-tab');
  const remember   = document.getElementById('remember');

  /* ── State ── */
  let activeRole = 'student';

  /* ─────────────────────────────
     Role Tab Switching
  ───────────────────────────── */
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRole = tab.dataset.role;

      // Update email placeholder per role
      const placeholders = {
        student:    'you@university.edu',
        instructor: 'instructor@university.edu',
        admin:      'admin@teamforge.io',
      };
      emailInput.placeholder = placeholders[activeRole];
    });
  });

  /* ─────────────────────────────
     Toggle Password Visibility
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
    pwdInput.type = pwdVisible ? 'text' : 'password';
    eyeIcon.innerHTML = pwdVisible ? eyeClosed : eyeOpen;
  });

  /* ─────────────────────────────
     Inline Validation Helpers
  ───────────────────────────── */
  function validateEmail(val) {
    if (!val.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
    return '';
  }

  function validatePassword(val) {
    if (!val) return 'Password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }

  function setFieldError(input, errEl, msg) {
    errEl.textContent = msg;
    if (msg) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  }

  /* Live validation on blur */
  emailInput.addEventListener('blur', () => {
    setFieldError(emailInput, emailErr, validateEmail(emailInput.value));
  });

  pwdInput.addEventListener('blur', () => {
    setFieldError(pwdInput, pwdErr, validatePassword(pwdInput.value));
  });

  /* Clear error on input */
  emailInput.addEventListener('input', () => {
    if (emailErr.textContent) setFieldError(emailInput, emailErr, '');
  });

  pwdInput.addEventListener('input', () => {
    if (pwdErr.textContent) setFieldError(pwdInput, pwdErr, '');
  });

  /* ─────────────────────────────
     Toast Notification
  ───────────────────────────── */
  let toastTimer = null;

  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = 'toast show' + (type === 'error' ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  /* ─────────────────────────────
     Loading State
  ───────────────────────────── */
  function setLoading(on) {
    signInBtn.disabled = on;
    btnText.hidden     = on;
    spinner.hidden     = !on;
  }

  /* ─────────────────────────────
     Remember Me — persist email
  ───────────────────────────── */
  const savedEmail = localStorage.getItem('tf_remembered_email');
  if (savedEmail) {
    emailInput.value  = savedEmail;
    remember.checked  = true;
  }
/* ─────────────────────────────
     Forgot Password
  ───────────────────────────── */
  const forgotLink = document.querySelector('.link-muted');
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordModal();
  });

  function showForgotPasswordModal() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Reset Password</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>Enter your email address and we'll send you a link to reset your password.</p>
          <form id="forgotForm">
            <div class="field-group">
              <label for="resetEmail">Email Address</label>
              <input
                type="email"
                id="resetEmail"
                name="resetEmail"
                placeholder="you@university.edu"
                required
              />
              <span class="field-error" id="resetEmailError"></span>
            </div>
            <button type="submit" class="btn-signin" id="resetBtn">
              <span class="btn-text">Send Reset Link</span>
              <span class="btn-spinner" id="resetSpinner" hidden></span>
            </button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const forgotForm = modal.querySelector('#forgotForm');
    const resetEmail = modal.querySelector('#resetEmail');
    const resetEmailError = modal.querySelector('#resetEmailError');
    const resetBtn = modal.querySelector('#resetBtn');
    const resetBtnText = resetBtn.querySelector('.btn-text');
    const resetSpinner = modal.querySelector('#resetSpinner');

    function closeModal() {
      modal.remove();
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = resetEmail.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        resetEmailError.textContent = 'Please enter a valid email address.';
        resetEmail.classList.add('error');
        return;
      }
      resetEmailError.textContent = '';
      resetEmail.classList.remove('error');

      resetBtn.disabled = true;
      resetBtnText.textContent = 'Sending…';
      resetSpinner.hidden = false;

      try {
        await Auth.forgotPassword(email);
        showToast('✓ If an account with that email exists, a password reset link has been sent.');
        closeModal();
      } catch (err) {
        resetBtn.disabled = false;
        resetBtnText.textContent = 'Send Reset Link';
        resetSpinner.hidden = true;
        showToast(err.message || 'Failed to send reset link. Please try again.', 'error');
      }
    });
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
     console.log('submit fired', emailInput.value);

    const emailVal = emailInput.value.trim();
    const pwdVal   = pwdInput.value;

    const eErr = validateEmail(emailVal);
    const pErr = validatePassword(pwdVal);

    setFieldError(emailInput, emailErr, eErr);
    setFieldError(pwdInput, pwdErr, pErr);

    if (eErr || pErr) return;

    if (remember.checked) {
      localStorage.setItem('tf_remembered_email', emailVal);
    } else {
      localStorage.removeItem('tf_remembered_email');
    }

    setLoading(true);

    try {
      const user = await Auth.login(emailVal, pwdVal);

      showToast('✓ Signed in successfully! Redirecting…');

      setTimeout(() => {
        // Use the redirect path from the server, but prepend the PROJECT_ROOT
        // (PROJECT_ROOT is defined in api.js)
        window.location.href = PROJECT_ROOT + user.redirect;
      }, 1400);

    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Sign in failed. Please try again.', 'error');
    }
  });
  
  /* ─────────────────────────────
     Fake Auth (demo only)
     Replace with real API call
  ───────────────────────────── */
  function fakeAuthRequest(email, password, role) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo credentials provided by system (like STIX)
        // In production: replace with real fetch() to PHP backend
        const validCredentials = {
          student:    { email: 'student@university.edu',    password: '123456' },
          instructor: { email: 'instructor@university.edu', password: '123456' },
          admin:      { email: 'admin@teamforge.io',        password: 'admin123' },
        };
        const valid = validCredentials[role];
        if (valid && email === valid.email && password === valid.password) {
          resolve({ token: 'demo-token-' + role, role });
        } else if (email.includes('@') && password.length >= 6) {
          // Accept any valid-looking email for demo purposes
          resolve({ token: 'demo-token-' + role, role });
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 1200);
    });
  }

})();