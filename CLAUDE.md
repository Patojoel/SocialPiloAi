# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SocialPiloAi — AI-powered social media management platform for automating posts on Facebook, Instagram, and TikTok with AI-generated content (OpenRouter / Higgsfield).

## Tech Stack

- **Frontend**: React 18 + Vite + Redux Toolkit + React Router v6 + React Hook Form + Zod + Tailwind CSS + 21devs components
- **Backend**: NestJS + TypeORM + PostgreSQL + Redis + Bull (queues) + Passport JWT
- **Shared packages**: `shared-types` (TypeScript types) + `shared-validation` (Zod schemas)
- **AI**: OpenRouter (text), Higgsfield (image/video generation)
- **External APIs**: Meta Graph API (FB/IG), TikTok for Business API, Stripe, Resend
- **Tooling**: pnpm monorepo + Turborepo + ESLint + Prettier

## Commands

```bash
# Install all workspaces
pnpm install

# Start all apps in dev mode
pnpm dev

# Start only web or api
pnpm --filter web dev
pnpm --filter api dev

# Run all tests
pnpm test

# Run tests for a single app
pnpm --filter web test
pnpm --filter api test

# Run a single test file
pnpm --filter web test -- src/features/post/usecases/createPost.usecase.test.ts

# Build all
pnpm build

# Lint all
pnpm lint

# E2E tests (Playwright)
pnpm --filter web test:e2e
```

## Architecture

This is a **pnpm + Turborepo monorepo** with strict **Hexagonal Architecture (Ports & Adapters)** on both frontend and backend.

```
socialpilot-ai/
├── apps/
│   ├── web/              # React + Vite frontend
│   └── api/              # NestJS backend
├── packages/
│   ├── shared-types/     # TS types shared between apps
│   └── shared-validation/# Zod schemas shared between apps
└── turbo.json
```

### Frontend (`apps/web/src/`)

Features live under `features/<feature>/` with this strict internal structure:

```
features/<feature>/
├── models/           # Domain entities — zero external imports
├── gateway/          # Port interfaces — imports models/ only
├── usecases/         # Thunks — imports models/ + gateway/ only
├── slices/           # Redux slices + *Selectors.ts files
├── infra/
│   ├── repo/         # Http*Gateway adapters — implement gateway ports
│   ├── ui/           # React pages, components, hooks
│   ├── validation/   # Zod schemas for forms
│   └── factories/    # FormFactory.buildFormValue(), CommandFactory.buildCommand()
└── listeners/        # Redux listener middleware
```

**Import hierarchy is enforced** — violations block PRs:
- `models/` → no imports
- `gateway/` → `models/` only
- `usecases/` → `models/`, `gateway/` only
- `slices/` → `models/`, `usecases/`
- `infra/repo/` → `gateway/`, `models/`, `HttpProvider`
- `infra/ui/` → `slices/`, `models/`, `shared/ui`

**Data flow (example: create post):**
```
UI → useCreatePost hook → dispatch(createPost(command))
  → createPost.usecase.ts (thunk)
    → extra.postGateway.create() [Port]
      → HttpPostGateway.create() [Adapter]
        → FetchHttpProvider.post('/posts')
          → NestJS POST /posts → Controller → UseCase → TypeORM Repository
```

### Backend (`apps/api/src/`)

Each feature is a NestJS module following this structure:

```
modules/<module>/
├── domain/           # Zero NestJS/TypeORM deps — entities + repository interfaces
├── application/      # Use-cases, commands, queries — imports domain/ only
├── infrastructure/   # TypeORM entities + repository implementations + external API adapters
├── presentation/     # Controllers, DTOs, serializers — delegates to use-cases only
└── <module>.module.ts
```

### Shared packages

- `packages/shared-types/` — TS interfaces consumed by both `web` and `api`
- `packages/shared-validation/` — Zod schemas reused in React Hook Form (frontend) and NestJS ZodValidationPipe (backend)

## Non-Negotiable Rules

Full rules are in `.claude/docs/RULES.md`. Key constraints:

**TypeScript:**
- `strict` mode always on — no `any`, use `unknown` + type guards
- `interface` for object shapes, `type` for unions/intersections
- Named exports everywhere; default exports only for lazy-loaded pages

**React/Redux:**
- No `useEffect` for data fetching — use React Router loaders or event handlers
- No direct HTTP calls in components — dispatch thunks only
- `useAppDispatch`/`useAppSelector` always (never raw `useDispatch`/`useSelector`)
- Selectors always in dedicated `*Selectors.ts` files, never inline
- Business logic in `use*.ts` hooks, not in components

**Forms:** React Hook Form + Zod everywhere. Schema defined first, type inferred via `z.infer<>`.

**Redux slices:** Use `createEntityAdapter` for resource collections. `LoadingState` enum: `idle | pending | success | failed`.

**Tailwind:** Utility classes only via `cn()` (clsx + twMerge). No inline styles. Mobile-first.

**Backend:**
- Controllers delegate entirely to use-cases — zero business logic in controllers
- Bull queues for all async work (scheduled publishing, emails, analytics sync)
- Errors: RFC 7807 Problem Details format via global `HttpExceptionFilter`
- Response format: `{ data: T }` or `{ data: T[], meta: { total, page, limit, totalPages } }`

**Security:**
- JWT in httpOnly cookies (production) / memory (dev) — never localStorage
- OAuth tokens encrypted at rest (AES-256)
- Rate limiting on all public routes (auth, AI generation)
- snake_case → camelCase transformation **only** in `Http*Gateway` adapters

**Tests:**
- Vitest for unit tests, React Testing Library for components, Playwright for E2E
- Mock gateway interfaces (Ports), never mock the HTTP layer
- 80% minimum coverage on `domain/` and `usecases/` layers
- No snapshot tests — behavioral tests only

**Git:**
- Branches: `main` / `develop` / `feature/xxx` / `fix/xxx` / `phase/N`
- Conventional commits: `feat(scope):`, `fix(scope):`, `chore(scope):`, `test(scope):`, `docs(scope):`
- PR required for merge to main; CI must be green

## Environment Variables

Frontend (`apps/web/.env.local`):
```
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
```

Backend (`apps/api/.env`):
```
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_HOST / DATABASE_PORT / DATABASE_USER / DATABASE_PASSWORD / DATABASE_NAME
JWT_SECRET / JWT_EXPIRES_IN
JWT_REFRESH_SECRET / JWT_REFRESH_EXPIRES_IN
REDIS_URL
EMAIL_PROVIDER=resend
RESEND_API_KEY / EMAIL_FROM
```

## Project Phases

| Phase | Scope | Tag |
|-------|-------|-----|
| 0 | Auth + Workspace foundations | v0.1.0 |
| 1 | Social Accounts + Post CRUD + Media | v0.2.0 |
| 2 | AI Content Generation | v0.3.0 |
| 3 | Editorial Calendar + Notifications | v0.4.0 |
| 4 | Analytics + Stripe Subscription | v0.5.0 |

Full specs: `.claude/docs/FEATURES.md`, `.claude/docs/PHASES.md`, `.claude/phases/`.
Agent roles: `.claude/agents/`.
