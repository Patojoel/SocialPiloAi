# PHASES.md — SocialPilot AI

## Plan de livraison par phase

> Règle fondamentale : **une phase = implémentation → tests → code review → fix → validation → merge**  
> On ne démarre jamais la phase N+1 sans que la phase N soit en état `VALIDATED`.

---

## Phase 0 — Fondations (Semaine 1–2)

**Objectif :** Monorepo opérationnel, auth fonctionnelle, workspace de base.  
**Critère de sortie :** Login/logout fonctionnel, token persisté, workspace sélectionnable.

### Livrables

#### Monorepo & Config

- [ ] `package.json` workspaces (pnpm)
- [ ] `turbo.json` pipelines (build, dev, test, lint)
- [ ] `.env.example` complet
- [ ] ESLint + Prettier config partagée
- [ ] TypeScript strict config partagée
- [ ] `packages/shared-types` — setup initial
- [ ] `packages/shared-validation` — setup initial

#### Backend — `apps/api`

- [ ] NestJS bootstrap (`main.ts`, `app.module.ts`)
- [ ] `config/` — database, jwt, redis configs
- [ ] `shared/filters/http-exception.filter.ts` — RFC 7807
- [ ] `shared/guards/jwt-auth.guard.ts`
- [ ] `shared/pipes/zod-validation.pipe.ts`
- [ ] Module `auth` complet (F-01-01 à F-01-06)
- [ ] Module `user` — entité + repository
- [ ] Module `workspace` — CRUD basique (F-02-01 à F-02-05)
- [ ] Migrations TypeORM — users, workspaces
- [ ] Swagger / OpenAPI setup

#### Frontend — `apps/web`

- [ ] Vite + React 18 + TS strict setup
- [ ] Tailwind CSS + cn() utility
- [ ] `config/create-store.ts` + persist (localforage)
- [ ] `config/extraArgument.ts` + `dependencies.ts`
- [ ] `config/create-app-async-thunk.ts`
- [ ] `config/hooks.ts` — useAppDispatch/useAppSelector
- [ ] `shared/infra/http/FetchHttpProvider.ts`
- [ ] `shared/utils/Notify.ts` — react-toastify
- [ ] `shared/utils/ModalEvents.ts`
- [ ] `shared/utils/caseTransform.ts`
- [ ] Feature `auth` complète (F-01-01 à F-01-06)
- [ ] Feature `workspace` complète (F-02-01 à F-02-05)
- [ ] `routes/Router.tsx` — navigation de base
- [ ] Layout principal (sidebar + header)
- [ ] Pages : Login, Register, ForgotPassword, ResetPassword

### Tests Phase 0

- [ ] Unit : usecases auth (mock gateway)
- [ ] Unit : usecases workspace (mock gateway)
- [ ] Integration : POST /auth/login → JWT valide
- [ ] Integration : POST /workspaces → workspace créé
- [ ] E2E (Playwright) : Register → Login → Create Workspace → Switch Workspace

---

## Phase 1 — Connexion Réseaux Sociaux + Post basique (Semaine 3–5)

**Objectif :** Connecter Facebook/Instagram/TikTok, créer et publier un post immédiatement.  
**Critère de sortie :** Un post texte publié sur une page Facebook connectée.

### Livrables

#### Backend

- [ ] Module `social-account` — OAuth2 Meta (FB + IG) + TikTok
- [ ] OAuth2 callback handlers + token storage chiffrée (AES-256)
- [ ] Module `media` — upload S3/R2 + validation par plateforme (F-06-01 à F-06-03)
- [ ] Module `post` — CRUD complet (F-04-01 à F-04-08)
- [ ] Service `publisher` — publication immédiate via APIs sociales
- [ ] Module `scheduler` — Bull queue pour posts planifiés
- [ ] Worker `publish-job` — exécution Bull + retry on failure
- [ ] Migrations TypeORM — social_accounts, posts, media, post_results

#### Frontend

- [ ] Feature `social-account` complète (F-03-01 à F-03-06)
- [ ] Feature `media` complète (F-06-01 à F-06-04)
- [ ] Feature `post` complète (F-04-01 à F-04-09)
- [ ] Composant `PostEditor` — textarea + platform selector + media picker
- [ ] Composant `AccountSelector` — choix des comptes cibles
- [ ] Composant `SchedulePicker` — date/heure + timezone
- [ ] Page `PostListPage` — liste avec filtres
- [ ] Page `PostDetailPage` — statut par plateforme
- [ ] Polling du statut post (usecase + listener)

### Tests Phase 1

- [ ] Unit : `publisher.service` (mock APIs sociales)
- [ ] Unit : `scheduler` — job creation/execution
- [ ] Unit : usecases post (mock gateway)
- [ ] Integration : POST /posts → publié sur plateforme mock
- [ ] Integration : OAuth callback → social account sauvegardé
- [ ] E2E : Connect FB account → Create post → Publish Now → Status = PUBLISHED

---

## Phase 2 — Génération IA (Semaine 6–7)

