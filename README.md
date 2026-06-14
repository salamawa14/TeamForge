# 🚀 TeamForge

**TeamForge** is a full-stack web application designed to simplify team collaboration and project management in academic or organizational environments. It provides an easy way for users to create and manage teams, assign tasks, handle requests, and track project activities through a user-friendly interface.

---

## 📌 Features

### 👥 Team Management
- Create and manage teams.
- Add or remove team members.
- View team details and member information.

### 📋 Task Management
- Create, edit, and delete tasks.
- Assign tasks to team members.
- Track task progress and status.

### 🔐 User Authentication
- Secure login and registration system.
- Session-based authentication.
- Role-based access for different types of users.

### 📨 Request & Approval System
- Submit team or collaboration requests.
- Approve or reject pending requests.
- Manage incoming and outgoing requests.

### 📊 Dashboard
- View project and team overview.
- Quick access to active tasks and requests.
- Centralized workspace for users.

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | PHP |
| **Database** | MySQL |
| **Containerization** | Docker, Docker Compose |
| **Database Management** | phpMyAdmin |

---

## 🏗️ Project Structure

```text
TeamForge/
│
├── frontend/                  # User interface
├── teamforge-backend/         # Backend application
│   ├── database/              # SQL database scripts
│   └── ...
├── Dockerfile                 # Docker image configuration
├── docker-compose.yml         # Multi-container setup
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Before running the project, make sure the following are installed:

- Docker
- Docker Compose
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/salamawa14/TeamForge.git
```

2. Navigate to the project directory:

```bash
cd TeamForge
```

3. Start the application using Docker:

```bash
docker compose up --build
```

4. Open your browser and navigate to the application (depending on your Docker configuration):

```text
http://localhost
```

5. If required, import the database using the SQL file located in:

```text
teamforge-backend/database/teamforge.sql
```

---

## 🗄️ Database

The project uses **MySQL** as the primary database. A ready-to-use SQL dump is included to simplify setup and deployment.

The database contains tables related to:
- Users
- Teams
- Team Membership
- Tasks
- Requests
- Authentication Data

---

## 🐳 Docker Support

TeamForge is fully containerized using Docker, making it easy to set up and run the application in a consistent environment.

To build and launch all services:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

---

## 📷 Screenshots

> **Note:** Screenshots of the application interface will be added soon.

Suggested screenshots:
- Login Page
- Dashboard
- Team Management
- Task Management
- Request Approval Interface

---

## 🎯 Future Improvements

- Email notifications.
- Real-time team chat.
- File attachment support.
- Advanced role and permission management.
- REST API documentation.
- Automated testing.

---

## 💡 Challenges & Learning Outcomes

During the development of TeamForge, the focus was on building a complete full-stack application while maintaining a clean project structure. The project provided hands-on experience with:
- Backend and frontend integration.
- Database design and management.
- Docker-based development environments.
- User authentication and session handling.
- Team collaboration workflows.

---

## 👨‍💻 Author

**Salam Alawa**  
Software Engineering Student

- GitHub: https://github.com/salamawa14

---

## 📄 License

This project is intended for educational and portfolio purposes. Feel free to explore, learn from, and build upon it.
