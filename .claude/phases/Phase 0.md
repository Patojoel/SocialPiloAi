# PHASE-0.md — Fondations

**Version cible :** v0.1.0  
**Durée estimée :** Semaine 1–2  
**Branche :** `phase/0`  
**Statut :** `IN_PROGRESS`  
**Date début :** 2026-05-23  
**Implémenté le :** 2026-05-23

---

## Objectif

Monorepo opérationnel, authentification complète, gestion de workspace de base.  
À la fin de cette phase, un utilisateur peut s'inscrire, se connecter, créer un workspace et y accéder.

## Critère de sortie

> Login → Dashboard avec workspace actif fonctionnel. Token persisté. Aucune régression sur les E2E.

---

## Livrables

### 0-A · Monorepo & Configuration

| # | Fichier / Config | Description |
|---|-----------------|-------------|
| 0-A-01 | `package.json` (racine) | pnpm workspaces : `apps/*`, `packages/*` |
| 0-A-02 | `turbo.json` | Pipelines : `build`, `dev`, `test`, `lint`, `typecheck` |
| 0-A-03 | `.env.example` | Toutes les variables nécessaires à la phase 0 |
| 0-A-04 | `packages/shared-types/` | Setup initial — types partagés front/back |
| 0-A-05 | `packages/shared-validation/` | Setup initial — Zod schemas partagés |
| 0-A-06 | ESLint config partagée | `@socialpilot/eslint-config` dans packages/ |
| 0-A-07 | TypeScript config partagée | `tsconfig.base.json` strict à la racine |

---

### 0-B · Backend — `apps/api`

#### Bootstrap NestJS

| # | Fichier | Description |
|---|---------|-------------|
| 0-B-01 | `src/main.ts` | Bootstrap : Helmet, CORS, GlobalPipe, GlobalFilter, Swagger |
| 0-B-02 | `src/app.module.ts` | Module racine : TypeORM, ConfigModule, modules features |
| 0-B-03 | `src/config/app.config.ts` | Validation des env vars au démarrage (Joi) |
| 0-B-04 | `src/config/database.config.ts` | TypeORM config depuis .env |
| 0-B-05 | `src/config/jwt.config.ts` | JWT access + refresh config |

#### Shared infrastructure

| # | Fichier | Description |
|---|---------|-------------|
| 0-B-06 | `src/shared/filters/http-exception.filter.ts` | RFC 7807 — format d'erreur unifié |
| 0-B-07 | `src/shared/guards/jwt-auth.guard.ts` | Guard JWT Bearer |
| 0-B-08 | `src/shared/guards/refresh-token.guard.ts` | Guard refresh token |
| 0-B-09 | `src/shared/pipes/zod-validation.pipe.ts` | Validation Zod globale |
| 0-B-10 | `src/shared/decorators/current-user.decorator.ts` | `@CurrentUser()` |
| 0-B-11 | `src/shared/interceptors/response-transform.interceptor.ts` | Wrap `{ data: T }` |

#### Module `user`

| # | Fichier | Description |
|---|---------|-------------|
| 0-B-12 | `domain/entities/user.entity.ts` | Interface TS pure |
| 0-B-13 | `domain/repositories/user.repository.ts` | Port + token Symbol |
| 0-B-14 | `infrastructure/persistence/entities/user.orm-entity.ts` | @Entity TypeORM |
| 0-B-15 | `infrastructure/persistence/repositories/typeorm-user.repository.ts` | Adapter |
| 0-B-16 | `user.module.ts` | Module NestJS |

#### Module `auth`

| # | Fichier | Description |
|---|---------|-------------|
| 0-B-17 | `domain/entities/refresh-token.entity.ts` | Interface TS pure |
| 0-B-18 | `domain/repositories/refresh-token.repository.ts` | Port |
| 0-B-19 | `application/use-cases/register/register.use-case.ts` | F-01-01 |
| 0-B-20 | `application/use-cases/login/login.use-case.ts` | F-01-02 — JWT pair |
| 0-B-21 | `application/use-cases/logout/logout.use-case.ts` | F-01-03 — invalider refresh |
| 0-B-22 | `application/use-cases/refresh-token/refresh-token.use-case.ts` | Rotation |
| 0-B-23 | `application/use-cases/forgot-password/forgot-password.use-case.ts` | F-01-04 |
| 0-B-24 | `application/use-cases/reset-password/reset-password.use-case.ts` | F-01-05 |
| 0-B-25 | `application/use-cases/update-profile/update-profile.use-case.ts` | F-01-06 |
| 0-B-26 | `presentation/controllers/auth.controller.ts` | Tous les endpoints auth |
| 0-B-27 | `presentation/dtos/register.dto.ts` | Validation register |
| 0-B-28 | `presentation/dtos/login.dto.ts` | Validation login |
| 0-B-29 | `auth.module.ts` | Module NestJS |

