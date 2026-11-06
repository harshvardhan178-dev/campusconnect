# CampusConnect – Student Opportunity & Team Finder

> A modern, production-grade MERN Stack web application connecting college students with career opportunities, hackathons, academic project teammates, and verified portfolio showcases.

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node-4F46E5.svg)](https://react.dev)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React 18](https://img.shields.io/badge/React-v18.2-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.2-646CFF.svg)](https://vitejs.dev/)

---

## 1. Project Title
**CampusConnect – Student Opportunity & Team Finder**

---

## 2. Introduction
**CampusConnect** is a centralized collegiate networking and career discovery platform designed specifically for higher education students, tech club organizers, and campus recruiters. It bridges the critical divide between ambitious students seeking teammates for hackathons and academic capstone projects, organizers hosting competitive collegiate events, and students looking for internship opportunities.

---

## 3. Problem Statement
Many engineering and college students face three core challenges:
1. **Scattered Opportunities:** Internships, hackathons, coding contests, and workshops are fragmented across social media, flyers, and scattered websites, causing students to miss deadlines.
2. **Teammate Mismatch:** Students often have great project or hackathon ideas but struggle to find peers on campus who possess matching or complementary technical skills (e.g. an AI modeler needing a React frontend engineer).
3. **Lack of Verified Portfolio Exposure:** Traditional resumes fail to demonstrate actual coding capabilities, live demo links, and peer collaboration experience.

---

## 4. Project Objectives
- Provide a unified, real-time portal for finding curated tech opportunities (internships, hackathons, workshops).
- Eliminate teammate discovery hurdles through a dedicated **Team Recruitment Engine** with skill matching, open slot counters, and request approvals.
- Enable students to establish an online technical identity with verified skills, GitHub repositories, and live demo showcases.
- Equip event organizers with streamlined application management and candidate status tracking.
- Provide administrators with oversight through platform analytics, user moderation, and content safety controls.

---

## 5. Main Features & Functionalities

### Module 1: Authentication & User Profiles
- Secure user registration and login with bcrypt password hashing.
- Stateless session management using signed JSON Web Tokens (JWT).
- Role-based authorization: **Student**, **Opportunity Organizer**, and **Administrator**.
- Student profile customization: College name, degree, graduation year, technical skills, bio, GitHub link, and avatar.

### Module 2: Student Dashboard
- Dynamic welcome banner with personalized student details.
- Opportunity statistics, active recruitment alerts, and skill badges.
- Recommended opportunities feed filtered by active deadlines.
- Real-time project teams recruiting members.

### Module 3: Opportunity Discovery & Application Management
- Filter opportunities by category: `internship`, `hackathon`, `workshop`, `competition`.
- Search by opportunity title, organization name, or required skills.
- Direct student application submission with resume links, portfolio links, and statements of purpose.
- Organizer dashboard: post, update, and manage applicants with status tracking (`Applied`, `Under Review`, `Shortlisted`, `Accepted`, `Rejected`).

### Module 4: Project Team Finder (Core Module)
- Create project teams specifying project scope, open positions (2–10 members), and required technical skills.
- Automatic slot management: open position counters decrease as members are accepted.
- Candidates send join requests with personalized pitch messages.
- Leaders review incoming requests and accept or reject candidates with instant notifications.

### Module 5: Project Showcase
- Publish personal, open-source, or capstone projects.
- Include GitHub repository links, live deployment URLs, screenshots, and tech tags.
- Interactive community recognition via an instant like toggle.

### Module 6: Notification Inbox
- In-app notification alerts for received join requests, team decisions, and application status changes.
- Direct clickable links to the relevant team or opportunity details.
- Mark as read and mark all as read controls.

### Module 7: Admin Dashboard
- System analytics: total registered students, organizers, opportunities, teams, and projects.
- User management table with account suspension and restoration capabilities.
- Moderation tools to delete inappropriate opportunities, teams, or projects.

---

## 6. Technologies Used

### Frontend
- **React.js 18 (Vite):** Fast single-page application framework.
- **React Router DOM v6:** Client-side declarative routing and protected route guards.
- **Axios:** Centralized HTTP service with request/response interceptors for automatic JWT Bearer token handling.
- **Lucide React:** Modern, lightweight SVG iconography.
- **CSS3 Design System:** SaaS-grade design tokens (elevation, variables, custom responsive grids).

### Backend
- **Node.js & Express.js:** Fast, stateless REST API gateway.
- **JWT (jsonwebtoken):** Secure authentication tokens.
- **bcryptjs:** Salted password hashing (10 rounds).
- **Multer:** Multipart file upload handling for profile avatars and screenshots.
- **Morgan:** HTTP request logging for development monitoring.

### Database
- **MongoDB Atlas:** Cloud NoSQL database.
- **Mongoose ODM:** Strict schema validation, compound indexes, text search indexes, and referential integrity.

### Deployment & Tools
- **Vercel:** Frontend SPA deployment.
- **Render:** Backend API hosting.
- **VS Code & Git:** Version control and development workflow.

---

## 7. Folder Structure

```
campusconnect/
│
├── client/                           # React 18 Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                   # Static media assets
│   │   ├── components/               # Reusable UI components (Navbar, Sidebar, Footer, ProtectedRoute)
│   │   ├── context/                  # React Contexts (AuthContext, NotificationContext)
│   │   ├── layouts/                  # Layout wrappers (PublicLayout, DashboardLayout)
│   │   ├── pages/                    # 16 Full Application Page Views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   ├── OpportunitiesPage.jsx
│   │   │   ├── OpportunityDetailsPage.jsx
│   │   │   ├── CreateOpportunityPage.jsx
│   │   │   ├── TeamFinderPage.jsx
│   │   │   ├── TeamDetailsPage.jsx
│   │   │   ├── CreateTeamPage.jsx
│   │   │   ├── ProjectShowcasePage.jsx
│   │   │   ├── ProjectDetailsPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/                 # Centralized Axios Service Layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── opportunityService.js
│   │   │   ├── teamService.js
│   │   │   ├── projectService.js
│   │   │   ├── userService.js
│   │   │   ├── notificationService.js
│   │   │   └── adminService.js
│   │   ├── styles/
│   │   │   └── index.css             # SaaS Design System Tokens & Utility Classes
│   │   ├── App.jsx                   # Centralized Routing Hierarchy
│   │   └── main.jsx                  # Client React Bootstrap
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                   # Vercel SPA Rewrite Configuration
│   └── vite.config.js
│
├── server/                           # Express.js REST API Backend
│   ├── config/
│   │   └── db.js                     # MongoDB Atlas Connection
│   ├── controllers/                  # Route Controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── opportunityController.js
│   │   ├── teamController.js
│   │   ├── projectController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── exceptions/
│   │   └── ApiException.js           # Centralized Operational HTTP Exception Class
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT Verification & Role-Based Access Control
│   │   ├── errorMiddleware.js        # Global 404 & Centralized Error Handler
│   │   └── uploadMiddleware.js       # Multer File Upload Configuration
│   ├── models/                       # 7 Mongoose Schemas
│   │   ├── User.js
│   │   ├── Opportunity.js
│   │   ├── Application.js
│   │   ├── Team.js
│   │   ├── TeamRequest.js
│   │   ├── Project.js
│   │   └── Notification.js
│   ├── routes/                       # Express Route Endpoints
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── opportunityRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js          # JWT Token Signer
│   │   └── seedData.js               # Database Demo Data Seeder Script
│   ├── uploads/                      # Uploaded Profile Pictures & Screenshots
│   ├── .env.example
│   ├── app.js                        # Express App Middleware & Routes Mounting
│   ├── render.yaml                   # Render Cloud Deployment Blueprint
│   ├── server.js                     # HTTP Server Entry Point
│   └── package.json
│
├── presentation/
│   └── CampusConnect_Presentation.md # 8-Slide Project Pitch Deck
├── .gitignore
├── package.json                      # Monorepo Concurrently Script Runner
└── README.md
```

---

## 8. Database Design

### Mongoose Models & Relationships
- **User:** Stores profile information, hashed credentials, role (`student`, `organizer`, `admin`), skills list, and bookmarks.
- **Opportunity:** Contains organizer ObjectId reference, title, description, category, deadline, location, and required skills.
- **Application:** Links `Opportunity` and `User` (student). Includes a **compound unique index** on `{ opportunityId: 1, studentId: 1 }` preventing duplicate applications.
- **Team:** Created by a student leader, contains required skills, total and open positions, member ObjectId references, and recruitment status.
- **TeamRequest:** Links `Team` and `User`. Prevents duplicate requests via a compound unique index on `{ teamId: 1, studentId: 1 }`.
- **Project:** Stores student showcase submissions with repository and demo URLs, tech tags, and like counters.
- **Notification:** Real-time event notifications linking recipient, alert message, alert type, and read status.

---

## 9. API Documentation

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Public | Register new student or organizer |
| **POST** | `/auth/login` | Public | Authenticate user & return JWT |
| **GET** | `/auth/me` | Protected | Fetch authenticated user data |
| **GET** | `/users/profile/:id` | Public | Get public student profile & projects |
| **PUT** | `/users/profile` | Protected | Update profile, bio, skills, and links |
| **GET** | `/opportunities` | Public | Filter and search opportunities |
| **POST** | `/opportunities` | Organizer/Admin | Publish a new opportunity |
| **GET** | `/opportunities/:id` | Public | View opportunity details |
| **POST** | `/opportunities/:id/apply` | Student | Submit opportunity application |
| **GET** | `/teams` | Public | Browse project teams with skill filters |
| **POST** | `/teams` | Student | Create a team and open recruitment |
| **GET** | `/teams/:id` | Public | View team details & confirmed roster |
| **POST** | `/teams/:id/requests` | Student | Send team joining request |
| **PATCH**| `/requests/:id` | Team Leader | Accept or reject a candidate request |
| **GET** | `/projects` | Public | Browse student showcase projects |
| **POST** | `/projects` | Student | Publish a project to the showcase |
| **POST** | `/projects/:id/like` | Protected | Toggle like on a project |
| **GET** | `/notifications` | Protected | Fetch user notification inbox |
| **PATCH**| `/notifications/read-all`| Protected | Mark all notifications as read |
| **GET** | `/admin/metrics` | Admin | Fetch system analytics and health |
| **PATCH**| `/admin/users/:id/status`| Admin | Suspend or reactivate user account |

---

## 10. Installation Instructions

### Prerequisites
- [Node.js (v18 or v20 LTS)](https://nodejs.org)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### Step 1: Clone or Navigate to the Project
```bash
cd C:\Users\Shubham\.gemini\antigravity\scratch\campusconnect
```

### Step 2: Install All Dependencies
```bash
# Install root monorepo scripts
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## 11. Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect?retryWrites=true&w=majority
JWT_SECRET=campusconnect_super_secret_jwt_key_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 12. Execution Steps

### Step 1: Seed Demo Data (Optional but Recommended for Live Demos)
Populate sample students, organizers, hackathons, recruiting teams, and projects:
```bash
cd server
node utils/seedData.js
```
*Demo Logins Created:*
- **Student:** `student@campusconnect.edu` / `password123`
- **Organizer:** `organizer@campusconnect.edu` / `password123`
- **Admin:** `admin@campusconnect.edu` / `password123`

### Step 2: Run Application
From the project root:
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)
- **Frontend SPA:** `http://localhost:5173`

---

## 13. Deployment Instructions

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. Link the repository to [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
5. Deploy. `client/vercel.json` ensures all client-side routes redirect seamlessly.

### Backend Deployment (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node server.js`.
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `mongodb+srv://...`
   - `JWT_SECRET` = `your_strong_secret`
   - `CLIENT_URL` = `https://your-vercel-domain.vercel.app`

---

## 14. Screenshots & Visual Interface Highlights
- **Landing Hero Banner:** Visual pitch, verified stats counter, and CTA buttons.
- **Student Dashboard:** Responsive metric counters, personalized welcome banner, and real-time feeds.
- **Opportunity Hub:** Interactive search bar with instant filter pills for category and work mode.
- **Team Recruitment Board:** Live slot countdown badges, leader details, and joining request modals.
- **Project Showcase:** Dual-column cards with responsive image previews, tech badges, and GitHub links.
- **Admin Command Center:** System-wide metrics cards and user moderation tables.

---

## 15. Team Member Details & Responsibilities

| Team Member | Role | Core Deliverables |
| :--- | :--- | :--- |
| **Member 1** | Frontend Architect & UI/UX Designer | • React 18 SPA Architecture & Vite Configuration<br>• SaaS CSS3 Design System & Responsive Layouts<br>• 16 Complete Application Page Views<br>• Axios Service Layer Integration & Client State |
| **Member 2** | Backend API & Security Specialist | • Node.js & Express.js REST API Architecture<br>• JWT Authentication & Bcrypt Password Hashing<br>• Role-Based Access Control Middleware<br>• Centralized Exception Handling & Route Controllers |
| **Member 3** | Database Architect & DevOps Engineer | • MongoDB Atlas Cloud Integration<br>• 7 Mongoose Schemas with Compound Indexes<br>• Automated Demo Data Seeder (`seedData.js`)<br>• Vercel & Render Production Deployment Readiness |

---

© 2026 CampusConnect Team. Developed for College Evaluation, Placement Portfolios, and Live Technical Demonstrations.
