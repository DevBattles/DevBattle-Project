# DevBattle

Coding battle platform for college students — contests, homework, AI reviews and
a coding workspace. This repository contains the platform UI and the backend
microservices.

## Repository layout

```
.
├── docker-compose.yml     # PostgreSQL + all microservices
├── frontend/              # React + Vite + TypeScript UI (student / mentor / admin)
├── user-service/          # User profiles, avatars, skills, education (port 4001)
└── question-service/      # Question bank, test cases, bookmarks (port 4002)
```

Planned/related services (not yet in this repo): auth-service (JWT issuance,
login/registration), contest-service, homework-service, submission/judge-service,
AI review service.

## Architecture

```
┌─────────────┐   JWT (issued by Auth Service, verified by every service)
│  Frontend   │───────────────┐
│  (Vite/React)               │
└─────────────┘               ▼
                    ┌─────────────────────┐
                    │  API Gateway / BFF  │  (planned)
                    └──────┬──────┬───────┘
                           │      │
                ┌──────────▼──┐ ┌─▼───────────────┐
                │ user-service│ │ question-service│
                │   :4001     │ │   :4002         │
                └──────────┬──┘ └─┬───────────────┘
                           │      │
                    ┌──────▼──────▼──┐
                    │   PostgreSQL   │
                    └────────────────┘
```

- **Auth Service** (planned) is the source of truth for identities; it issues
  JWTs that every other service verifies. User and question services only
  verify tokens and never store passwords.
- **Service-to-service** calls use an internal API key
  (`x-internal-api-key`) — e.g. the future Judge Service will fetch full
  question payloads (hidden test cases included) and record attempt stats.

## Quick start

```bash
docker compose up --build      # PostgreSQL + user-service + question-service
cd frontend && npm i && npm run dev   # UI at http://localhost:5173
```

Each microservice exposes:

- Swagger UI: `http://localhost:<port>/api-docs`
- Health check: `http://localhost:<port>/api/v1/health`

See `user-service/README.md` and `question-service/README.md` for full details.