#### Module `workspace`

| # | Fichier | Description |
|---|---------|-------------|
| 0-B-30 | `domain/entities/workspace.entity.ts` | Interface TS pure |
| 0-B-31 | `domain/entities/workspace-member.entity.ts` | Relation user ↔ workspace |
| 0-B-32 | `domain/repositories/workspace.repository.ts` | Port |
| 0-B-33 | `application/use-cases/create-workspace/` | F-02-01 |
| 0-B-34 | `application/use-cases/list-workspaces/` | F-02-02 |
| 0-B-35 | `application/use-cases/get-workspace/` | F-02-03 |
| 0-B-36 | `application/use-cases/update-workspace/` | F-02-04 |
| 0-B-37 | `application/use-cases/delete-workspace/` | F-02-05 |
| 0-B-38 | `presentation/controllers/workspace.controller.ts` | CRUD workspace |
| 0-B-39 | `workspace.module.ts` | Module NestJS |

#### Migrations TypeORM

| # | Migration | Tables créées |
|---|-----------|--------------|
| 0-B-40 | `001-create-users` | `users` |
| 0-B-41 | `002-create-refresh-tokens` | `refresh_tokens` |
| 0-B-42 | `003-create-workspaces` | `workspaces`, `workspace_members` |
| 0-B-43 | `004-create-password-resets` | `password_resets` |

---

### 0-C · Frontend — `apps/web`

#### Bootstrap Vite + Config

| # | Fichier | Description |
|---|---------|-------------|
| 0-C-01 | `vite.config.ts` | Path alias `@/`, env, plugins |
| 0-C-02 | `tsconfig.json` | Strict, paths, baseUrl |
| 0-C-03 | `tailwind.config.ts` | Tokens, plugins shadcn/21devs |
| 0-C-04 | `src/index.css` | Tailwind directives, CSS variables |

#### Config Redux

| # | Fichier | Description |
|---|---------|-------------|
| 0-C-05 | `src/config/create-store.ts` | configureStore + redux-persist (localforage) |
| 0-C-06 | `src/config/dependencies.ts` | Interface `Dependencies` |
| 0-C-07 | `src/config/extraArgument.ts` | Instanciation gateways + FetchHttpProvider |
| 0-C-08 | `src/config/create-app-async-thunk.ts` | `createAppAsyncThunk` typé |
| 0-C-09 | `src/config/create-app-listener-middleware.ts` | RTK listener middleware |
| 0-C-10 | `src/config/hooks.ts` | `useAppDispatch` / `useAppSelector` |

#### Shared infra

| # | Fichier | Description |
|---|---------|-------------|
| 0-C-11 | `src/shared/infra/http/HttpProvider.ts` | Interface Port HTTP |
| 0-C-12 | `src/shared/infra/http/FetchHttpProvider.ts` | Adapter Fetch (Bearer + X-Workspace-Id) |
| 0-C-13 | `src/shared/infra/http/HttpError.ts` | Classe HttpError |
| 0-C-14 | `src/shared/utils/Notify.ts` | Wrapper react-toastify |
| 0-C-15 | `src/shared/utils/ModalEvents.ts` | open/close modals |
| 0-C-16 | `src/shared/utils/caseTransform.ts` | `toCamelCase`, `toSnakeCase` |
| 0-C-17 | `src/shared/models/Paginated.ts` | `interface Paginated<T>` |
| 0-C-18 | `src/shared/models/LoadingState.ts` | `enum LoadingState` |
| 0-C-19 | `src/reducers/reducer.ts` | `combineReducers` |

#### Routes & Providers

