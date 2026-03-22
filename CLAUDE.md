# Prelegal Project

A web application for generating legal agreement documents from CommonPaper templates.

## Project Status

### Completed

**PL-1 — Legal document template dataset**
- Downloaded all 12 CommonPaper markdown templates into `templates/`
- Created `catalog.json` at project root with name, description, and filename for each template
- Added `templates/LICENSE.txt` with CC BY 4.0 attribution notice

**PL-2 — Mutual NDA creator (Next.js prototype)**
- Next.js 15 app in `frontend/` with form + live preview + PDF save
- Form collects all NDA fields: purpose, effective date, MNDA term, term of confidentiality, governing law, jurisdiction, modifications, party 1 and party 2 details
- Preview renders the full NDA: filled cover page + standard terms with form values substituted inline
- Standard terms loaded from `frontend/public/Mutual-NDA.md` (static asset, works in all environments)
- "Save as PDF" triggers browser print (form panel hidden via `@media print`)

**Code review fixes (PR #5)**
- Fixed `blank(modifications) || "None."` — fallback was unreachable dead code
- Fixed inconsistent MNDA term text between cover page and standard terms for "continues until terminated" case
- Replaced blocking `readFileSync` API route with static file served from `frontend/public/`
- Added `r.ok` check in template fetch to surface HTTP errors correctly

**PL-3 — Build foundation of V1 product (PRs #6, #7 — in review)**
- Added FastAPI backend (`backend/`) with SQLite database and `/health` endpoint
- Added fake login page (`frontend/app/login/page.tsx`) — no auth, any credentials enter the platform
- Main page redirects to `/login` if not logged in (sessionStorage flag)
- Docker Compose setup (`docker-compose.yml`) with `start.ps1` / `stop.ps1` for Windows
- Dockerfiles for both frontend and backend
- pytest tests for health endpoint, verified passing in Docker (`docker-compose.test.yml`)

## Structure

```
prelegal/
  templates/          # CommonPaper markdown templates (CC BY 4.0)
  catalog.json        # Index of all templates with name, description, filename
  backend/            # FastAPI + SQLite
    main.py           # App entry point, /health endpoint
    database.py       # SQLite init and connection
    pyproject.toml    # Python dependencies (uv)
    Dockerfile
    tests/
      test_health.py  # pytest tests for /health
  frontend/           # Next.js app
    app/
      page.tsx        # Main page: form + NDA preview (auth-guarded)
      login/
        page.tsx      # Fake login page
      layout.tsx      # Root layout
      globals.css     # Tailwind + print styles
    public/
      Mutual-NDA.md   # Standard terms served as static asset
    Dockerfile
  docker-compose.yml      # Full stack (frontend + backend)
  docker-compose.test.yml # Backend tests only
  start.ps1               # Start all services via Docker Compose
  stop.ps1                # Stop all services
```

## Running the app

**Full stack (Docker Desktop required):**
```powershell
.\start.ps1       # builds and starts frontend + backend
.\stop.ps1        # tears down
```

**Dev mode (services individually):**
```powershell
# Terminal 1 — backend
cd backend
uv sync
uv run uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

**Run backend tests:**
```powershell
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

Open http://localhost:3000
