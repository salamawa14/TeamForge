# TeamForge Backend — Step-by-Step Setup Guide

---

## STEP 1 — Install & Start XAMPP

1. Download XAMPP from https://www.apachefriends.org
2. Install it (default path: C:\xampp on Windows)
3. Open the **XAMPP Control Panel**
4. Click **Start** next to **Apache**
5. Click **Start** next to **MySQL**
6. Both should turn green ✅

---

## STEP 2 — Copy the Backend into XAMPP

1. Open File Explorer and go to:
   ```
   C:\xampp\htdocs\
   ```
2. Create a new folder called `teamforge-backend`
3. Copy ALL the files from this zip into that folder.
   Final structure should be:
   ```
   C:\xampp\htdocs\teamforge-backend\
   ├── .htaccess
   ├── config/
   │   └── db.php
   ├── helpers/
   │   └── response.php
   ├── middleware/
   │   └── auth.php
   ├── database/
   │   └── teamforge.sql
   ├── api/
   │   ├── auth/
   │   │   ├── login.php
   │   │   ├── logout.php
   │   │   ├── register.php
   │   │   ├── me.php
   │   │   └── change-password.php
   │   ├── students/
   │   │   ├── dashboard.php
   │   │   ├── profile.php
   │   │   ├── my-projects.php
   │   │   ├── applications.php
   │   │   └── find-advisor.php
   │   ├── instructors/
   │   │   ├── dashboard.php
   │   │   ├── profile.php
   │   │   ├── advisees.php
   │   │   ├── advisor-requests.php
   │   │   └── availability.php
   │   ├── admin/
   │   │   ├── dashboard.php
   │   │   ├── users.php
   │   │   ├── categories.php
   │   │   └── announcements.php
   │   ├── projects/
   │   │   ├── index.php
   │   │   └── detail.php
   │   ├── announcements/
   │   │   └── index.php
   │   └── notifications/
   │       └── index.php
   └── assets/
       └── js/
           └── api.js
   ```

---

## STEP 3 — Create the Database

1. Open your browser and go to:
   ```
   http://localhost/phpmyadmin
   ```
2. Click **"New"** in the left sidebar to create a new database
   - Name it: `teamforge`
   - Click **Create**
3. Click on the `teamforge` database in the left sidebar
4. Click the **SQL** tab at the top
5. Open the file `database/teamforge.sql` in Notepad
6. Copy ALL the contents and paste into the SQL box in phpMyAdmin
7. Click **Go** to run it
8. You should see green checkmarks for every table ✅

   Tables created:
   - users
   - student_profiles
   - instructor_profiles
   - project_categories
   - projects
   - team_memberships
   - join_requests
   - advisor_requests
   - announcements
   - notifications

---

## STEP 4 — Copy the Frontend into XAMPP

1. Go to:
   ```
   C:\xampp\htdocs\
   ```
2. Create a folder called `teamforge`
3. Copy the entire `frontend` folder from your TeamForge project into it.
   Result:
   ```
   C:\xampp\htdocs\teamforge\frontend\
   ```
4. Copy `assets/js/api.js` from the backend into your frontend:
   ```
   C:\xampp\htdocs\teamforge\frontend\assets\js\api.js
   ```

---

## STEP 5 — Add api.js to Every HTML Page

Open EACH HTML file and add this line inside `<head>` or just before `</body>`,
BEFORE your existing JS files:

```html
<script src="../../assets/js/api.js"></script>
```

Adjust the `../../` path depending on folder depth.

Examples:
- For files in `frontend/student/`:      `../../assets/js/api.js`
- For files in `frontend/instructor/`:   `../../assets/js/api.js`
- For files in `frontend/admin/`:        `../../assets/js/api.js`
- For files in `frontend/auth/`:         `../assets/js/api.js`
- For files in `frontend/1HOME1/`:       `../assets/js/api.js`

---

## STEP 6 — Update Your Existing JS Files

For each page, find the JS file it uses and connect it to the backend.
Use the examples in `assets/js/login-example.js` and `assets/js/dashboard-example.js`
as templates.

### The pattern is always the same:

```javascript
document.addEventListener('DOMContentLoaded', async () => {

    // 1. Protect the page (redirects to login if not logged in)
    const user = await requireLogin(['student']);  // or 'instructor' or 'admin'

    // 2. Load data from backend
    const data = await Student.dashboard();  // or whatever function matches the page

    // 3. Render the data into your existing HTML elements
    document.getElementById('some-element').textContent = data.someField;
});
```

### Page-by-page mapping:

| HTML Page                    | Backend function to call         |
|------------------------------|----------------------------------|
| auth/login.html              | Auth.login(email, password)      |
| auth/register.html (if any)  | Auth.register(data)              |
| student/dashboard.html       | Student.dashboard()              |
| student/My-Profile.html      | Student.getProfile()             |
| student/My-Projects.html     | Student.myProjects()             |
| student/Browse-Projects.html | Projects.browse()                |
| student/Create-Project.html  | Projects.create(data)            |
| student/Find-Advisor.html    | Student.findAdvisors()           |
| student/Applications.html    | Student.myApplications()         |
| student/Announcements.html   | Announcements.getAll()           |
| instructor/dashboard.html    | Instructor.dashboard()           |
| instructor/profile.html      | Instructor.getProfile()          |
| instructor/advisees.html     | Instructor.advisees()            |
| instructor/advisor_req.html  | Instructor.getRequests()         |
| instructor/set_avail.html    | Instructor.getAvailability()     |
| instructor/notification.html | Notifications.getAll()           |
| admin/dashboard.html         | Admin.dashboard()                |
| admin/announcements.html     | Admin.getAnnouncements()         |
| admin/categories.html        | Admin.getCategories()            |