| # | Fichier | Description |
|---|---------|-------------|
| 0-C-20 | `src/routes/routes.ts` | Constantes routes (`AuthRoutes`, `WorkspaceRoutes`) |
| 0-C-21 | `src/routes/Router.tsx` | `createBrowserRouter` avec loaders |
| 0-C-22 | `src/routes/useRouter.ts` | Hook navigation |
| 0-C-23 | `src/provider/Provider.tsx` | ReduxProvider + PersistGate |
| 0-C-24 | `src/provider/ReduxStoreProvider.tsx` | Context store |
| 0-C-25 | `src/App.tsx` | Root — rehydration guard + RouterProvider |
| 0-C-26 | `src/main.tsx` | ReactDOM.createRoot + ToastContainer |

#### Feature `auth`

| # | Fichier | Description |
|---|---------|-------------|
| 0-C-27 | `models/Auth.ts` | `User`, `AuthTokens`, `JwtPayload` |
| 0-C-28 | `gateway/AuthGateway.ts` | Port : `login`, `register`, `logout`, `refresh`, `me`, `forgotPassword`, `resetPassword`, `updateProfile` |
| 0-C-29 | `usecases/login/` | command + response + thunk |
| 0-C-30 | `usecases/register/` | command + response + thunk |
| 0-C-31 | `usecases/logout/` | thunk |
| 0-C-32 | `usecases/fetchMe/` | thunk — charger profil au boot |
| 0-C-33 | `usecases/forgotPassword/` | command + thunk |
| 0-C-34 | `usecases/resetPassword/` | command + thunk |
| 0-C-35 | `usecases/updateProfile/` | command + thunk |
| 0-C-36 | `slices/authSlice.ts` | user, loading, error, isAuthenticated |
| 0-C-37 | `slices/authSelectors.ts` | selectCurrentUser, selectIsAuthenticated, selectAuthLoading |
| 0-C-38 | `infra/repo/HttpAuthGateway.ts` | Adapter HTTP |
| 0-C-39 | `infra/tokenStorage.ts` | getAccessToken, setTokens, clearSession (memory, pas localStorage) |
| 0-C-40 | `infra/validation/authSchema.ts` | Zod : loginSchema, registerSchema, resetPasswordSchema, updateProfileSchema |
| 0-C-41 | `infra/ui/hooks/useLogin.ts` | RHF + dispatch loginThunk |
| 0-C-42 | `infra/ui/hooks/useRegister.ts` | RHF + dispatch registerThunk |
| 0-C-43 | `infra/ui/hooks/useForgotPassword.ts` | RHF + dispatch |
| 0-C-44 | `infra/ui/hooks/useResetPassword.ts` | RHF + dispatch |
| 0-C-45 | `infra/ui/hooks/useProfile.ts` | lecture + update profil |
| 0-C-46 | `infra/ui/pages/LoginPage.tsx` | Page login |
| 0-C-47 | `infra/ui/pages/RegisterPage.tsx` | Page inscription |
| 0-C-48 | `infra/ui/pages/ForgotPasswordPage.tsx` | Page mot de passe oublié |
| 0-C-49 | `infra/ui/pages/ResetPasswordPage.tsx` | Page réinitialisation |
| 0-C-50 | `infra/ui/components/AuthLayout.tsx` | Layout pages auth (centré, branding) |
| 0-C-51 | `infra/routes/authRoutes.tsx` | Définitions routes auth |
| 0-C-52 | `listeners/authListeners.ts` | Listener : on login → fetchMe |

#### Feature `workspace`

