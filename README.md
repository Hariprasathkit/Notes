# Papertrail Notes

A small, full-stack notes manager for capturing and organizing ideas. The React dashboard talks to an Express REST API, and MongoDB stores notes durably so they survive server restarts.

## Features

- Create, edit, view, search, and delete notes.
- Search titles and note content without case sensitivity.
- Responsive note grid, debounced search, character counters, loading/error/empty states, and success feedback.
- Input validation on both the client and server, plus consistent JSON API errors.
- MongoDB persistence with creation and update timestamps.

## Technology

- **Frontend:** React 18, Vite, JavaScript, Axios, Lucide React, plain CSS.
- **Backend:** Node.js, Express, Mongoose, MongoDB, dotenv, cors.
- **Tests:** Node's built-in test runner, Supertest, and an in-memory MongoDB instance.

## Project structure

```text
notes-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/noteService.js
│   │   ├── styles/global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── config/db.js
│   ├── controllers/noteController.js
│   ├── middleware/errorHandler.js
│   ├── models/Note.js
│   ├── routes/noteRoutes.js
│   ├── test/noteApi.test.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18 or later and npm.
- MongoDB Community Server running locally, or a MongoDB connection URI.

## Installation

Open two terminals in the project root.

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

In the second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
```

Update the environment files for your setup if needed. Do not commit `.env` files.

### Environment variables

`backend/.env`:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/notes_app
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

`FRONTEND_URL` controls the browser origin accepted by the API's CORS configuration. For a deployed frontend, set it to that exact origin.

`frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Vite reads `VITE_` variables at build time. Restart its dev server after changing the file.

### Start MongoDB

For a local MongoDB installation, start the MongoDB service using your OS's service manager. For example, in an elevated PowerShell terminal on Windows:

```powershell
Start-Service MongoDB
```

The database and collection are created automatically when the API first writes a note. If your MongoDB service has a different name, use that service name or start `mongod` with your own configuration.

## Run the application

Backend terminal:

```powershell
cd backend
npm run dev
```

Frontend terminal:

```powershell
cd frontend
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The API is at `http://localhost:5000`; `GET /api/health` is a basic health check.

Production frontend build:

```powershell
cd frontend
npm run build
```

## REST API

All note routes are under `/api/notes`. Notes have `_id`, `title`, `content`, `createdAt`, and `updatedAt` fields.

| Method | Path | Description | Success |
|---|---|---|---|
| GET | `/api/notes` | List notes, newest first | `200` with an array |
| GET | `/api/notes?search=meeting` | Case-insensitive title/content search | `200` with an array |
| GET | `/api/notes/:id` | Read one note | `200` with a note |
| POST | `/api/notes` | Create a note | `201` with a note |
| PUT | `/api/notes/:id` | Update supplied title/content fields | `200` with a note |
| DELETE | `/api/notes/:id` | Delete a note | `204` with no body |

Create:

```powershell
curl.exe -X POST http://localhost:5000/api/notes `
  -H "Content-Type: application/json" `
  -d "{\"title\":\"Meeting notes\",\"content\":\"Follow up with the design team.\"}"
```

Update:

```powershell
curl.exe -X PUT http://localhost:5000/api/notes/NOTE_ID `
  -H "Content-Type: application/json" `
  -d "{\"title\":\"Updated meeting notes\"}"
```

Search:

```powershell
curl.exe "http://localhost:5000/api/notes?search=design"
```

Delete:

```powershell
curl.exe -i -X DELETE http://localhost:5000/api/notes/NOTE_ID
```

`title` is required and must contain non-whitespace characters; its maximum length is 100 characters. `content` is optional (defaults to an empty string) and has a 2,000-character maximum. PUT accepts one or both fields. Extra fields and invalid JSON are rejected. Invalid IDs return `400`; valid IDs for missing notes return `404`.

Errors use a JSON object with an `error` field, for example:

```json
{ "error": "title is required" }
```

The API uses `400` for invalid input, `404` for missing routes or notes, `503` when MongoDB cannot be selected, and `500` for unexpected errors. In production, unexpected errors use a generic message; detailed errors are kept in server logs.

## Validation and tests

The backend validates request types, title/content limits, supported fields, and MongoDB ObjectIds before database operations. Mongoose schema validation is also enabled for writes. The frontend provides required-field feedback and browser-enforced character limits.

Run API tests (they start a temporary in-memory MongoDB and do not require a separate MongoDB service):

```powershell
cd backend
npm test
```

The API tests cover CRUD, newest-first ordering, case-insensitive search, title/content limits, malformed JSON, unsupported fields, invalid and missing IDs, and data surviving a disconnect/reconnect to the same database. Build the frontend with `cd frontend; npm run build`.

## Assumptions

- Notes are private to the single application and do not require user accounts or per-user authorization.
- The newest note is ordered by `createdAt`; `_id` is a stable tie-breaker.
- Updating an existing note may include only the fields being changed.
- The frontend and backend are deployed as separate origins; CORS allows the configured frontend origin.

## What I would improve with more time

- Add authentication and per-user access controls before exposing the app publicly.
- Add pagination for large note collections and an indexed search strategy for scale.
- Add browser-level end-to-end coverage and accessibility checks, including keyboard focus management for dialogs.
- Add deployment configuration, structured production logging, rate limiting, and operational health/readiness checks.
