# ApplyFlow — Job Application Tracker

A polished full-stack MERN application for tracking job applications, interviews, offers, and follow-up dates. Built as a portfolio project with React, Node.js, Express, and MongoDB.

## Features

- Dashboard summary cards and application pipeline
- Create, read, update, and delete job applications
- Search by company, role, or location
- Filter by application status and job type
- Track salary range, job URL, notes, applied date, and next-step date
- Upcoming follow-ups panel
- Responsive layout for desktop, tablet, and mobile
- Express REST API with Mongoose validation and consistent error responses
- MongoDB persistence

## Tech stack

- **Frontend:** React 18, Vite, Lucide React, CSS
- **Backend:** Node.js, Express 4
- **Database:** MongoDB, Mongoose
- **API:** REST / JSON

## Project structure

```text
job-application-tracker/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── models/
│       │   └── Application.js
│       └── routes/
│           └── applications.js
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Install:

- Node.js 20 or later (LTS recommended)
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas cluster
- Git

Check your installations:

```bash
node --version
npm --version
git --version
```

## Run locally

### 1. Configure MongoDB

**Option A — Local MongoDB:** Start your MongoDB service. The default connection is `mongodb://127.0.0.1:27017/job_tracker`.

**Option B — MongoDB Atlas:** Create a database and database user in Atlas. Copy the connection string, replace its username/password placeholders, and use it as `MONGODB_URI`. Do not commit credentials to GitHub.

### 2. Configure the backend

From the project root:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` if needed:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job_tracker
CLIENT_URL=http://localhost:5173
```

On Windows PowerShell, copy the example with:

```powershell
Copy-Item .env.example .env
```

Install dependencies and start the API:

```bash
npm install
npm run dev
```

Expected output includes `MongoDB connected` and `API running at http://localhost:5000`.

### 3. Start the frontend

Open a second terminal at the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL Vite prints, normally http://localhost:5173.

> Keep both terminals running while using the app. The API must connect to MongoDB before it starts listening.

## API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API health |
| GET | `/applications` | List applications; supports `search`, `status`, `jobType`, `page`, and `limit` query parameters |
| GET | `/applications/stats` | Status counts and recent applications |
| GET | `/applications/:id` | Get one application |
| POST | `/applications` | Create an application |
| PUT | `/applications/:id` | Update an application |
| DELETE | `/applications/:id` | Delete an application |

Example request body:

```json
{
  "company": "Acme Inc.",
  "role": "Frontend Developer",
  "location": "Bengaluru / Remote",
  "jobType": "Full-time",
  "status": "Applied",
  "salary": "₹8–12 LPA",
  "jobUrl": "https://example.com/jobs/frontend-developer",
  "appliedDate": "2026-10-28",
  "nextStepDate": "2026-11-04",
  "notes": "Follow up with the recruiter next week."
}
```

Allowed `status` values: `Applied`, `Interview`, `Offer`, `Rejected`, `Wishlist`.

Allowed `jobType` values: `Full-time`, `Part-time`, `Contract`, `Internship`, `Remote`.

## Troubleshooting

- **Network error in UI:** Ensure the backend is running on port 5000 and MongoDB is reachable.
- **MongoDB connection error:** Check that the local MongoDB service is running, or verify the Atlas connection string and network access settings.
- **CORS error:** Ensure `CLIENT_URL` matches the frontend URL, normally `http://localhost:5173`.
- **Port already in use:** Change `PORT` in `server/.env` or stop the process using that port.

## Security and scope notes

This portfolio version does not include login or user-specific data access. Do not deploy it with real personal data as a multi-user service until authentication, authorization, per-user ownership checks, production environment variables, and rate limiting are implemented.

## Roadmap ideas

- Authentication and per-user applications
- Kanban board with drag-and-drop status updates
- CSV export/import
- Interview reminders and email notifications
- Unit and API tests
- Deployment with a managed MongoDB database

## License

MIT — see `LICENSE` if you choose to add one before publishing.
