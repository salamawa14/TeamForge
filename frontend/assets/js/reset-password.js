/* ══════════════════════════════════════
   reset-password.js — TeamForge Reset Password Logic
══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Elements ── */
  const form           = document.getElementById('resetForm');
  const newPwdInput    = document.getElementById('newPassword');
  const confirmInput   = document.getElementById('confirmPassword');
  const pwdErr         = document.getElementById('pwdError');
  const confirmErr     = document.getElementById('confirmError');
  const toggleBtn      = document.getElementById('togglePwd');
  const eyeIcon        = document.getElementById('eyeIcon');
  const resetBtn       = document.getElementById('resetBtn');
  const btnText        = resetBtn.querySelector('.btn-text');
  const spinner        = document.getElementById('btnSpinner');
  const toast          = document.getElementById('toast');

  /* ── Get token from URL ── */
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    showToast('Invalid reset link. Please request a new password reset.', 'error');
    setTimeout(() => window.location.href = 'login.html', 3000);
    return;
  }

  /* ── Toggle Password Visibility ── */
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
    newPwdInput.type = pwdVisible ? 'text' : 'password';
    eyeIcon.innerHTML = pwdVisible ? eyeClosed : eyeOpen;
  });

  /* ── Inline Validation Helpers ── */
  function validatePassword(val) {
    if (!val) return 'Password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }

  function validateConfirm(pwd, confirm) {
    if (!confirm) return 'Please confirm your password.';
    if (pwd !== confirm) return 'Passwords do not match.';
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
  newPwdInput.addEventListener('blur', () => {
    setFieldError(newPwdInput, pwdErr, validatePassword(newPwdInput.value));
  });

  confirmInput.addEventListener('blur', () => {
    setFieldError(confirmInput, confirmErr, validateConfirm(newPwdInput.value, confirmInput.value));
  });

  /* Clear error on input */
  newPwdInput.addEventListener('input', () => {
    if (pwdErr.textContent) setFieldError(newPwdInput, pwdErr, '');
  });

  confirmInput.addEventListener('input', () => {
    if (confirmErr.textContent) setFieldError(confirmInput, confirmErr, '');
  });

  /* ── Toast Notification ── */
  let toastTimer = null;

  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = 'toast show' + (type === 'error' ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  /* ── Loading State ── */
  function setLoading(on) {
    resetBtn.disabled = on;
    btnText.hidden     = on;
    spinner.hidden     = !on;
  }

  /* ── Form Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPwd = newPwdInput.value;
    const confirmPwd = confirmInput.value;

    const pwdErrMsg = validatePassword(newPwd);
    const confirmErrMsg = validateConfirm(newPwd, confirmPwd);

    setFieldError(newPwdInput, pwdErr, pwdErrMsg);
    setFieldError(confirmInput, confirmErr, confirmErrMsg);

    if (pwdErrMsg || confirmErrMsg) return;

    setLoading(true);

    try {
      await Auth.resetPassword(token, newPwd);
      showToast('✓ Password reset successfully! Redirecting to login…');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Failed to reset password. Please try again.', 'error');
    }
  });

})();