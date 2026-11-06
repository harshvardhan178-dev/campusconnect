# CampusConnect – Project Presentation Deck

A 8-slide presentation deck covering the architectural, functional, and deployment specifications of **CampusConnect – Student Opportunity & Team Finder**.

---

## Slide 1: Title & Executive Summary
- **Project Title:** CampusConnect – Student Opportunity & Team Finder
- **Tagline:** Empowering Collegiate Engineers to Discover Opportunities, Form Teams, and Showcase Real Software.
- **Technology Stack:** MongoDB Atlas, Express.js, React.js 18, Node.js (MERN)
- **Target Audience:** College Students, Hackathon Organizers, Campus Recruiters & Academic Evaluators
- **Presented By:** 
  - Member 1: Frontend Architect & UI/UX Designer
  - Member 2: Backend API Engineer & Security Specialist
  - Member 3: Database Architect & DevOps Engineer

---

## Slide 2: Problem Statement & Market Need
- **The Challenge:**
  1. **Fragmented Opportunities:** College students struggle to find verified internships, hackathons, and technical workshops scattered across disorganized social groups.
  2. **Teammate Mismatch:** Students often miss out on major hackathons and capstone projects because finding peers with matching or complementary technical skills (e.g. AI + React) is difficult.
  3. **Lack of Verified Portfolio Exposure:** Resumes lack interactive live project demos and peer credibility.
- **The Solution:** A unified collegiate networking ecosystem engineered specifically for opportunity discovery, team formation, and verified project showcasing.

---

## Slide 3: Core Value Proposition & System Features
- **1. Smart Opportunity Discovery:** Filter hackathons, internships, workshops, and coding challenges by tech stack, location (remote/hybrid), and deadlines.
- **2. Team Recruitment Engine:** Leaders create project requirements, declare open positions, review candidate pitches, and build teams with real-time membership updates.
- **3. Student Portfolio Showcase:** Interactive project showcase with direct GitHub repository links, live deployment URLs, and community endorsements.
- **4. In-App Notification Center:** Automated updates for joining requests, application decisions, and announcements.
- **5. Administrative Governance:** Analytics dashboard, user moderation, and content safety controls.

---

## Slide 4: System Architecture & Workflow
- **Frontend Layer:** React.js 18 SPA powered by Vite, React Router DOM v6, and centralized Axios HTTP client with automated JWT Bearer interceptors.
- **API Gateway Layer:** Express.js REST API with CORS policies, body parser, and centralized exception handlers (`ApiException`).
- **Authentication & Security:** Stateless JSON Web Tokens (JWT), bcrypt.js password hashing, and Role-Based Access Control (`student`, `organizer`, `admin`).
- **Database Layer:** MongoDB Atlas with Mongoose ODM enforcing schemas, compound indexes, and referential integrity.

---

## Slide 5: User Roles & Access Hierarchy
- **1. Student:**
  - Complete profile customization, skill tags, GitHub/LinkedIn links.
  - Search opportunities, submit applications with resume & SOP.
  - Form teams, review applicants, join peer teams, publish showcase projects.
- **2. Opportunity Organizer:**
  - Create and manage hackathon & internship postings.
  - Review applicant submissions, resumes, and update statuses (`Under Review`, `Shortlisted`, `Accepted`, `Rejected`).
- **3. Administrator:**
  - Access platform metrics (total users, active teams, opportunities, projects).
  - Suspend abusive accounts and moderate inappropriate posts.

---

## Slide 6: Database Design & Mongoose Entity Models
- **User:** Credentials, role, college, degree, graduation year, skills array, avatar, bio.
- **Opportunity:** Organizer reference, title, category, deadline, required skills, location, prize pool.
- **Application:** Unique compound index `{ opportunityId, studentId }` preventing duplicate submissions, resume link, SOP, status lifecycle.
- **Team:** Leader reference, required skills, total & open positions counter, members array, visibility.
- **TeamRequest:** Compound `{ teamId, studentId }`, pitch message, status (`pending`, `accepted`, `rejected`).
- **Project:** Owner reference, title, description, technologies, GitHub repo, live demo, likes array.
- **Notification:** Recipient reference, sender, alert type, link, read status.

---

## Slide 7: Security & Quality Assurance
- **Password Protection:** Irreversible 10-round bcrypt salt hashing before persistence.
- **JWT Protection:** Signed payload containing user ID and role with automatic 7-day expiration.
- **Zero Hardcoded Credentials:** 100% environment-driven configuration via `.env`.
- **Global Error Handling:** Custom `ApiException` class normalizing errors and preventing internal stack leakage in production.
- **Data Validation:** Strict schema validation with duplicate key prevention (`E11000`) and custom regex email checking.

---

## Slide 8: Deployment Architecture & Future Scope
- **Production Deployment:**
  - **Client (Frontend):** Vercel with single-page application rewrite routing rules (`vercel.json`).
  - **Server (Backend):** Render Web Service configured with automated Node.js environment buildpacks.
  - **Database:** MongoDB Atlas cloud cluster with automated IP whitelisting.
- **Future Enhancements:**
  - Real-time WebSockets / Socket.io team chat.
  - Automated AI-powered teammate recommendation engine using cosine skill similarity.
  - University Single Sign-On (SSO) email domain verification.
