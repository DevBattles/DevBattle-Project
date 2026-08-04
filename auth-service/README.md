# DevBattle Authentication Microservice

A production-ready, enterprise-grade authentication microservice built for the DevBattle platform. Implements JWT-based authentication with refresh token rotation, role-based access control, and comprehensive security measures.

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Docker](#docker)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Architecture

This service follows **Clean Architecture** and **Microservice Architecture** principles:

```
┌─────────────────────────────────────────────────────┐
│                    Client Apps                        │
│           (Web / Mobile / Other Services)             │
└───────────────────────┬─────────────────────────────┘
                        │ REST API / JWT
┌───────────────────────▼─────────────────────────────┐
│              Auth Service (Express.js)                │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │Middleware │→ │Controller│→ │     Service       │   │
│  │(Auth,     │  │(HTTP     │  │(Business Logic)   │   │
│  │Validate,  │  │Handling) │  │                   │   │
│  │RateLimit) │  │          │  └────────┬─────────┘   │
│  └──────────┘  └──────────┘           │              │
│                                        ▼              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Utils   │  │  Email   │  │    Repository     │   │
│  │(JWT,     │  │ Service  │  │ (Data Access)     │   │
│  │Password) │  │          │  │                   │   │
│  └──────────┘  └──────────┘  └────────┬─────────┘   │
│                                        │              │
│                               ┌────────▼─────────┐   │
│                               │  PostgreSQL       │   │
│                               │  (Drizzle ORM)    │   │
│                               └──────────────────┘   │
└───────────────────────────────────────────────────────┘
```

### Principles

- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: Services depend on abstractions (repositories)
- **SOLID**: Single responsibility, open/closed, interface segregation
- **DRY**: Shared utilities and helpers
- **Security First**: Defense in depth with multiple security layers

---

## Features

### Authentication
- ✅ User Registration with email verification
- ✅ Login with JWT access + refresh tokens
- ✅ Refresh Token Rotation (automatic on refresh)
- ✅ Logout with token invalidation
- ✅ Password recovery (forgot/reset)
- ✅ Password change (authenticated)
- ✅ Email verification flow
- ✅ Resend verification email

### Security
- ✅ Bcrypt password hashing (12 salt rounds)
- ✅ JWT access tokens (15 min) + refresh tokens (7 days)
- ✅ HttpOnly + Secure + SameSite cookies for refresh tokens
- ✅ Refresh token hash stored in database
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting (general + auth-specific)
- ✅ XSS protection
- ✅ Input validation with Zod
- ✅ Request body size limits
- ✅ SQL injection prevention (Drizzle ORM parameterized queries)

### Role-Based Access Control
- ✅ **Student** - Default role
- ✅ **Mentor** - Mentoring capabilities
- ✅ **Admin** - Full system access
- ✅ `authenticate()` middleware
- ✅ `authorize(...roles)` middleware

### Developer Experience
- ✅ Swagger/OpenAPI documentation
- ✅ Winston + Morgan logging
- ✅ Jest + Supertest testing
- ✅ ESLint + Prettier
- ✅ Docker + Docker Compose
- ✅ Graceful shutdown handling
- ✅ Database migrations (Drizzle Kit)
- ✅ Seed data

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | PostgreSQL (Supabase compatible) |
| ORM | Drizzle ORM |
| Auth | JWT, Bcrypt, Refresh Token Rotation |
| Validation | Zod |
| Logging | Winston + Morgan |
| Testing | Jest + Supertest |
| Docs | Swagger/OpenAPI 3.0 |
| Container | Docker + Docker Compose |
| Email | Nodemailer (SMTP) |
| Code Quality | ESLint + Prettier |

---

## Project Structure

```
auth-service/
├── src/
│   ├── config/              # Centralized configuration
│   │   ├── app.config.js    # Application settings
│   │   ├── cors.config.js   # CORS configuration
│   │   ├── db.config.js     # Database connection
│   │   ├── jwt.config.js    # JWT settings
│   │   └── env.js           # Environment loader
│   │
│   ├── constants/           # Application constants
│   │   ├── index.js         # Roles, status codes, policies
│   │   └── messages.js      # Success/error messages
│   │
│   ├── controllers/         # HTTP request handlers
│   │   ├── auth.controller.js
│   │   └── health.controller.js
│   │
│   ├── services/            # Business logic layer
│   │   ├── auth.service.js  # Authentication logic
│   │   └── email.service.js # Email notifications
│   │
│   ├── repositories/        # Data access layer
│   │   └── user.repository.js
│   │
│   ├── routes/              # Express route definitions
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   └── health.routes.js
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.js      # JWT auth + role auth
│   │   ├── validate.middleware.js  # Zod validation
│   │   ├── error.middleware.js     # Global error handler
│   │   ├── notFound.middleware.js  # 404 handler
│   │   ├── rateLimiter.middleware.js
│   │   └── requestLogger.middleware.js
│   │
│   ├── validations/         # Zod schemas
│   │   └── auth.validation.js
│   │
│   ├── models/              # Type definitions
│   │   └── user.model.js
│   │
│   ├── database/            # Database layer
│   │   ├── schema.js        # Drizzle schema
│   │   ├── relations.js     # Table relations
│   │   ├── seed.js          # Seed data
│   │   └── drizzle.js       # DB instance export
│   │
│   ├── utils/               # Shared helpers
│   │   ├── logger.js        # Winston logger
│   │   ├── errors.js        # Custom error classes
│   │   ├── jwt.helper.js    # JWT operations
│   │   ├── password.helper.js # Password hashing
│   │   ├── token.helper.js  # Token generation
│   │   ├── response.helper.js # Response formatting
│   │   ├── cookie.helper.js # Cookie management
│   │   └── asyncHandler.js  # Async error wrapper
│   │
│   ├── swagger/             # API documentation
│   │   ├── swagger.config.js
│   │   └── setup.js
│   │
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── drizzle/                 # Generated migrations
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
│
├── package.json
├── drizzle.config.js        # Drizzle Kit config
├── jest.config.js           # Jest config
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc
└── README.md
```

---

## Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or Supabase)
- npm or yarn

### Steps

```bash
# Clone the repository
git clone <repository-url>
cd DevBattle/auth-service

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# - Set DATABASE_URL to your PostgreSQL connection string
# - Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET to strong random strings
# - Set SMTP credentials for email functionality

# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed the database with test users
npm run db:seed
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production/test) | `development` |
| `PORT` | Server port | `4000` |
| `API_PREFIX` | API route prefix | `/api/v1` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | (required) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | (required) |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:3000` |
| `COOKIE_SECRET` | Cookie signing secret | (required in prod) |
| `COOKIE_SECURE` | Secure cookie flag | `false` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | (required in prod) |
| `SMTP_PASS` | SMTP password | (required in prod) |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |
| `LOG_LEVEL` | Log level (debug/info/warn/error) | `debug` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

---

## Running Locally

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start

# Run database studio
npm run db:studio
```

The server will be available at:
- API: `http://localhost:4000/api/v1`
- Swagger Docs: `http://localhost:4000/api-docs`
- Health Check: `http://localhost:4000/health`

---

## Docker

### Build and Run

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Build standalone image
docker build -t devbattle-auth-service .

# Run standalone container
docker run -d \
  --name devbattle-auth \
  -p 4000:4000 \
  --env-file .env \
  devbattle-auth-service
```

### Docker Compose Services

| Service | Description | Port |
|---------|-------------|------|
| `auth-service` | Authentication API | 4000 |
| `auth-db` | PostgreSQL database | 5432 |

### Volumes

| Volume | Purpose |
|--------|---------|
| `auth-db-data` | Persistent database storage |
| `auth-logs` | Application log files |

---

## API Documentation

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | No |
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/logout` | Logout | Yes |
| POST | `/api/v1/auth/refresh` | Refresh access token | Cookie |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password with token | No |
| POST | `/api/v1/auth/change-password` | Change password | Yes |
| POST | `/api/v1/auth/verify-email` | Verify email | No |
| POST | `/api/v1/auth/resend-verification` | Resend verification email | No |

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### Swagger UI

Interactive API documentation is available at `/api-docs` when the server is running.

---

## Authentication Flow

```
1. REGISTER
   Client → POST /auth/register → Creates user + sends verification email
                                    Returns user data (no tokens)

2. LOGIN
   Client → POST /auth/login    → Validates credentials
                                    Returns: { accessToken } (JSON)
                                    Sets: refreshToken (HttpOnly Cookie)

3. API ACCESS
   Client → GET /auth/me        → Header: Authorization: Bearer <accessToken>
                                    Returns: user profile

4. TOKEN REFRESH (automatic)
   Client → POST /auth/refresh  → Reads refreshToken from cookie
                                    Issues new accessToken (JSON)
                                    Rotates refreshToken (new cookie)
                                    Invalidates old refreshToken (DB)

5. LOGOUT
   Client → POST /auth/logout   → Invalidates refreshToken (DB)
                                    Clears refreshToken cookie
```

### Token Lifecycle

| Token | Storage | Lifetime | Rotation |
|-------|---------|----------|----------|
| Access Token | Client memory / localStorage | 15 minutes | On refresh |
| Refresh Token | HttpOnly Cookie + DB (hashed) | 7 days | On every use |

---

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm test -- --coverage
```

### Test Coverage

- **Unit Tests**: Password helper, JWT helper, token generator, validation schemas, error classes, response helpers
- **Integration Tests**: API endpoint testing with mocked database

---

## Deployment

### Production Checklist

- [ ] Set strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (min 256 bits)
- [ ] Set `COOKIE_SECRET` to a strong random value
- [ ] Set `COOKIE_SECURE=true` (HTTPS only)
- [ ] Set `COOKIE_SAME_SITE=strict` or `lax`
- [ ] Configure `CORS_ORIGIN` to production frontend URL(s)
- [ ] Set `NODE_ENV=production`
- [ ] Configure SMTP credentials for email delivery
- [ ] Use a managed PostgreSQL (Supabase, RDS, etc.)
- [ ] Enable SSL for database connection
- [ ] Set appropriate `LOG_LEVEL` (info or warn)
- [ ] Configure rate limiting thresholds
- [ ] Set up monitoring and alerting
- [ ] Run database migrations before deployment
- [ ] Never commit `.env` files

### Environment-Specific Settings

| Setting | Development | Production |
|---------|-------------|------------|
| `COOKIE_SECURE` | false | true |
| `COOKIE_SAME_SITE` | lax | strict |
| `LOG_LEVEL` | debug | info |
| Database SSL | disabled | enabled |
| Rate Limits | relaxed | strict |

---

## License

MIT
