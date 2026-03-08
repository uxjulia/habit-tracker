# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
# Install all dependencies (root runs npm workspaces)
npm install

# Run both client and server in dev mode
npm run dev

# Run only the server (with hot reload via tsx)
npm run dev --workspace=server

# Run only the client (Vite dev server)
npm run dev --workspace=client
```

### Database

All db commands must be run from the project root (they load `.env` via dotenv-cli):

```bash
npm run db:migrate --workspace=server   # Create/apply migrations (dev)
npm run db:deploy --workspace=server    # Apply migrations (production)
npm run db:studio --workspace=server    # Open Prisma Studio
npm run db:generate --workspace=server  # Regenerate Prisma client after schema changes
```

### Build & Production

```bash
npm run build        # Build both server (tsc) and client (tsc + vite build)
npm run start        # Start the production server
```

### Docker

```bash
docker compose up --build -d                        # Standard production deploy
docker compose --profile with-nginx up -d           # With nginx TLS termination
```

## Architecture

This is a **monorepo** with two npm workspaces: `client/` and `server/`. In production, the Express server serves the Vite-built static files from `client/dist/` and handles all API routes under `/api`.

### Server (`server/src/`)

Express + TypeScript app with a layered architecture:

- **`config/env.ts`** — validates and exports all env vars via zod
- **`lib/`** — singletons: `prisma.ts` (Prisma client), `jwt.ts` (sign/verify helpers)
- **`middleware/`** — `auth.ts` (JWT bearer token guard), `setupGuard.ts` (auto-creates user if `SETUP_USERNAME`/`SETUP_PASSWORD` env vars are set), `errorHandler.ts` (global error handler)
- **`routes/`** → **`controllers/`** → **`services/`** — standard layered pattern; services hold all business logic and DB access
- **`routes/index.ts`** — mounts `/auth`, `/habits`, `/entries` under `/api`

Database is SQLite via Prisma. Schema has three models: `User`, `Habit`, `HabitEntry`. Entries store `date` as a plain string (not DateTime).

### Client (`client/src/`)

React 18 + TypeScript SPA:

- **`api/`** — axios `client.ts` (base URL `/api`, attaches JWT from Zustand store, auto-logout on 401), individual modules per resource (`habits.ts`, `entries.ts`, `auth.ts`), `queryKeys.ts` for TanStack Query cache keys
- **`store/`** — Zustand stores: `authStore.ts` (JWT token, persisted to localStorage), `uiStore.ts` (dark/light theme, persisted)
- **`hooks/`** — TanStack Query hooks wrapping the API layer (`useHabits.ts`, `useEntries.ts`)
- **`pages/`** — `TodayPage`, `WeekPage`, `MonthPage`, `HabitsPage`, `LoginPage`, `SetupPage`
- **`components/`** — organized by domain: `calendar/`, `entries/`, `habits/`, `layout/`, `ui/`

Routing is in `App.tsx`. The `AuthGate` component checks for a JWT token; if absent, calls `GET /api/auth/status` to determine whether to redirect to `/setup` (first run) or `/login`.

### Auth Flow

1. On first run, no user exists in DB → `GET /api/auth/status` returns `{ setupRequired: true }` → redirect to `/setup`
2. User creates account at `/setup` → JWT returned → stored in Zustand (persisted)
3. All subsequent API calls attach `Authorization: Bearer <token>` header
4. 401 responses trigger automatic logout and redirect to `/login`

### Dev Proxying

In development, the Vite dev server (`localhost:5173`) and Express server (`localhost:3000`) run separately. The client uses `baseURL: '/api'` which relies on Vite's proxy config to forward to Express. In production, Express serves everything on port 3000.
