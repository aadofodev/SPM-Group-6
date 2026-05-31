# UniMatch

A web-based academic collaboration platform that helps university students find study partners, book study rooms, track weekly study goals, and earn achievement badges.

## Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Frontend | React 18 + Vite, React Router   |
| Backend  | Node.js + Express, JWT auth     |
| Database | MongoDB Atlas (Mongoose)        |
| Testing  | Jest (backend unit tests)       |

---

## Features

| Story | Feature                  | Description                                                   |
|-------|--------------------------|---------------------------------------------------------------|
| US0   | Simulated Login          | JWT authentication with protected routes                      |
| US1   | Partner Matching         | Filter students by shared subjects and availability           |
| US2   | Preference Editing       | Update your profile and see matches refresh automatically     |
| US3   | Room Availability        | View all campus study rooms with live available/occupied status |
| US4   | Room Booking             | Book a room and invite a study partner in one step            |
| US7   | Weekly Goal Tracker      | Progress bar tracking study hours toward a 10-hour weekly target |
| US8   | Achievement Badges       | Five unlockable badges rewarding study milestones             |

---

## Prerequisites

- Node.js 18+
- npm
- A MongoDB Atlas connection string (ask a team member)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/aadofodev/SPM-Group-6.git
cd SPM-Group-6
```

### 2. Configure the backend environment

Create `backend/.env` with the following:

```
PORT=5001
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<any-long-random-string>
```

> Note: Port 5001 is used instead of 5000 because macOS AirPlay Receiver occupies 5000 by default.

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

This creates **5 test students** (all use password `password123`):

| Name       | Email         | Subjects                        |
|------------|---------------|---------------------------------|
| Alice Chen | alice@uni.edu | Maths, Physics, Computer Science |
| Bob Marley | bob@uni.edu   | CS, Statistics, Economics        |
| Clara Diaz | clara@uni.edu | Biology, Chemistry, Maths        |
| David Kim  | david@uni.edu | Physics, CS, Statistics          |
| Eva Rossi  | eva@uni.edu   | Literature, Economics, Chemistry |

And **10 study rooms** across Library, Science Block, Engineering Hub, and Arts Centre.

> Re-running `seed.js` resets all rooms to available and clears all bookings.

### 5. Start the servers

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
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT verification middleware
│   │   ├── models/
│   │   │   ├── User.js              # User schema + gamificationData
│   │   │   ├── Room.js              # Room schema (name, capacity, status)
│   │   │   └── Booking.js           # Booking schema (room, bookedBy, invitedPartner)
│   │   ├── routes/
│   │   │   ├── auth.js              # POST /api/auth/login
│   │   │   ├── matches.js           # GET  /api/matches
│   │   │   ├── users.js             # GET/PUT /api/users/me
│   │   │   ├── rooms.js             # GET /api/rooms, POST /api/rooms/:id/book
│   │   │   ├── bookings.js          # GET /api/bookings/mine
│   │   │   └── sessions.js          # POST /api/sessions/log
│   │   ├── seed.js
│   │   └── server.js
│   └── __tests__/
│       ├── rooms.test.js
│       └── sessions.test.js
└── frontend/
    └── src/
        ├── components/
        │   ├── MatchCard.jsx
        │   ├── RoomCard.jsx          # Includes booking form + partner invite dropdown
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── DashboardPage.jsx     # Weekly Goal Tracker + match results
        │   ├── RoomsPage.jsx         # Room list + My Bookings
        │   └── ProfileSettingsPage.jsx  # Preferences + Badge Display
        └── App.jsx
```

---

## API Reference

All routes except `/api/auth/login` require:

```
Authorization: Bearer <token>
```

| Method | Path                        | Auth | Description                                      |
|--------|-----------------------------|------|--------------------------------------------------|
| POST   | /api/auth/login             | No   | Returns a signed JWT                             |
| GET    | /api/matches                | Yes  | List matching students (filter by subject/availability) |
| GET    | /api/users/me               | Yes  | Get current user profile + gamification data     |
| PUT    | /api/users/me/preferences   | Yes  | Update subjects and availability                 |
| GET    | /api/rooms                  | Yes  | List all study rooms with status                 |
| POST   | /api/rooms/:id/book         | Yes  | Book a room, optionally invite a study partner   |
| GET    | /api/bookings/mine          | Yes  | List all bookings (organised + invited)          |
| POST   | /api/sessions/log           | Yes  | Log a study session (must be > 30 minutes)       |

### Key endpoint details

**POST /api/rooms/:id/book**
```json
{
  "startTime": "2026-05-06T09:00:00",
  "endTime": "2026-05-06T11:00:00",
  "invitedPartnerEmail": "bob@uni.edu"
}
```
`invitedPartnerEmail` is optional. If omitted, the booking is created for the organiser only.

**POST /api/sessions/log**
```json
{ "durationMinutes": 60 }
```
Sessions of 30 minutes or fewer are rejected (anti-cheat). Valid sessions increment `totalHoursStudied`, `totalSessionsCompleted`, and `weeklyHours`. Badge conditions are evaluated after every log.

**GET /api/bookings/mine**

Returns bookings where the user is the organiser **or** the invited partner. Each booking includes a `role` field: `"organiser"` or `"invited"`.

---

## Gamification

### Weekly Goal Tracker
- Tracks `weeklyHours` toward a 10-hour weekly target
- Progress bar on the dashboard fills proportionally
- Resets automatically at the start of each new ISO calendar week
- Sessions under 30 minutes are rejected server-side

### Achievement Badges

| Badge            | Condition                          |
|------------------|------------------------------------|
| First Step       | Complete 1 session                 |
| Getting Serious  | Complete 5 sessions                |
| Top Studier      | Complete 10 sessions               |
| Marathon         | Study 10 total hours               |
| Consistent       | Study 5 hours in one week          |

---

## Running Tests

```bash
cd backend
npm test
```

5 Jest unit tests covering:
- Room booking (happy path + already occupied)
- Session logging (anti-cheat + gamification increment)

---

## Architecture

```
Browser (React + Vite)
        ↓  HTTP + Bearer JWT
Express API (Node.js · port 5001)
        ↓  Mongoose queries
MongoDB Atlas (cloud database)
```

JavaScript is used across the entire stack — frontend, backend, and database queries.
