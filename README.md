# Task & Issue Management API

A simple REST API for managing tasks and issues. Built with Node.js, Express, and PostgreSQL. Users can sign up, log in, and manage issues based on their role.

**Live:** https://task-issue-management-server.vercel.app/

---

## Features

- JWT auth with access & refresh tokens
- Role-based access — `contributor` and `maintainer`
- Full CRUD for issues
- Issue types: `bug` or `feature_request`
- Status flow: `open` → `in_progress` → `resolved`
- PostgreSQL with auto table creation on startup

---

## Tech Stack

- Node.js + Express v5
- TypeScript
- PostgreSQL via `pg`
- JWT + bcryptjs
- Deployed on Vercel

---

## Setup

1. Clone and install:
   ```bash
   git clone <repo-url>
   cd N_Assignment-2
   npm install
   ```

2. Create a `.env` file:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   ACCESS_TOKEN_SECRET=your_access_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   NODE_ENV=development
   ```

3. Dev mode:
   ```bash
   npm run dev
   ```

4. Production:
   ```bash
   npm run build
   npm start
   ```

---

## API Endpoints

### Auth — `/api/auth`

- `POST /signup` — register a new user
- `POST /login` — login and get tokens
- `POST /refresh-token` — get a new access token

### Issues — `/api/issues`

- `POST /` — create an issue _(contributor or maintainer)_
- `GET /` — get all issues _(public)_
- `GET /:id` — get a single issue _(public)_
- `PATCH /:id` — update an issue _(contributor or maintainer)_
- `DELETE /:id` — delete an issue _(maintainer only)_

---

## Database Schema

### users
- `id` — primary key, auto increment
- `name` — required
- `email` — unique, required
- `password` — hashed
- `role` — either `contributor` or `maintainer` (default: `contributor`)
- `created_at`, `updated_at` — auto timestamps

### issues
- `id` — primary key, auto increment
- `title` — max 150 characters
- `description` — min 20 characters
- `type` — `bug` or `feature_request`
- `status` — `open`, `in_progress`, or `resolved` (default: `open`)
- `reporter_id` — references the user who created it
- `created_at`, `updated_at` — auto timestamps
