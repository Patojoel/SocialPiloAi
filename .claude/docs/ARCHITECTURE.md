# ARCHITECTURE.md — SocialPilot AI

## Vision

Monorepo fullstack — automatisation de posts sur Facebook, Instagram et TikTok avec IA (OpenRouter / Higgsfield).

---

## Monorepo Structure

```
socialpilot-ai/
├── apps/
│   ├── web/                        # React + Vite + RTK (hexagonal)
│   └── api/                        # NestJS (hexagonal)
├── packages/
│   ├── shared-types/               # Types partagés frontend/backend
│   └── shared-validation/          # Zod schemas partagés
├── docs/
│   ├── ARCHITECTURE.md             # Ce fichier
│   ├── FEATURES.md                 # Catalogue des fonctionnalités
│   ├── PHASES.md                   # Plan de livraison par phase
│   ├── RULES.md                    # Règles de code & conventions
│   └── PROCESS.md                  # Workflow de développement
├── agents/
│   ├── AGENT_ARCHITECT.md
│   ├── AGENT_FRONTEND.md
│   ├── AGENT_BACKEND.md
│   ├── AGENT_REVIEWER.md
│   └── AGENT_TESTER.md
├── .env.example
├── package.json                    # Workspaces
└── turbo.json
```

---

## Frontend — `apps/web`

**Stack :** React 18 + Vite + Redux Toolkit + React Router v6 + React Hook Form + Zod + 21devs components

**Paradigme :** Hexagonal strict (Ports & Adapters)

```
apps/web/src/
├── config/
│   ├── create-store.ts             # configureStore + persist
│   ├── extraArgument.ts            # Injection de dépendances (gateways)
│   ├── dependencies.ts             # Interface Dependencies
│   ├── create-app-async-thunk.ts   # createAppAsyncThunk typé
│   ├── create-app-listener-middleware.ts
│   └── hooks.ts                    # useAppDispatch / useAppSelector
├── shared/
│   ├── infra/
│   │   └── http/
│   │       ├── HttpProvider.ts     # Interface Port
│   │       └── FetchHttpProvider.ts# Adapter Fetch
│   ├── utils/
│   │   ├── ModalEvents.ts
│   │   ├── Notify.ts
│   │   └── caseTransform.ts        # snake_case → camelCase
│   └── models/
│       └── Paginated.ts
├── features/
│   ├── auth/
│   ├── workspace/
│   ├── post/
│   ├── social-account/
│   ├── ai-generator/
│   ├── media/
│   ├── analytics/
│   └── subscription/
├── reducers/
│   └── reducer.ts                  # combineReducers
├── routes/
│   ├── Router.tsx
│   ├── routes.ts
│   └── useRouter.ts
├── provider/
│   ├── Provider.tsx
│   └── ReduxStoreProvider.tsx
└── App.tsx
```

### Feature structure (stricte)

```
features/<feature>/
├── models/
│   ├── <Feature>.ts
│   └── index.ts
├── gateway/
│   ├── <Feature>Gateway.ts         # Port (interface pure)
│   └── index.ts
├── infra/
│   ├── factories/
│   │   ├── <Feature>FormFactory.ts # buildFormValue()
│   │   └── <Feature>CommandFactory.ts # buildCommand()
│   ├── repo/
│   │   └── Http<Feature>Gateway.ts # Adapter HTTP
│   ├── routes/
│   │   └── <feature>Routes.tsx
│   ├── ui/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   │       └── use<Feature>.ts
│   └── validation/
│       └── <feature>Schema.ts
├── slices/
│   ├── <feature>Slice.ts
│   ├── <feature>Selectors.ts
│   └── index.ts
├── usecases/
│   ├── list<Feature>s/
│   │   ├── list<Feature>s.usecase.ts
│   │   ├── list<Feature>s.command.ts
│   │   └── list<Feature>s.response.ts
│   └── ...
└── listeners/
    └── <feature>Listeners.ts
```

### Règles d'architecture frontend

| Règle | Détail |
|-------|--------|
| Domain pur | `models/`, `gateway/`, `usecases/` → zéro import de `infra/` ou `ui/` |
| Adapter | `Http*Gateway` étend `HttpProvider`, injecté via `extraArgument` |
| UI | dispatch thunks uniquement, lit selectors — jamais d'appel HTTP direct |
| Selectors | toujours dans `*Selectors.ts`, jamais inline |
| Data fetching | thunks au mount ou sur event — **jamais `useEffect` pour fetcher** |
| Case transform | snake_case → camelCase **uniquement** dans l'adapter (gateway repo) |
| Modals | `ModalEvents.open/close(ModalEventKey.XXX)` |
| Toasts | `Notify.success/error()` |
| i18n | `react-i18next`, pas de strings hardcodées dans les composants |

---

## Backend — `apps/api`

**Stack :** NestJS + TypeORM + PostgreSQL + Redis + Bull (queues) + Passport JWT

**Paradigme :** Hexagonal (Modules NestJS = features)

```
apps/api/src/
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── redis.config.ts
├── shared/
│   ├── decorators/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── interceptors/
│   └── pipes/
│       └── zod-validation.pipe.ts
├── modules/
│   ├── auth/
│   ├── user/
│   ├── workspace/
│   ├── post/
│   ├── social-account/
│   ├── ai-generator/
│   ├── media/
│   ├── scheduler/
│   ├── analytics/
│   └── subscription/
└── main.ts
```

### Module NestJS structure

```
modules/<module>/
├── domain/
│   ├── entities/
│   ├── repositories/               # Interfaces (Ports)
│   └── services/                   # Domain services
├── application/
│   ├── use-cases/
│   ├── commands/
│   └── queries/
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/               # TypeORM entities
│   │   └── repositories/           # Implémentation des Ports
│   └── external/                   # Adapters API tierces
├── presentation/
│   ├── controllers/
│   ├── dtos/
│   └── serializers/
└── <module>.module.ts
```

### Règles d'architecture backend

| Règle | Détail |
|-------|--------|
| Validation | DTOs validés via `class-validator` + `ZodValidationPipe` |
| Auth | JWT Bearer — httpOnly cookie en production |
| Erreurs | RFC 7807 Problem Details — filtre global `HttpExceptionFilter` |
| Queues | Bull + Redis pour les jobs de publication planifiée |
| Response format | `{ data: T, meta?: PaginationMeta }` |
| Pagination | `{ data: T[], meta: { total, page, limit, totalPages } }` |

---

## Packages partagés

### `packages/shared-types`

Types TS consommés côté frontend ET backend (via import workspace).

```
packages/shared-types/
├── src/
│   ├── post.types.ts
│   ├── social-account.types.ts
│   ├── ai-generator.types.ts
│   └── index.ts
```

### `packages/shared-validation`

Schemas Zod réutilisés en front (RHF) et back (NestJS pipe).

```
packages/shared-validation/
├── src/
│   ├── post.schema.ts
│   ├── auth.schema.ts
│   └── index.ts
```

---

## Flux de données — exemple création de post

```
UI (PostForm)
  └─→ useCreatePost.ts (hook)
        └─→ dispatch(createPost(command))
              └─→ createPost.usecase.ts (thunk)
                    └─→ extra.postGateway.create(command)   [Port]
                          └─→ HttpPostGateway.create()       [Adapter]
                                └─→ FetchHttpProvider.post('/posts')
                                      └─→ NestJS POST /posts
                                            └─→ PostController
                                                  └─→ CreatePostUseCase
                                                        └─→ PostRepository (Port)
                                                              └─→ TypeORM PostRepository (Adapter)
```

---

## Variables d'environnement

Voir `.env.example` à la racine du monorepo.