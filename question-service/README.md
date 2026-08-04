# DevBattle — Question Service

Question Microservice for the DevBattle platform. It owns the coding-battle
question bank:

- **Question authoring** — statements, difficulty, categories, tags, companies,
  technology labels, requirements and constraints
- **Starter code templates** for JavaScript, TypeScript, Python, Java and C++
- **Test cases** — sample (public) and hidden; hidden cases are only served to
  mentors/admins and to other services over the internal boundary
- **Publishing workflow** — questions start as `draft`, get `published`, and can
  be `archived`. Students can only ever see published questions
- **Bookmarks** — per-user bookmarking of questions
- **Statistics** — attempt/solve counters and acceptance rate, updated by the
  Judge Service over the internal API, plus admin analytics

Tech stack: **Node.js + Express + TypeScript + Drizzle ORM + PostgreSQL**,
mirroring the User Service so all DevBattle microservices share one architecture.

## Architecture

```
┌────────────┐   JWT (verify only)   ┌────────────────────┐
│ Auth       │──────────────────────▶│ Question Service   │
│ Service    │                       │  GET /api/v1/...   │
└────────────┘                       └─────────┬──────────┘
                                               │ x-internal-api-key
┌────────────┐   x-internal-api-key  ┌─────────▼──────────┐
│ Judge /    │──────────────────────▶│ /api/v1/internal/  │
│ Submission │  full payload + stats │ questions/:id      │
└────────────┘                       └────────────────────┘
```

- The Auth Service issues JWTs; this service **only verifies** them
  (`JWT_SECRET` shared secret or `JWT_PUBLIC_KEY` for RS256/ES256).
- Service-to-service calls must present `x-internal-api-key` and never require
  a user token.

## Getting started

```bash
npm install
cp .env.example .env        # adjust DATABASE_URL etc.
npm run db:migrate          # create tables (drizzle migrations)
npm run db:seed             # optional demo question bank
npm run dev                 # http://localhost:4002
```

- API base: `http://localhost:4002/api/v1`
- Swagger UI: `http://localhost:4002/api-docs`
- OpenAPI JSON: `http://localhost:4002/api-docs.json`

### Docker

```bash
docker compose up --build   # PostgreSQL + question-service
```

## API overview

All endpoints return the standard envelope `{ success, message, data }`.

| Method | Path                             | Access               | Description                                    |
| ------ | -------------------------------- | -------------------- | ---------------------------------------------- |
| GET    | `/api/v1/health`                 | public               | Health check                                   |
| GET    | `/api/v1/questions`              | any authenticated    | List (students: published only)                |
| GET    | `/api/v1/questions/bookmarks`    | any authenticated    | My bookmarked questions                        |
| GET    | `/api/v1/questions/statistics`   | admin                | Question bank analytics                        |
| GET    | `/api/v1/questions/:id`          | any authenticated    | Detail (hidden test cases stripped for students)|
| POST   | `/api/v1/questions`              | mentor/admin         | Create question (starts as `draft`)            |
| PUT    | `/api/v1/questions/:id`          | mentor/admin         | Update question + children                     |
| PATCH  | `/api/v1/questions/:id/status`   | mentor/admin         | `draft` / `published` / `archived`             |
| DELETE | `/api/v1/questions/:id`          | mentor/admin         | Delete question (children cascade)             |
| POST   | `/api/v1/questions/:id/bookmark` | any authenticated    | Toggle bookmark on                            |
| DELETE | `/api/v1/questions/:id/bookmark` | any authenticated    | Toggle bookmark off                            |
| GET    | `/api/v1/internal/questions/:id` | internal API key     | Full payload incl. hidden test cases           |
| POST   | `/api/v1/internal/questions/:id/stats` | internal API key | Record attempt/solve statistics            |

### Example: create a question

```bash
curl -X POST http://localhost:4002/api/v1/questions \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target...",
    "type": "dsa",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "tags": ["Hash Table"],
    "examples": [{ "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]" }],
    "starterCode": { "javascript": "function twoSum(nums, target) { ... }" },
    "testCases": [
      { "input": "[2,7,11,15]\\n9", "expectedOutput": "[0,1]", "isSample": true },
      { "input": "[-1,-2,-3]\\n-5", "expectedOutput": "[0,3]", "isHidden": true }
    ]
  }'
```

### Example: internal (Judge Service) stats recording

```bash
curl -X POST http://localhost:4002/api/v1/internal/questions/<id>/stats \
  -H "x-internal-api-key: $INTERNAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "attempted": true, "solved": true }'
```

## Data model

- `questions` — core question row (status, difficulty, limits, counters)
- `question_examples` — worked examples shown in the statement
- `question_starter_codes` — per-language starter templates
- `question_test_cases` — judge test cases (`is_hidden` controls visibility)
- `question_bookmarks` — user bookmarks (unique per user + question)

## Scripts

| Script               | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Hot-reload development server            |
| `npm run build`      | Compile TypeScript to `dist/`            |
| `npm start`          | Run compiled server                      |
| `npm run typecheck`  | TypeScript check without emitting        |
| `npm run lint`       | ESLint                                   |
| `npm run db:generate`| Generate migration from schema           |
| `npm run db:migrate` | Apply migrations                         |
| `npm run db:seed`    | Seed demo questions (`--reset` to wipe)  |
| `npm test`           | Unit + integration tests                 |

## Environment variables

See `.env.example`. Key ones:

| Variable           | Default                              | Description                          |
| ------------------ | ------------------------------------ | ------------------------------------ |
| `PORT`             | `4002`                               | HTTP port                            |
| `DATABASE_URL`     | `postgresql://...@localhost:5432/devbattle` | PostgreSQL connection       |
| `JWT_SECRET`       | dev secret                           | Shared HS256 secret (Auth Service)   |
| `JWT_PUBLIC_KEY`   | *(empty)*                            | PEM public key for RS256/ES256       |
| `JWT_ISSUER`       | `devbattle-auth-service`             | Expected token issuer                |
| `JWT_AUDIENCE`     | `devbattle-question-service`         | Expected token audience              |
| `INTERNAL_API_KEY` | dev token                            | Key for service-to-service calls     |
| `CORS_ORIGIN`      | `http://localhost:5173`              | Comma-separated allowed origins      |