| # | Fichier | Description |
|---|---------|-------------|
| 0-C-53 | `models/Workspace.ts` | `Workspace`, `WorkspaceMember` |
| 0-C-54 | `gateway/WorkspaceGateway.ts` | Port CRUD workspace |
| 0-C-55 | `usecases/createWorkspace/` | command + response + thunk |
| 0-C-56 | `usecases/listWorkspaces/` | thunk |
| 0-C-57 | `usecases/updateWorkspace/` | command + thunk |
| 0-C-58 | `usecases/deleteWorkspace/` | thunk |
| 0-C-59 | `usecases/switchWorkspace/` | thunk — setCurrentWorkspaceId + persist |
| 0-C-60 | `slices/workspaceSlice.ts` | EntityAdapter + currentId |
| 0-C-61 | `slices/workspaceSelectors.ts` | selectCurrentWorkspace, selectAllWorkspaces |
| 0-C-62 | `infra/repo/HttpWorkspaceGateway.ts` | Adapter HTTP |
| 0-C-63 | `infra/validation/workspaceSchema.ts` | Zod : createWorkspaceSchema, updateWorkspaceSchema |
| 0-C-64 | `infra/factories/WorkspaceFormFactory.ts` | buildFormValue |
| 0-C-65 | `infra/factories/WorkspaceCommandFactory.ts` | buildCommand |
| 0-C-66 | `infra/ui/hooks/useWorkspaceList.ts` | liste + switch |
| 0-C-67 | `infra/ui/hooks/useCreateWorkspace.ts` | RHF + dispatch |
| 0-C-68 | `infra/ui/pages/WorkspaceSelectPage.tsx` | Page sélection/création workspace |
| 0-C-69 | `infra/ui/components/WorkspaceSwitcher.tsx` | Dropdown sidebar |
| 0-C-70 | `infra/ui/components/CreateWorkspaceModal.tsx` | Modal création |
| 0-C-71 | `infra/routes/workspaceRoutes.tsx` | Définitions routes |

#### Layout principal

| # | Fichier | Description |
|---|---------|-------------|
| 0-C-72 | `src/shared/ui/layouts/DashboardLayout.tsx` | Sidebar + Header + Outlet |
| 0-C-73 | `src/shared/ui/layouts/Sidebar.tsx` | Navigation principale |
| 0-C-74 | `src/shared/ui/layouts/Header.tsx` | WorkspaceSwitcher + UserMenu |
| 0-C-75 | `src/shared/ui/components/ProtectedRoute.tsx` | Guard — redirect si non authentifié |

---

## Variables d'environnement — Phase 0

```bash
# Frontend
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development

# Backend
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=socialpilot
DATABASE_PASSWORD=socialpilot
DATABASE_NAME=socialpilot_db
JWT_SECRET=change-me-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# Email (pour forgot-password)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your-resend-key
EMAIL_FROM=noreply@socialpilot.ai
```

---

## Tests — Phase 0

### Tests unitaires frontend (Vitest)

```
features/auth/usecases/login/__tests__/login.usecase.spec.ts
  ✓ should store tokens and user on success
  ✓ should set loading=pending during request
  ✓ should set error on invalid credentials (401)
  ✓ should set error on server error (500)

features/auth/usecases/register/__tests__/register.usecase.spec.ts
  ✓ should create user and auto-login on success
  ✓ should reject on duplicate email (409)

features/workspace/usecases/createWorkspace/__tests__/createWorkspace.usecase.spec.ts
  ✓ should add workspace to store
  ✓ should set currentId on created workspace

features/workspace/usecases/listWorkspaces/__tests__/listWorkspaces.usecase.spec.ts
  ✓ should populate store with workspaces
  ✓ should handle empty list

features/workspace/usecases/switchWorkspace/__tests__/switchWorkspace.usecase.spec.ts
  ✓ should update currentId in store
  ✓ should persist active workspace id
```

### Tests d'intégration backend (Supertest)

```
POST /auth/register
  ✓ 201 — user créé avec email + mot de passe hashé
  ✓ 409 — email déjà utilisé
  ✓ 422 — email invalide
  ✓ 422 — mot de passe trop court

POST /auth/login
  ✓ 200 — retourne access_token + refresh_token
  ✓ 401 — mauvais mot de passe
  ✓ 401 — email inconnu

POST /auth/refresh
  ✓ 200 — nouveau pair de tokens
  ✓ 401 — refresh token invalide / expiré

POST /auth/logout
  ✓ 200 — refresh token invalidé

POST /auth/forgot-password
  ✓ 200 — email envoyé (mock Resend)
  ✓ 200 — silencieux même si email inconnu (security)

POST /auth/reset-password
  ✓ 200 — mot de passe mis à jour
  ✓ 400 — token expiré ou invalide

GET /workspaces
  ✓ 200 — liste des workspaces de l'utilisateur
  ✓ 401 — sans token

POST /workspaces
  ✓ 201 — workspace créé
  ✓ 422 — nom manquant

PATCH /workspaces/:id
  ✓ 200 — workspace mis à jour
  ✓ 403 — pas le owner
  ✓ 404 — workspace inconnu

DELETE /workspaces/:id
  ✓ 204 — workspace supprimé
  ✓ 403 — pas le owner
```

### Tests E2E (Playwright)

