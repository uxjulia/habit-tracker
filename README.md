# Habit Tracker

A self-hosted habit tracking web app. Track anything — meals, workouts, laundry — with weekly and monthly calendar views, color-coded habits, and optional time + notes for each log entry.

## Quick Start

### Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env to set a strong JWT_SECRET

# 3. Run the database migration (run from project root)
npm run db:migrate --workspace=server

# 4. Start both server and client
npm run dev
```

- Client: http://localhost:5173
- Server API: http://localhost:3000/api

On first visit, you'll be taken to `/setup` to create your account.

### Production (Docker)

```bash
# 1. Create a .env file with a secure JWT_SECRET
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env

# 2. Review and update the docker-compose.yml file if needed

#3 Build and start up the app
docker compose up --build -d

# 3. Open http://localhost:3000
# First visit routes to /setup — create your account there
```

The SQLite database is persisted in a Docker volume (`habit-data`).

**Skip the web setup wizard (set credentials via env):**

```yaml
# In docker-compose.yml environment section:
SETUP_USERNAME: admin
SETUP_PASSWORD: your-secure-password
```

## Features

- **Today view** — see all habits, log with one tap, edit/delete entries
- **Weekly view** — habit rows × day columns grid, colored dots per entry
- **Monthly view** — calendar with colored dot clusters per day
- **Habit management** — create, edit, archive, drag-to-reorder habits
- **Custom colors** — 10 preset swatches + custom color picker per habit
- **Optional emoji** — add an emoji to each habit
- **Time + notes** — optional when logging an entry
- **PWA** — installable on iOS/Android home screen
- **Dark/light mode** — dark by default, toggle in sidebar
- **Single-user auth** — JWT-based, first-run wizard to create your account

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: SQLite
- **Deployment**: Docker + docker-compose

## Environment Variables

| Variable         | Required | Default | Description                                          |
| ---------------- | -------- | ------- | ---------------------------------------------------- |
| `JWT_SECRET`     | Yes      | —       | Secret for signing JWTs. Use a long random string.   |
| `JWT_EXPIRES_IN` | No       | `30d`   | Token expiry                                         |
| `DATABASE_URL`   | Yes      | —       | SQLite path, e.g. `file:/data/habits.db`             |
| `PORT`           | No       | `3000`  | Server port                                          |
| `SETUP_USERNAME` | No       | —       | Skip web wizard: auto-create user with this username |
| `SETUP_PASSWORD` | No       | —       | Skip web wizard: auto-create user with this password |