---

## STEP 7 — Update login.js

This is the most important one. Open your existing `assets/js/login.js`.

Find where it handles the form submit and replace the logic with:

```javascript
try {
    const user = await Auth.login(email, password);

    if (user.role === 'student') {
        window.location.href = '../student/dashboard.html';
    } else if (user.role === 'instructor') {
        window.location.href = '../instructor/dashboard_insructor.html';
    } else if (user.role === 'admin') {
        window.location.href = '../admin/dashboard.html';
    }
} catch (err) {
    // Show the error message in your existing error element
    document.getElementById('error-msg').textContent = err.message;
}
```

Also add a `<p id="error-msg" style="color:red;"></p>` to your login.html
if you don't have one already.

---

## STEP 8 — Add Logout to Every Page

Find the logout button in each HTML page and add:

```javascript
document.getElementById('logout-btn').addEventListener('click', async () => {
    await Auth.logout();
    window.location.href = '/teamforge/frontend/auth/login.html';
});
```

---

## STEP 9 — Test Everything

Open your browser and test these URLs:

```
http://localhost/teamforge-backend/api/auth/login.php
```
(POST with { "email": "admin@teamforge.com", "password": "admin123" })

You can use a browser extension like **Talend API Tester** or **Thunder Client** (VS Code)
to test API endpoints before connecting the frontend.

**Default admin login:**
- Email: admin@teamforge.com
- Password: admin123
- ⚠️ Change this password immediately after first login!

---

## STEP 10 — Common Problems & Fixes

### "Access denied" or blank page
- Make sure Apache and MySQL are running in XAMPP Control Panel

### "Database connection failed"
- Open `config/db.php` and confirm DB_NAME is `teamforge`, DB_USER is `root`, DB_PASS is `""`

### "CORS error" in browser console
- Make sure `helpers/response.php` is included at the top of every API file
- Check that `api.js` uses `http://localhost` (not `127.0.0.1`)

### Session not persisting
- Make sure all fetch calls use `credentials: 'include'` — api.js does this automatically

### 404 on API files
- Double-check the folder is at `C:\xampp\htdocs\teamforge-backend\`
- Verify Apache is started in XAMPP

---

## API Reference Summary

| Method | URL                                           | What it does                   |
|--------|-----------------------------------------------|--------------------------------|
| POST   | /api/auth/login.php                           | Login                          |
| POST   | /api/auth/register.php                        | Register student               |
| POST   | /api/auth/logout.php                          | Logout                         |
| GET    | /api/auth/me.php                              | Get current user               |
| PUT    | /api/auth/change-password.php                 | Change password                |
| GET    | /api/students/dashboard.php                   | Student dashboard stats        |
| GET    | /api/students/profile.php                     | Get student profile            |
| PUT    | /api/students/profile.php                     | Update student profile         |
| GET    | /api/students/my-projects.php                 | Student's own/joined projects  |
| GET    | /api/students/applications.php                | My sent applications           |
| GET    | /api/students/applications.php?incoming=1     | Applications to my projects    |
| POST   | /api/students/applications.php                | Apply to a project             |
| PUT    | /api/students/applications.php?...            | Accept/reject application      |
| GET    | /api/students/find-advisor.php                | List active advisors           |
| POST   | /api/students/find-advisor.php                | Send advisor request           |
| GET    | /api/projects/index.php                       | Browse all projects            |
| POST   | /api/projects/index.php                       | Create project                 |
| GET    | /api/projects/detail.php?project_id=xxx       | Get single project             |
| PUT    | /api/projects/detail.php?project_id=xxx       | Update project                 |
| DELETE | /api/projects/detail.php?project_id=xxx       | Delete project                 |
| GET    | /api/instructors/dashboard.php                | Instructor dashboard           |
| GET    | /api/instructors/profile.php                  | Get instructor profile         |
| PUT    | /api/instructors/profile.php                  | Update instructor profile      |
| GET    | /api/instructors/advisees.php                 | List advised projects+members  |
| GET    | /api/instructors/advisor-requests.php         | List advisor requests          |
| PUT    | /api/instructors/advisor-requests.php?...     | Accept/reject advisor request  |
| GET    | /api/instructors/availability.php             | Get advising status            |
| PUT    | /api/instructors/availability.php             | Set advising status            |
| GET    | /api/admin/dashboard.php                      | Admin platform stats           |
| GET    | /api/admin/users.php                          | List all users                 |
| POST   | /api/admin/users.php                          | Create instructor account      |
| DELETE | /api/admin/users.php?user_id=xxx              | Delete user                    |
| GET    | /api/admin/categories.php                     | List categories                |
| POST   | /api/admin/categories.php                     | Create category                |
| PUT    | /api/admin/categories.php?category_id=xxx     | Update category                |
| DELETE | /api/admin/categories.php?category_id=xxx     | Delete category                |
| GET    | /api/admin/announcements.php                  | List announcements (admin)     |
| POST   | /api/admin/announcements.php                  | Publish announcement           |
| PUT    | /api/admin/announcements.php?...              | Edit announcement              |
| DELETE | /api/admin/announcements.php?...              | Delete announcement            |
| GET    | /api/announcements/index.php                  | Read announcements (all roles) |
| GET    | /api/notifications/index.php                  | Get my notifications           |
| PUT    | /api/notifications/index.php?...              | Mark notification read         |
