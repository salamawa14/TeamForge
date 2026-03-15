/* ── ROLE TOGGLE ─────────────────────────────────────────── */
const btnStudent    = document.getElementById('btn-student');
const btnInstructor = document.getElementById('btn-instructor');
const instructorFields = document.querySelectorAll('.instructor-only');

function setRole(role) {
  const isInstructor = role === 'instructor';

  btnStudent.classList.toggle('active', !isInstructor);
  btnInstructor.classList.toggle('active', isInstructor);

  instructorFields.forEach(function(el) {
    el.classList.toggle('visible', isInstructor);
  });
}

btnStudent.addEventListener('click', function() { setRole('student'); });
btnInstructor.addEventListener('click', function() { setRole('instructor'); });


/* ── PASSWORD TOGGLE ─────────────────────────────────────── */
const passwordInput = document.getElementById('password');
const togglePwBtn   = document.getElementById('toggle-pw-btn');
const eyeIcon       = document.getElementById('eye-icon');

const EYE_OPEN = `
  <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke="currentColor" stroke-width="1.6"/>
  <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/>
`;

const EYE_CLOSED = `
  <path d="M1 1l18 18M7.5 7.6A4.5 4.5 0 0115 12M4.2 4.3C2.4 5.8 1 8 1 10s3.5 7 9 7a10.3 10.3 0 005.8-1.8"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M10 5.5a4.5 4.5 0 014.3 5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
`;

function togglePassword() {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type   = isHidden ? 'text' : 'password';
  eyeIcon.innerHTML    = isHidden ? EYE_CLOSED : EYE_OPEN;
}

togglePwBtn.addEventListener('click', togglePassword);


/* ── CLEAR ERROR ON INPUT ────────────────────────────────── */
document.querySelectorAll('.form-input, .form-select').forEach(function(el) {
  el.addEventListener('input', function() {
    el.classList.remove('error');
  });
  el.addEventListener('change', function() {
    el.classList.remove('error');
  });
});


/* ── FORM VALIDATION & SUBMIT ────────────────────────────── */
const form      = document.getElementById('signup-form');
const btnSubmit = document.getElementById('btn-submit');
const agreeBox  = document.getElementById('agree');

function getRequiredFields() {
  const isInstructor = btnInstructor.classList.contains('active');

  const fields = [
    document.getElementById('first-name'),
    document.getElementById('last-name'),
    document.getElementById('email'),
    document.getElementById('university'),
    document.getElementById('department'),
    document.getElementById('password'),
  ];

  if (isInstructor) {
    fields.push(document.getElementById('instructor-number'));
    fields.push(document.getElementById('academic-title'));
  }

  return fields;
}

function validateForm() {
  let valid = true;

  getRequiredFields().forEach(function(el) {
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    }
  });

  if (!agreeBox.checked) {
    agreeBox.style.outline = '2px solid #ef4444';
    agreeBox.style.outlineOffset = '2px';
    valid = false;
  } else {
    agreeBox.style.outline = '';
    agreeBox.style.outlineOffset = '';
  }

  return valid;
}

agreeBox.addEventListener('change', function() {
  if (agreeBox.checked) {
    agreeBox.style.outline = '';
    agreeBox.style.outlineOffset = '';
  }
});

form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!validateForm()) return;

  btnSubmit.textContent = '✓ Account Created!';
  btnSubmit.classList.add('success');
  btnSubmit.disabled = true;
});
document.getElementById("btn-submit").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "instructor_home.html";
});