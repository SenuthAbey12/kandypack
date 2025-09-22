# KandyPack Architecture Overview

This repository is a full-stack project with a React frontend and an Express/MySQL backend in a nested folder structure.

## Top-level layout
- `src/` — React app source (components, pages, services, styles)
- `public/` — Static assets for the React app
- `backend/` — Node.js/Express API server and database code
- `build/` — Generated React production build (should not be committed)
- `.vscode/`, `.gitignore`, README files

## Why there are two node_modules folders
- Root `node_modules/`: dependencies for the React app defined in root `package.json` (React, React Router, Bootstrap, etc.)
- `backend/node_modules/`: dependencies for the Node/Express server defined in `backend/package.json` (Express, mysql2, dotenv, etc.)

This is intentional because the frontend and backend are separate Node projects with different dependencies and scripts.

## How to run (development)
- Install all dependencies:
  - Frontend: `npm install`
  - Backend: `npm --prefix backend install`
- Start both (Windows PowerShell):
  - One command (starts backend in a new PowerShell and frontend in current):
    - `npm run dev`
  - Or separately:
    - Backend: `npm --prefix backend run dev`
    - Frontend: `npm start`

## Backend structure
- `backend/server.js` — Express app setup, middleware, route mounting
- `backend/config/database.js` — MySQL connection pool and query helper
- `backend/routes/` — Route handlers (auth, customers, products, orders, admin, portal APIs, etc.)
- `backend/utils/` — Documentation tracking and helper utilities
- `backend/scripts/` — Maintenance scripts (DB setup, test-db)
- `backend/setup_database.sql` — Initial DB schema and seed
- `backend/database/portal_schema_update.sql` — Portal-oriented schema additions (see note)

## Database schema note
There are two schema files:
- `setup_database.sql` — Bootstrap core schema (admin, customer, driver, assistant, product, orders, etc.).
- `database/portal_schema_update.sql` — Adds portal-oriented tables (drivers/assistants plural, assignments, tickets, inventory) but currently conflicts with base naming and ID lengths.

Recommended: standardize on one model (extend existing `driver/assistant` tables or switch all code to `drivers/assistants`) and align ID lengths (`VARCHAR(40)` across FKs). See comments in PR for details.

## Common scripts
- Root `package.json`:
  - `npm run dev` — starts backend (dev) and frontend together
  - `npm start` — starts React dev server
  - `npm run server` — starts backend (prod mode)
  - `npm run server:dev` — starts backend with nodemon
- Backend `package.json`:
  - `npm run start` — `node server.js`
  - `npm run dev` — `nodemon server.js`
  - `npm run setup-db` — run DB setup script

## Production build
- Build frontend: `npm run build` (generates `build/`)
- Backend serves API only (no SSR). Host frontend via static host or proxy.

## Security and environment
- Do not commit `backend/.env`; use `backend/.env.example` as the template.
- Environment vars used: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `FRONTEND_URL`.