```
e2e/phase-0/auth-flow.spec.ts
  ✓ Register → Email verified → Login → Dashboard visible
  ✓ Login avec mauvais mdp → message d'erreur affiché
  ✓ Forgot password → email reçu (mock) → reset → login avec nouveau mdp

e2e/phase-0/workspace-flow.spec.ts
  ✓ Login → Create Workspace → Workspace visible dans sidebar
  ✓ Create second workspace → Switch → ActiveWorkspace mis à jour
  ✓ Delete workspace → redirect vers workspace-select
```

---

## Checklist de validation — Phase 0

### Build & Qualité

```
[ ] pnpm build → 0 erreurs TypeScript
[ ] pnpm lint → 0 erreurs ESLint
[ ] pnpm typecheck → 0 erreurs
```

### Tests

```
[ ] pnpm test → 100% des tests unitaires green
[ ] Coverage domain/usecases ≥ 80%
[ ] pnpm test:integration → 100% green
[ ] pnpm test:e2e → tous les scénarios phase-0 green
```

### Architecture

```
[x] Aucune violation hexagonale (AGENT_ARCHITECT validé)
[x] Zéro any TypeScript
[x] Zéro useEffect pour data fetching
[x] snake_case→camelCase uniquement dans Http*Gateway
[x] Tokens non stockés en localStorage
[x] .env.example à jour
```

### Fonctionnel (code implémenté, tests E2E à valider)

```
[x] Register → Login → Dashboard ✓ (code implémenté)
[x] Forgot password → Email → Reset → Login ✓ (code implémenté)
[x] Create Workspace → visible dans sidebar ✓ (code implémenté)
[x] Switch Workspace → X-Workspace-Id mis à jour dans les requêtes ✓
[x] Refresh token → rotation automatique ✓
[x] Logout → session effacée, redirect /login ✓
```

### Livrables implémentés

```
[x] 0-A: Monorepo root (package.json, turbo.json, tsconfig.base.json, .env.example)
[x] 0-A: packages/shared-types (UserDto, WorkspaceDto, AuthTokensDto, PaginationMeta)
[x] 0-A: packages/shared-validation (auth + workspace Zod schemas)
[x] 0-A: packages/eslint-config
[x] 0-B: apps/api bootstrap (main.ts, app.module.ts, configs)
[x] 0-B: Shared infra (HttpExceptionFilter RFC7807, JwtAuthGuard, ZodValidationPipe, CurrentUser, ResponseTransformInterceptor)
[x] 0-B: Module user (domain entity, repo port, TypeORM adapter)
[x] 0-B: Module auth (7 use-cases, AuthController, JwtStrategy, DTOs, AuthModule)
[x] 0-B: Module workspace (5 use-cases, WorkspaceController, DTOs, WorkspaceModule)
[x] 0-B: Migrations 001-004 (users, refresh_tokens, workspaces, password_resets)
[x] 0-C: apps/web config (vite.config, tsconfig, tailwind, postcss)
[x] 0-C: Redux config (store, dependencies, extraArgument, hooks, listenerMiddleware)
[x] 0-C: Shared infra HTTP (HttpProvider port, FetchHttpProvider adapter, HttpError)
[x] 0-C: Feature auth (models, gateway, 7 usecases, authSlice+Selectors, HttpAuthGateway, tokenStorage, validation, 5 hooks, 4 pages, AuthLayout, routes, listeners)
[x] 0-C: Feature workspace (models, gateway, 5 usecases, workspaceSlice+Selectors, HttpWorkspaceGateway, validation, factories, 2 hooks, pages, components, routes)
[x] 0-C: Shared UI (DashboardLayout, Sidebar, Header, ProtectedRoute)
[x] 0-C: Routes (Router.tsx, routes.ts, useRouter.ts)
[x] 0-C: Providers (Provider.tsx, ReduxStoreProvider.tsx)
[x] 0-C: Tests unitaires (login, createWorkspace, switchWorkspace usecases)
```

---

## Commandes de fin de phase

```bash
# Vérification finale
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm test:e2e

# Merge et tag
git checkout develop && git merge --no-ff phase/0 -m "feat: phase 0 — fondations"
git checkout main && git merge --no-ff develop -m "release: v0.1.0"
git tag -a v0.1.0 -m "Phase 0: Auth + Workspace"
git push origin main --tags
```