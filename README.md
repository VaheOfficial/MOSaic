# MOSaic (moz-a-i-ik) — POC

Single-unit AI-powered billet matching (mock data), designed to scale to inter-unit later.

## Quick start (Docker)
```bash
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
# backend on http://localhost:8000 (docs at /docs)
# frontend on http://localhost:3000
```
## Services
- **backend**: FastAPI + Postgres + SQLAlchemy
- **frontend**: Next.js (App Router, TypeScript)
- **db**: Postgres 15

## Dev (Docker, hot reload)
- Make: `make dev` (or `make dev-d` for detached)
- PowerShell: `./dev.ps1` (or `./dev.ps1 -Detach`)
- Bash: `./dev.sh`

## Dev (no Docker)
- Backend: `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload`
- Frontend: `cd frontend && npm i && npm run dev`

## Env
Edit `.env` / `.env.local` to include auth keys, DB URL, and OpenAI key (optional for POC).

## Structure
- `/backend/app/api` — endpoints (ingest, catalog, match, explain)
- `/backend/app/core` — config, db, parsing, scoring, optimization
- `/backend/app/models` — SQLAlchemy models
- `/frontend/app/*` — UI routes (surveys, upload SURF, roles, match)
- `/scripts` — helper scripts

