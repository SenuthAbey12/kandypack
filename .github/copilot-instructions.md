## Quick orientation for AI coding agents

This repo is a small monorepo containing a React frontend (root) and an Express + MySQL backend (`/backend`). Use the files below to understand structure, flows, and conventions before making changes.

- Frontend: root `package.json`, React app in `src/` (entry `src/index.js`, main routes in `src/App.js`). Uses React Router, Context providers (`context/*`) and `ProtectedRoute` for auth-protected pages.
- Backend: `backend/server.js` is the API entrypoint. DB access is centralized in `backend/config/database.js`. Routes live in `backend/routes/*.js` and are mounted under `/api/*`.

## Big-picture architecture

- Two separate Node projects (frontend + backend) with their own `package.json` and `node_modules`. Frontend runs on React (port 3000) and backend on Express (default port 5000).
- Data flow: frontend calls backend endpoints under `/api/*`. Backend uses a MySQL pool (`mysql2/promise`) via `backend/config/database.js`. Database mutations are tracked by `DatabaseTracker` hooks inside `database.query()`.
- Auth: JWT-based auth is used in the backend (see `backend/routes/auth.js`, `backend/config/requiredEnv.js` which enforces `JWT_SECRET`). Frontend protects routes using `Components/ProtectedRoute.js` and `context/AuthContext`.

## Developer workflows (commands you can use)

- Install (root):
  - `npm install` and `npm --prefix backend install` (root `package.json` has `postinstall` that installs backend deps automatically).
- Start dev (recommended):
  - `npm run dev` (this starts the backend dev server via PowerShell and the React dev server)
  - Or run separately: `npm --prefix backend run dev` and `npm start`
- Backend tasks:
  - `npm --prefix backend run start` — run production-style server
  - `npm --prefix backend run dev` — run with `nodemon`
  - `npm --prefix backend run test-db` — run database self-test script (`backend/scripts/test-db.js`)
  - `npm --prefix backend run init-db` — apply advanced schema scripts (`backend/scripts/setup-advanced-schema.js`)

## Important repository conventions and patterns

- Environment-first fail-fast: `backend/config/requiredEnv.js` exits the process if critical env vars are missing (DB_PASSWORD, JWT_SECRET, DB_*). Always create `backend/.env` from `.env.example` before starting backend.
- Central DB wrapper: All database work should prefer `backend/config/database.js` which exposes `query(sql, params)` and `getDB()` (pool). The `query` method auto-detects modifying SQL (INSERT/UPDATE/DELETE/ALTER/CREATE/DROP) and triggers `DatabaseTracker.triggerUpdate(...)` — keep this when refactoring.
- Routes mount under `/api/*` in `server.js`. Portal-specific routes are namespaced under `/api/portal/*` (see `portalAuth`, `driverAPI`, `assistantAPI`).
- Frontend strict-mode noise: React 18 `StrictMode` may double-invoke some effects during development; duplicate queries in dev are expected (mentioned in `README.md`).

## Integration points and external dependencies

- MySQL (mysql2), configured in `backend/config/database.js` using env vars. DB schema scripts are in `backend/scripts/*.js` and `backend/setup_database.sql`.
- JWT auth (`jsonwebtoken`) and password hashing (`bcryptjs`) used in backend auth routes.
- Frontend uses axios for API calls; expect base URL to be `http://localhost:5000/api` in development (FRONTEND_URL in `.env` controls CORS).

## Where to make changes for common tasks (examples)

- Add a new API route: create `backend/routes/myFeature.js`, export an Express router, and mount it in `backend/server.js` with `app.use('/api/myfeature', myFeatureRoutes)`.
- Add a DB helper: prefer adding methods in `backend/config/database.js` or a new module under `backend/utils/` that uses `module.exports.getDB()` when you need low-level pool.execute.
- Add a protected frontend page: add a new component under `src/pages/`, add route in `src/App.js` and wrap with `<ProtectedRoute>` if it requires auth.

## Safety and testing notes for automated edits

- Do not commit secrets; `.env` is intentionally excluded. Use `.env.example` as template.
- When changing SQL or migrations, run `npm --prefix backend run test-db` and consider `init-db` scripts. Changing `database.query()` behavior requires updating `DatabaseTracker` usages.

## Files to inspect first when debugging

- `backend/server.js` — middleware, route mounts, healthcheck, error handling
- `backend/config/database.js` — pool configuration, query() behavior, DB-tracker hooks
- `backend/config/requiredEnv.js` — required env vars and process exit behavior
- `backend/scripts/*` — DB setup and test scripts
- `src/App.js` and `src/index.js` — routing, providers, and global CSS imports
- `README.md` and `ARCHITECTURE.md` — high-level instructions and notes (start here)

If anything here is unclear or you want more coverage (tests, CI, or examples), tell me which area to expand and I'll iterate.
