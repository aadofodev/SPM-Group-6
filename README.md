# UniMatch

A web-based academic collaboration system for partner matching, study room availability, and preference management.

## Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 19 + Vite, React Router |
| Backend  | Node.js + Express 5           |
| Database | MongoDB (Mongoose)            |
| Auth     | JWT (jsonwebtoken + bcryptjs) |

---

## Prerequisites

- Node.js 18+
- npm

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd SPM-Group-6
```

### 2. Configure the backend environment

Create `backend/.env` with the following:

```
PORT=5001
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<any-long-random-string>
```

Ask a team member for the shared `MONGO_URI` and `JWT_SECRET` values.

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend (open a second terminal)
cd frontend && npm install
```

### 4. Seed the database

Run once to populate test users and study rooms:

```bash
cd backend
node src/seed.js
```

This creates:

**5 test students** (all use password `password123`)

| Name       | Email          |
|------------|----------------|
| Alice Chen | alice@uni.edu  |
| Bob Marley | bob@uni.edu    |
| Clara Diaz | clara@uni.edu  |
| David Kim  | david@uni.edu  |
| Eva Rossi  | eva@uni.edu    |

**10 study rooms** across Library, Science Block, Engineering Hub, and Arts Centre.

> Re-running `seed.js` wipes and re-creates all users and rooms. Any preference changes made through the UI will be reset.

### 5. Start the servers

Open two terminals and run one command in each:

```bash
# Terminal 1 — backend  →  http://localhost:5001
cd backend && npm run dev

# Terminal 2 — frontend →  http://localhost:5173
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with any seeded account.

---

## Project Structure

```
SPM-Group-6/
├── backend/
│   └── src/
│       ├── middleware/
│       │   └── auth.js           # JWT verification middleware
│       ├── models/
│       │   ├── User.js           # User schema (subjects, availability)
│       │   └── Room.js           # Room schema (capacity, status)
│       ├── routes/
│       │   ├── auth.js           # POST /api/auth/login
│       │   ├── matches.js        # GET  /api/matches
│       │   ├── rooms.js          # GET  /api/rooms
│       │   └── users.js          # GET/PUT /api/users/me
│       ├── seed.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── MatchCard.jsx
        │   ├── ProtectedRoute.jsx
        │   └── RoomCard.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── DashboardPage.jsx
        │   ├── LoginPage.jsx
        │   ├── ProfileSettingsPage.jsx
        │   └── RoomsPage.jsx
        └── App.jsx
```

---

## API Reference

All routes except `/api/auth/login` require the header:

```
Authorization: Bearer <token>
```

| Method | Path                      | Auth | Description                    |
|--------|---------------------------|------|--------------------------------|
| POST   | /api/auth/login           | No   | Returns a signed JWT           |
| GET    | /api/matches              | Yes  | List matching students         |
| GET    | /api/users/me             | Yes  | Get current user profile       |
| PUT    | /api/users/me/preferences | Yes  | Update subjects & availability |
| GET    | /api/rooms                | Yes  | List all study rooms           |

`GET /api/matches` accepts optional query params:

```
?subjects=Mathematics,Physics&availability=Mon+AM,Fri+AM
```

---

## Implemented User Stories

| Story | Feature            | Status |
|-------|--------------------|--------|
| US0   | Simulated Login    | ✅     |
| US1   | Partner Matching   | ✅     |
| US2   | Preference Editing | ✅     |
| US3   | Room Availability  | ✅     |
