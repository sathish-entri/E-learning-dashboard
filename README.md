# 🎓 EduLearn — Full-Stack E-Learning Dashboard

> A modern, real-time educational platform for students, educators, and coordinators with built-in live class support, assignment management, and progress tracking.

**Live Frontend:** https://e-learning-dashboard-theta.vercel.app  
**Live Backend API:** https://elearning-backend-ap.onrender.com/api  
**Frontend Repository:** https://github.com/sathish-entri/E-learning-dashboard  
**Backend Repository:** https://github.com/sathish-entri/E-Learning-dashboard-server  

---

## 📋 Table of Contents

1. [Project Purpose & Overview](#1-project-purpose--overview)
2. [Who Benefits from This App](#2-who-benefits-from-this-app)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Core Features](#5-core-features)
6. [How It Works](#6-how-it-works)
7. [User Roles & Step-by-Step Usage Guide](#7-user-roles--step-by-step-usage-guide)
   - [Coordinator](#71-coordinator-role)
   - [Educator](#72-educator-role)
   - [Learner](#73-learner-role)
8. [API Reference](#8-api-reference)
9. [Environment Variables](#9-environment-variables)
10. [Local Development Setup](#10-local-development-setup)
11. [Deployment Guide](#11-deployment-guide)
12. [Security Implementation](#12-security-implementation)

---

## 1. Project Purpose & Overview

**EduLearn** is a full-stack, production-ready educational platform designed to bridge the gap between traditional classroom learning and modern digital education. The platform provides a structured, role-based environment where institutions can manage courses, educators can teach live classes and publish assignments, and learners can track their progress — all within a single unified dashboard.

The core mission of this project is to:
- Replace fragmented communication (WhatsApp, email, separate video apps) with one unified learning workspace.
- Enable real-time, interactive live classes directly in the browser without any third-party app installation.
- Provide rich analytics and progress visibility to all stakeholders.

---

## 2. Who Benefits from This App

| Audience | Benefit |
| :--- | :--- |
| **Private Coaching Institutes** | Manage multiple courses and classrooms under one platform. |
| **Schools & Colleges** | Replace physical notice boards and manual assignments with a digital system. |
| **Independent Educators** | Host live classes, publish assignments, and grade students without needing Zoom or Google Classroom separately. |
| **Students / Learners** | Get notified instantly, access study material, submit assignments, and join live sessions from one place. |
| **Administrators / Coordinators** | Full top-level visibility into courses, educators, and learner registrations. |

---

## 3. Technology Stack

### 🎨 Frontend
| Technology | Purpose |
| :--- | :--- |
| **React 18** | Core UI framework for building component-based interfaces. |
| **Vite** | Lightning-fast build tool and development server (replaces CRA). |
| **React Router v6** | Client-side routing and role-based navigation. |
| **Axios** | HTTP client for API calls with automatic JWT token injection. |
| **Socket.io Client** | Real-time notifications and live class chat. |
| **@daily-co/daily-js** | Embedded HD video call frames for live classes. |
| **Lucide React** | Modern icon library. |
| **React Hot Toast** | Premium toast notification system. |
| **Vanilla CSS** | Custom premium design system with CSS variables, glassmorphism, and animations. |

### ⚙️ Backend
| Technology | Purpose |
| :--- | :--- |
| **Node.js** | JavaScript runtime for server execution. |
| **Express.js** | Web framework for building RESTful APIs. |
| **Socket.io** | Real-time bi-directional communication (live class events, chat, notifications). |
| **MongoDB + Mongoose** | NoSQL database with schema-based modeling. |
| **JSON Web Tokens (JWT)** | Access token (15 min) + Refresh token (7 day) authentication. |
| **Cloudinary** | Cloud-based storage for images and assignment file uploads. |
| **Daily.co REST API** | Programmatic creation of secure, temporary video meeting rooms. |
| **Helmet** | HTTP security headers middleware. |
| **express-rate-limit** | API rate limiting to prevent DDoS attacks. |
| **express-mongo-sanitize** | Prevents NoSQL injection attacks. |
| **bcrypt** | Password hashing for secure credential storage. |
| **multer-storage-cloudinary** | File upload middleware that streams directly to Cloudinary. |

### 🏗️ Infrastructure
| Service | Purpose |
| :--- | :--- |
| **MongoDB Atlas** | Fully managed cloud database. |
| **Cloudinary** | Cloud storage for media files. |
| **Render.com** | Backend server hosting (supports persistent WebSocket connections). |
| **Vercel** | Frontend static hosting with global CDN edge network. |
| **Daily.co** | Video infrastructure (STUN/TURN servers for WebRTC). |
| **GitHub** | Version control and deployment trigger (CI/CD). |

---

## 4. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                       │
│                 React + Vite Application                   │
│   Login │ Dashboards │ Live Room │ Courses │ Assignments   │
└──────────────────┬───────────────────────────────────────┘
                   │  HTTPS REST API Calls
                   │  WebSocket (Socket.io) Connection
                   ▼
┌──────────────────────────────────────────────────────────┐
│                  Render.com (Backend)                      │
│               Node.js + Express API Server                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Auth Routes│  │  REST Routes │  │ Socket.io Server│   │
│  │  /api/auth  │  │  /api/...    │  │ Live Events    │   │
│  └─────────────┘  └──────────────┘  └────────────────┘   │
└──────────┬──────────────────────┬────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────┐    ┌─────────────────────┐
│  MongoDB Atlas   │    │  Third-Party APIs   │
│  (Cloud Database)│    │  ┌───────────────┐  │
│  - Users        │    │  │ Cloudinary CDN │  │
│  - Courses      │    │  │ (File Storage) │  │
│  - Classrooms   │    │  └───────────────┘  │
│  - Assignments  │    │  ┌───────────────┐  │
│  - LiveSessions │    │  │  Daily.co API  │  │
│  - Notifications│    │  │ (Video Rooms)  │  │
│  - Progress     │    │  └───────────────┘  │
└─────────────────┘    └─────────────────────┘
```

---

## 5. Core Features

### 🔐 Authentication & Security
- Role-based JWT authentication (`coordinator`, `educator`, `learner`).
- Automatic access token refresh on expiry (silent, no re-login required).
- Passwords hashed with bcrypt.
- Rate limiting: 100 requests / 15 min per IP.
- HTTP security headers via Helmet.
- NoSQL injection prevention.

### 🏛️ Coordinator Portal
- Platform-wide overview statistics (total courses, educators, learners).
- Full course management: Create, read, update, and delete courses with thumbnail image uploads.
- View directory of all registered educators.
- View directory of all registered learners.

### 👨‍🏫 Educator Console
- Create and manage multiple virtual classrooms.
- Publish study plan topics with resource links.
- Publish assignments with due dates and maximum marks.
- Invite and enroll students into classrooms.
- View all student submissions for an assignment.
- Grade submissions with score and written feedback.
- Start a live class session with one click.

### 🎒 Learner Portal
- View all enrolled classrooms with visual progress bars.
- Browse the full platform course catalog.
- Access classroom study plan materials.
- Upload and submit assignment files directly from the dashboard.
- View awarded grades and teacher feedback.
- Receive real-time push notifications when a live class starts.
- Join active live streaming sessions.

### 🔴 Live Class System
- Educator starts a class → Daily.co API creates a unique, secure, temporary video room.
- All enrolled students receive a live browser notification via Socket.io instantly.
- Students join the same embedded HD video room without leaving the platform.
- A real-time chat panel runs alongside the video via Socket.io room events.
- Educator can end the session for all participants with one button.
- If Daily.co quota is exceeded, the system automatically falls back to a free Jitsi Meet room.

### 🔔 Notification Center
- Real-time in-app notifications for: live class alerts, new assignments, grade releases, and announcements.
- Mark individual notifications or all as read.
- Notification dropdown in the top bar with live unread count badge.

---

## 6. How It Works

### Authentication Flow
```
User submits Login form
       │
       ▼
Backend verifies email + bcrypt password
       │
       ├── ✅ Success: Generate Access Token (15m) + Refresh Token (7d)
       │          Store Refresh Token in MongoDB
       │          Return both tokens to frontend
       │
       ▼
Frontend stores tokens in localStorage
       │
       ▼
Axios interceptor attaches Bearer token to every API request
       │
       ├── Token valid → API responds normally
       │
       └── Token expired (401) → Axios auto-sends Refresh Token
                                  Backend issues new Access Token
                                  Request is retried silently
```

### Live Class Flow
```
Educator clicks "Start Live Class"
       │
       ▼
Backend POST /api/live/start/:classroomId
       │
       ├── DAILY_API_KEY present? → POST to Daily.co API → Get unique Room URL
       │
       └── No key / API error? → Generate free Jitsi Meet Room URL (fallback)
       │
       ▼
Save LiveSession document to MongoDB
Mark Classroom as isLive = true
Create Notification records for all students
       │
       ▼
Socket.io emits "live:notification" to all enrolled student sockets
       │
       ├── Students receive browser toast notification with "Join Now" button
       │
       ▼
Student clicks Join → GET /api/live/:sessionId
Frontend mounts @daily-co/daily-js callFrame
Socket.io room chat enabled
       │
       ▼
Educator clicks "End Session for All"
Socket.io emits "live:ended" to all participants
All participants are redirected back to their dashboards
```

### File Upload Flow
```
User selects a file (assignment / profile pic / course thumbnail)
       │
       ▼
Frontend sends multipart/form-data via Axios
       │
       ▼
Backend multer-storage-cloudinary middleware
streams file directly to Cloudinary cloud
       │
       ▼
Cloudinary returns a permanent secure CDN URL
       │
       ▼
Backend saves CDN URL to the relevant MongoDB document
Returns URL to frontend for immediate display
```

---

## 7. User Roles & Step-by-Step Usage Guide

### 7.1 Coordinator Role

The coordinator is the **top-level administrator** of the platform. They set up courses and monitor the ecosystem of educators and students.

**Step 1 — Register / Login**
- Visit the platform and click **Create Account**.
- Select the **Coordinator** role card.
- Fill in your name, email, and password and submit.

**Step 2 — Manage Courses**
- From the left sidebar, click **Courses**.
- Click **Add New Course** and fill in the title, description, category, difficulty level, duration, and optional thumbnail image.
- Courses will appear on the Learner course catalog once published.
- You can **Edit** or **Delete** any course at any time.

**Step 3 — Manage Educators**
- Click **Educators** in the sidebar.
- View the full directory of registered educator accounts, their contact details, and registration dates.

**Step 4 — Manage Learners**
- Click **Learners** in the sidebar.
- View the full directory of all registered student accounts and their status.

**Step 5 — Monitor Dashboard Overview**
- Return to the main **Dashboard** at any time to see real-time statistics: total courses, educator count, and learner count.

---

### 7.2 Educator Role

The educator is a **teaching professional** who manages classrooms, teaches live, publishes assignments, and grades student work.

**Step 1 — Register / Login**
- Visit the platform and click **Create Account**.
- Select the **Educator** role card.
- Fill in your name, email, and password and submit.

**Step 2 — Create a Classroom**
- From your dashboard, click **Create Classroom**.
- Fill in the class name, subject, description, and weekly schedule.
- Click **Create Class** to submit.

**Step 3 — Enroll Students**
- Click on any classroom card from your dashboard to open it.
- Click the **Students** tab.
- Click **Add Students** to see a list of all registered learners.
- Click the **Add** button next to each student you want to enroll.

**Step 4 — Publish Study Plan**
- Inside the classroom, click the **Study Plan** tab.
- Click **Add Topic** and fill in the topic name, description, and an optional resource/link URL.
- Repeat for each module or lesson topic.

**Step 5 — Publish an Assignment**
- Click the **Assignments** tab inside a classroom.
- Click **Publish Assignment** and fill in the title, instructions, maximum marks, and due date.
- Click **Publish**. All enrolled students are notified immediately.

**Step 6 — Grade Student Submissions**
- Click the **Assignments** tab.
- Click **View Submissions** next to any published assignment.
- The view switches to the **Grading Panel** tab showing all student submissions.
- Click a student's submission file to review it, then click **Evaluate** to open the grading form.
- Enter the score and written feedback, then click **Save Assessment**.

**Step 7 — Start a Live Class**
- Open any classroom.
- Click the red **Start Live Class** button in the top header.
- All enrolled students instantly receive a live toast notification.
- Your HD video room opens embedded inside the dashboard with a live chat panel.
- When done, click **End Session for All** to close the room for everyone.

---

### 7.3 Learner Role

The learner is a **student** who joins classrooms, accesses study material, submits assignments, and attends live classes.

**Step 1 — Register / Login**
- Visit the platform and click **Create Account**.
- Select the **Learner** role card.
- Fill in your name, email, and password and submit.

**Step 2 — View Your Dashboard**
- Your dashboard shows all enrolled classrooms with progress bars, active live class alerts, and assignment statistics.
- If a live class is currently active, a **red banner** appears at the top with a **Join Now** button.

**Step 3 — Enter a Classroom**
- Click any enrolled classroom card.
- The classroom opens with three tabs: **Study Plan**, **Assignments**, and **Classmates**.

**Step 4 — Access Study Material**
- Click the **Study Plan** tab to browse all topics uploaded by your educator.
- Click on resource links to access slides, videos, or reading materials.

**Step 5 — Submit an Assignment**
- Click the **Assignments** tab.
- For each active assignment, click **Choose File** to select your work file from your computer.
- Click **Submit Project** to upload it to the cloud.
- Once your educator grades it, you will see your score and feedback displayed here.

**Step 6 — Join a Live Class**
- When your educator starts a live class, a red toast notification appears on your screen.
- Click **Join Now** in the notification or go to **Live Sessions** in the sidebar.
- The HD video call opens inside the dashboard with a real-time chat panel.

**Step 7 — Browse the Course Catalog**
- Click **Courses** in the left sidebar to browse all published courses across the platform.
- Use the search bar to filter by title or category.

**Step 8 — Manage Your Profile**
- Click **Profile** in the sidebar.
- Update your name, bio, and mobile number.
- Upload a new profile photo by clicking **Upload New Photo**.

---

## 8. API Reference

| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Create a new user account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT tokens |
| `POST` | `/api/auth/refresh` | Public | Refresh expired access token |
| `GET` | `/api/auth/me` | All | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | All | Update profile details & photo |
| `GET` | `/api/coordinator/stats` | Coordinator | Platform-wide statistics |
| `GET/POST/PUT/DELETE` | `/api/coordinator/courses` | Coordinator | Full course CRUD |
| `GET` | `/api/coordinator/educators` | Coordinator | List all educators |
| `GET` | `/api/coordinator/learners` | Coordinator | List all learners |
| `GET` | `/api/educator/stats` | Educator | Educator dashboard stats |
| `GET/POST` | `/api/educator/classrooms` | Educator | List & create classrooms |
| `POST` | `/api/educator/classrooms/:id/students` | Educator | Enroll a student |
| `GET/POST` | `/api/educator/classrooms/:id/studyplan` | Educator | Study plan management |
| `GET/POST` | `/api/educator/classrooms/:id/assignments` | Educator | Assignment management |
| `GET` | `/api/educator/assignments/:id/submissions` | Educator | View all submissions |
| `POST` | `/api/educator/submissions/:id/marks` | Educator | Grade a submission |
| `GET` | `/api/learner/stats` | Learner | Learner dashboard stats |
| `GET` | `/api/learner/classrooms` | Learner | View enrolled classrooms |
| `GET` | `/api/learner/classrooms/:id/classwork` | Learner | Get class study plan & assignments |
| `POST` | `/api/learner/assignments/:id/submit` | Learner | Upload assignment submission |
| `GET` | `/api/learner/courses` | Learner | Browse course catalog |
| `POST` | `/api/live/start/:classroomId` | Educator | Start a live session |
| `POST` | `/api/live/end/:sessionId` | Educator | End a live session |
| `GET` | `/api/live/:sessionId` | All | Get live session info |
| `GET` | `/api/live/active` | Learner | Get active sessions for user |
| `GET` | `/api/notifications` | All | Get user notifications |
| `PUT` | `/api/notifications/:id/read` | All | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | All | Mark all notifications read |

---

## 9. Environment Variables

### Backend (`.env`)
```env
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/elearning

# Authentication
JWT_ACCESS_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=o6iwbwgi
CLOUDINARY_API_KEY=687747344126962
CLOUDINARY_API_SECRET=<your-api-secret>

# Daily.co (Live Video)
DAILY_API_KEY=<your-daily-api-key>

# CORS (Frontend Origins)
CLIENT_ORIGIN=http://localhost:5173
CLIENT_ORIGIN_PROD=https://e-learning-dashboard-theta.vercel.app
```

### Frontend (`.env`)
```env
VITE_API_URL=https://elearning-backend-ap.onrender.com/api
VITE_SOCKET_URL=https://elearning-backend-ap.onrender.com
```

---

## 10. Local Development Setup

### Prerequisites
- Node.js v18+
- npm v8+
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone the Repositories
```bash
# Clone backend
git clone https://github.com/sathish-entri/E-Learning-dashboard-server.git
cd E-Learning-dashboard-server
npm install

# Clone frontend (new terminal)
git clone https://github.com/sathish-entri/E-learning-dashboard.git
cd E-learning-dashboard
npm install
```

### Step 2: Configure Environment Files
Copy and fill in the `.env` files for both repos as shown in Section 9.

### Step 3: Run the Servers
```bash
# Backend (inside E-Learning-dashboard-server/)
npm start
# Runs on http://localhost:4000

# Frontend (inside E-learning-dashboard/)
npm run dev
# Runs on http://localhost:5173
```

---

## 11. Deployment Guide

| Step | Action |
| :--- | :--- |
| 1 | Push both repositories to GitHub (already done). |
| 2 | Create a **Web Service** on Render.com from the backend repository. |
| 3 | Add all backend environment variables in Render's Environment tab. |
| 4 | Import the frontend repository on Vercel. |
| 5 | Add `VITE_API_URL` and `VITE_SOCKET_URL` env vars on Vercel. |
| 6 | After Vercel deployment, copy the live URL. |
| 7 | Go back to Render and update `CLIENT_ORIGIN` and `CLIENT_ORIGIN_PROD` to the Vercel URL. |
| 8 | Your full-stack application is now live! |

---

## 12. Security Implementation

| Layer | Implementation |
| :--- | :--- |
| **Authentication** | JWT Access + Refresh token rotation. Tokens validated on every protected route. |
| **Password Storage** | bcrypt with cost factor 12. Passwords never stored in plain text. |
| **API Rate Limiting** | Max 100 requests per 15 minutes per IP to prevent abuse. |
| **HTTP Headers** | Helmet middleware sets 15+ security response headers (XSS, CSRF protection). |
| **NoSQL Injection** | express-mongo-sanitize strips `$` and `.` from request bodies and params. |
| **CORS Protection** | Only whitelisted frontend origins are allowed to call the API. |
| **File Upload Safety** | File uploads go directly to Cloudinary. No files are stored on the server. |
| **Video Room Security** | Daily.co rooms expire automatically after 4 hours and are generated with unique names per session. |
| **Environment Secrets** | `.env` file is gitignored. All secrets are managed through hosting platform environment variable panels. |

---

*Built with ❤️ for modern digital education.*
