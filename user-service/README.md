# DevBattle — User Microservice

Production-ready **User Microservice** for the DevBattle platform.

> **Architecture boundary:** This service **does NOT authenticate users**. It never
> issues JWTs, stores passwords, or performs login/registration. Authentication is the
> sole responsibility of the **Auth Service**. This service **only verifies the JWT**
> (issued by the Auth Service) and manages user information.

---

## ✨ Features

- Full user profile CRUD (read own, read/list others with role gating)
- Profile update: bio, skills, education, experience, social links, personal details
- Avatar upload & delete (Multer + Supabase Storage, with local-disk fallback)
- Automatic **profile-completion** scoring (0–100)
- Search / filter / sort / paginate users (by name, email, role, college, branch, batch)
- User statistics (totals, role breakdown, active vs inactive)
- Block / activate, delete, and role updates (admin only)
- JWT **verification only** (`authenticate` + `authorize(role)` + `requirePermissions`)
- Zod validation for body / params / query / headers
- Swagger / OpenAPI docs, Morgan + Winston logging, Helmet, CORS, rate limiting
- Drizzle ORM + PostgreSQL, with generated migrations
- Jest + Supertest unit & integration tests
- Docker + Docker Compose with healthchecks

---

## 🧱 Architecture (Clean / Layered)

```
Controller  →  Service  →  Repository  →  Database (Drizzle/PostgreSQL)
```

| Layer         | Responsibility                                   |
| ------------- | ------------------------------------------------ |
| **Controller**| Request/response mapping only                    |
| **Service**   | Business logic (profile completion, rules)       |
| **Repository**| Database queries only (Drizzle)                  |
| **Database**  | PostgreSQL via Drizzle ORM                       |

Dependency injection is used (the service depends on an `IUserRepository` interface),
which keeps business logic unit-testable with a mocked repository.

---

## 📁 Folder Structure

```
user-service/
├── src/
│   ├── config/            # Typed env configuration
│   ├── constants/         # Roles, permissions, HTTP status, messages
│   ├── controllers/       # Request/response only
│   ├── services/          # Business logic
│   ├── repositories/      # Drizzle DB queries
│   ├── routes/            # Express routers (user + internal)
│   ├── middlewares/       # auth, authorize, validate, error, async
│   ├── validations/       # Zod schemas
│   ├── models/            # (domain types live in types/)
│   ├── database/          # Drizzle client, schema, migrate, seed
│   ├── utils/             # response, error, logger, pagination, jwt, fileUpload
│   ├── types/             # Domain types + Express augmentation
│   ├── docs/              # OpenAPI component & path definitions
│   ├── swagger/           # Swagger spec builder
│   ├── app.ts             # Express app factory (importable by tests)
│   └── server.ts          # Bootstrap + graceful shutdown
├── drizzle/               # Generated SQL migrations
├── tests/                 # unit/ + integration/
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.18
- PostgreSQL ≥ 16 (or Supabase)
- npm

### 1. Install

```bash
cd user-service
npm install
```

### 2. Configure

```bash
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET (MUST match the Auth Service), INTERNAL_API_KEY, etc.
```

> The `JWT_SECRET` (or `JWT_PUBLIC_KEY` for RS256) **must be shared with the Auth
> Service** so this service can verify the tokens it issues.

### 3. Database

```bash
npm run db:generate   # regenerate SQL migrations from schema (optional)
npm run db:migrate    # apply migrations to PostgreSQL
npm run db:seed       # insert demo users (admin, student, mentor)
```

### 4. Run

```bash
npm run dev           # ts-node-dev with hot reload
# or
npm run build && npm start
```

The service listens on `http://localhost:4001`.

- Health: `GET http://localhost:4001/api/v1/health`
- Swagger UI: `http://localhost:4001/api-docs`
- OpenAPI JSON: `http://localhost:4001/api-docs.json`

---

## 🔐 Authentication Model

```
Client → Auth Service (login) → JWT
Client → User Service: Authorization: Bearer <JWT>
User Service → verifyToken(JWT) → req.user = { id: auth_user_id, role, permissions }
```

The `authenticate` middleware:

1. Reads `Authorization: Bearer <token>`.
2. Verifies the signature (HS256 shared secret, or RS256/ES256 public key).
3. Validates `issuer` / `audience`.
4. Attaches `{ id, role, permissions }` to `req.user`.