**Objectif :** Générer du contenu textuel et image avec IA depuis l'éditeur de post.  
**Critère de sortie :** Générer un caption + hashtags + image et les injecter dans un post.

### Livrables

#### Backend

- [ ] Module `ai-generator` — service OpenRouter (texte)
- [ ] Intégration Higgsfield API (image)
- [ ] Rate limiting par plan (Free : 20/mois, Pro : 200/mois)
- [ ] Persistance `ai_usages` pour comptage crédits
- [ ] Endpoints : generate-caption, generate-hashtags, rephrase, variations, generate-image (F-05)
- [ ] `saved-prompts` — CRUD

#### Frontend

- [ ] Feature `ai-generator` complète (F-05-01 à F-05-08)
- [ ] Composant `AIGeneratorPanel` — drawer latéral dans PostEditor
- [ ] Composant `ToneSelector` — select du ton
- [ ] Composant `VariationCards` — 3 variations sélectionnables
- [ ] Composant `AIImageGallery` — résultats génération image
- [ ] Intégration dans `PostEditor` — injection automatique du contenu généré
- [ ] Indicateur de crédits IA restants

### Tests Phase 2

- [ ] Unit : `ai-generator.service` (mock OpenRouter)
- [ ] Unit : rate limiting credits
- [ ] Unit : usecases generate-caption / generate-image
- [ ] Integration : POST /ai/generate-caption → contenu retourné
- [ ] E2E : Ouvrir AI panel → Generate caption → Inject in editor → Schedule post

---

## Phase 3 — Calendrier & Notifications (Semaine 8–10)

**Objectif :** Vue calendrier des posts planifiés + notifications in-app.  
**Critère de sortie :** Calendrier affichant tous les posts, drag & drop opérationnel.

### Livrables

#### Backend

- [ ] Module `notification` — in-app + email (Resend/SendGrid)
- [ ] Bull event hooks → notification on publish success/failure
- [ ] Endpoint GET /notifications + PATCH /:id/read
- [ ] Module extension `post` — query calendrier (GET /posts/calendar?from=&to=)

#### Frontend

- [ ] Feature `calendar` (F-07-01 à F-07-03)
- [ ] Intégration `@fullcalendar/react` ou custom calendar component
- [ ] Drag & drop → dispatch `reschedulePost` thunk
- [ ] Feature `notification` (F-09-01 à F-09-03)
- [ ] Composant `NotificationBell` + dropdown
- [ ] Composant `NotificationCenter` (page dédiée)
- [ ] RTK Listener → auto-refresh notifications

### Tests Phase 3

- [ ] Unit : `notification.service`
- [ ] Unit : calendar query avec range dates
- [ ] Unit : reschedulePost usecase
- [ ] Integration : publish failure → notification créée
- [ ] E2E : Calendar view → Drag post → New date confirmé

---

## Phase 4 — Analytics & Subscription (Semaine 11–14)

**Objectif :** Dashboard analytics + gestion des plans Stripe.  
**Critère de sortie :** Analytics affichés, upgrade plan fonctionnel via Stripe Checkout.

### Livrables

#### Backend

- [ ] Module `analytics` — sync Meta Graph API + TikTok Analytics
- [ ] Cron job — sync analytics toutes les 6h
- [ ] Module `subscription` — Stripe Checkout + Webhooks
- [ ] Guard `PlanGuard` — vérification plan pour features premium
- [ ] Endpoints analytics (F-08)
- [ ] Endpoints subscription (F-10)

#### Frontend

- [ ] Feature `analytics` (F-08-01 à F-08-04)
- [ ] Charts avec Recharts — reach, engagement, followers growth
- [ ] Feature `subscription` (F-10)
- [ ] Page `PlansPage` — comparaison plans + CTA
- [ ] Stripe Checkout redirect
- [ ] Gestion post-payment (webhook → update plan → notification)
- [ ] Guards UI par plan — disable features avec upgrade prompt

### Tests Phase 4

- [ ] Unit : `analytics.service` (mock Meta API)
- [ ] Unit : Stripe webhook handler
- [ ] Unit : PlanGuard
- [ ] Integration : Stripe checkout flow
- [ ] E2E : Analytics page → Export CSV → Stripe upgrade

---

## Récapitulatif

| Phase | Semaines | Features | Critère de validation |
|-------|----------|----------|----------------------|
| **0** | 1–2 | Auth + Workspace | Login → Workspace fonctionnel |
| **1** | 3–5 | Social Accounts + Post + Media | Publier sur FB |
| **2** | 6–7 | AI Generator | Caption + Image généré → injecté |
| **3** | 8–10 | Calendar + Notifications | Calendrier + drag & drop |
| **4** | 11–14 | Analytics + Subscription | Stripe + charts |

---

## Règles de passage de phase

```
Phase N en cours
  → implémentation complète
  → tests unitaires green (coverage > 80% domain)
  → tests integration green
  → code review par AGENT_REVIEWER
  → fix de tous les issues bloquants
  → E2E green
  → AGENT_ARCHITECT valide les boundaries hexagonales
  → merge sur main
  → tag vX.Y.0
  → Phase N+1 démarre
```