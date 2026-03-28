// ============================================================
//  EXAMPLE: How to update your existing login.js
//  Replace the contents of assets/js/login.js with this.
// ============================================================

// 1. Make sure api.js is included BEFORE login.js in login.html:
//    <script src="../assets/js/api.js"></script>
//    <script src="../assets/js/login.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    const form        = document.querySelector('form');
    const emailInput  = document.getElementById('email');      // adjust id if different
    const passInput   = document.getElementById('password');   // adjust id if different
    const errorMsg    = document.getElementById('error-msg');  // add this element to your HTML

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email    = emailInput.value.trim();
        const password = passInput.value.trim();

        if (!email || !password) {
            if (errorMsg) errorMsg.textContent = 'Please fill in all fields.';
            return;
        }

        try {
            const user = await Auth.login(email, password);

            // Redirect based on role
            if (user.role === 'student') {
                window.location.href = '../student/dashboard.html';
            } else if (user.role === 'instructor') {
                window.location.href = '../instructor/dashboard_insructor.html';
            } else if (user.role === 'admin') {
                window.location.href = '../admin/dashboard.html';
            }
        } catch (err) {
            if (errorMsg) errorMsg.textContent = err.message;
            else alert(err.message);
        }
    });
});