Endpoints enforce access via `authorize(...roles)` or `requirePermissions(...perms)`:

| Role    | Can                                                              |
| ------- | ---------------------------------------------------------------- |
| Student | Read/update own profile, upload/delete own avatar               |
| Mentor  | Own profile + view/search/list users (read-only)                |
| Admin   | Everything: block/activate, delete, role update, statistics     |

---

## 📡 API Endpoints

Base path: `/api/v1`

| Method | Path                        | Access        | Description                          |
| ------ | --------------------------- | ------------- | ------------------------------------ |
| GET    | `/health`                   | Public        | Health check                         |
| GET    | `/users/me`                 | Authenticated | Get own profile                      |
| PUT    | `/users/me`                 | Authenticated | Update own profile                   |
| POST   | `/users/avatar`             | Authenticated | Upload avatar (multipart, `avatar`)  |
| DELETE | `/users/avatar`             | Authenticated | Remove avatar                         |
| GET    | `/users/search`             | Mentor/Admin  | Search & filter users                |
| GET    | `/users/statistics`         | Admin         | Aggregate statistics                 |
| GET    | `/users`                    | Mentor/Admin  | List users (paginated)               |
| GET    | `/users/:id`                | Mentor/Admin  | Get a user by internal id            |
| PATCH  | `/users/:id/status`         | Admin         | Activate / deactivate (block)        |
| PATCH  | `/users/:id/role`           | Admin         | Update role                          |
| DELETE | `/users/:id`                | Admin         | Delete user                          |

### Internal (Auth Service → User Service)

| Method | Path               | Auth                     | Description                              |
| ------ | ------------------ | ------------------------ | ---------------------------------------- |
| POST   | `/internal/users` | `x-internal-api-key`     | Provision a user profile on account creation |

---

## 📦 Response Format

**Success**

```json
{ "success": true, "message": "...", "data": { } }
```

**Failure**

```json
{ "success": false, "message": "...", "errors": [ { "path": "email", "message": "invalid" } ] }
```

---

## 🗄️ Database Schema

Tables (Drizzle, PostgreSQL):

- `users` — id (UUID PK), `auth_user_id` (UUID UNIQUE, FK to Auth Service), names, email,
  phone, avatar, bio, gender, dob, role, college/branch/batch ids, `profile_completion`,
  `is_active`, timestamps. Indexes on `auth_user_id`, `email`, `role`, `college_id`, `is_active`.
- `social_links` — one-to-one per user (github, linkedin, portfolio, leetcode, codeforces, hackerrank)
- `skills` — many per user (name, level)
- `education` — many per user (college, branch, degree, years)
- `experience` — many per user (company, designation, dates, description)

All child tables use `ON DELETE CASCADE` to the `users` table.

---

## 🐳 Docker

```bash
# Build & run the service + PostgreSQL (from ./user-service)
docker compose up --build

# Or from repo root (builds ./user-service)
docker compose up --build
```

Apply migrations inside the container:

```bash
docker compose exec user-service npm run db:migrate
docker compose exec user-service npm run db:seed
```

---

## 🧪 Testing

```bash
npm test                # all tests
npm run test:unit       # unit only
npm run test:integration# integration (requires DATABASE_URL)
```

Unit tests need no database. Integration tests that touch PostgreSQL are **skipped
automatically** when `DATABASE_URL` is unreachable, so `npm test` always runs green
in CI without a live DB. To run the DB-backed suite locally, point `DATABASE_URL` at a
running PostgreSQL and apply migrations first.

---

## 🔧 Scripts

| Script             | Purpose                                |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Hot-reload dev server                  |
| `npm run build`    | Compile TypeScript → `dist/`          |
| `npm start`        | Run compiled service                   |
| `npm run typecheck`| `tsc --noEmit`                         |
| `npm run lint`     | ESLint                                 |
| `npm run db:generate` | Generate Drizzle migration         |
| `npm run db:migrate`  | Apply migrations                     |
| `npm run db:seed`     | Seed demo users                     |

---

## 🛡️ Security

Helmet, CORS (configurable origins), compression, cookie-parser, express-rate-limit,
centralised error handling, Zod input validation (no raw SQL — Drizzle parameterised
queries prevent injection), and secret management via environment variables.

---

## 📄 License

Internal use — DevBattle platform.
