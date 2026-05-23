# PHASE-4.md — Analytics + Subscription & Billing

**Version cible :** v1.0.0  
**Durée estimée :** Semaine 11–14  
**Branche :** `phase/4`  
**Statut :** `NOT_STARTED`  
**Prérequis :** Phase 3 taguée `v0.4.0` sur `main`

---

## Objectif

Afficher les analytics de performance des posts (Meta Graph API + TikTok Analytics) et mettre en place les plans d'abonnement payants via Stripe Checkout avec gestion des limites par plan.

## Critère de sortie

> Dashboard analytics avec métriques réelles. Upgrade de plan fonctionnel via Stripe. PlanGuard bloquant les features premium pour les comptes Free.

---

## Livrables

### 4-A · Backend — Module `analytics`

#### Domain

| # | Fichier | Description |
|---|---------|-------------|
| 4-A-01 | `domain/entities/post-analytics.entity.ts` | id, postId, platform, likes, comments, shares, reach, impressions, clicks, engagementRate, syncedAt |
| 4-A-02 | `domain/entities/account-analytics.entity.ts` | id, socialAccountId, followersCount, followersGrowth, avgEngagementRate, recordedAt |
| 4-A-03 | `domain/repositories/post-analytics.repository.ts` | Port : save, findByPost, findByWorkspace(range) |
| 4-A-04 | `domain/repositories/account-analytics.repository.ts` | Port : save, findBySocialAccount(range) |
| 4-A-05 | `domain/ports/analytics-fetcher.port.ts` | Interface : `fetchPostAnalytics(post, account): Promise<PostAnalyticsData>` + `fetchAccountAnalytics(account): Promise<AccountAnalyticsData>` |

#### Infrastructure — Adapters Analytiques

| # | Fichier | Description |
|---|---------|-------------|
| 4-A-06 | `infrastructure/meta-analytics.adapter.ts` | Implémente `AnalyticsFetcherPort` — Meta Graph API Insights |
| 4-A-07 | `infrastructure/tiktok-analytics.adapter.ts` | Implémente `AnalyticsFetcherPort` — TikTok for Business Analytics |

#### Application

| # | Fichier | Description |
|---|---------|-------------|
| 4-A-08 | `application/use-cases/sync-analytics/sync-analytics.use-case.ts` | Sync toutes les plateformes du workspace |
| 4-A-09 | `application/use-cases/get-post-analytics/` | query: postId → métriques |
| 4-A-10 | `application/use-cases/get-workspace-analytics/` | query: workspaceId, from, to, platform → agrégat |
| 4-A-11 | `application/use-cases/get-best-time-to-post/` | Analyse des meilleures heures (groupBy hour/dayOfWeek) |
| 4-A-12 | `application/use-cases/export-analytics/` | Génère CSV — Buffer retourné en blob |
| 4-A-13 | `application/jobs/sync-analytics.job.ts` | Cron Bull — every 6h → dispatch sync pour tous les workspaces actifs |

#### Presentation

| # | Fichier | Description |
|---|---------|-------------|
| 4-A-14 | `presentation/controllers/analytics.controller.ts` | Tous les endpoints /analytics |
| 4-A-15 | `presentation/dtos/analytics.response.dto.ts` | Serialisation |
| 4-A-16 | `analytics.module.ts` | Module NestJS |
| 4-A-17 | Migration `011-create-analytics` | Tables `post_analytics`, `account_analytics` |

#### Endpoints résumé

```
GET  /analytics/workspace?from=&to=&platform=    → WorkspaceAnalytics (agrégat)
GET  /analytics/posts/:id                        → PostAnalytics
GET  /analytics/accounts/:id?from=&to=           → AccountAnalytics (timeline)
GET  /analytics/best-time?platform=              → BestTimeAnalysis
GET  /analytics/export?from=&to=&format=csv      → File blob
POST /analytics/sync                             → 202 — déclenche sync manuelle
```

---

### 4-B · Backend — Module `subscription`

#### Domain

| # | Fichier | Description |
|---|---------|-------------|
| 4-B-01 | `domain/entities/subscription.entity.ts` | id, workspaceId, plan (free/pro/business), status (active/past_due/canceled), stripeSubscriptionId, currentPeriodEnd, cancelAt |
| 4-B-02 | `domain/entities/plan-limits.entity.ts` | plan, postsPerMonth, socialAccounts, aiCredits, teamMembers |
| 4-B-03 | `domain/repositories/subscription.repository.ts` | Port : findByWorkspace, save, update |
| 4-B-04 | `domain/services/plan-limits.service.ts` | Retourne les limites d'un plan + vérifie si une action est autorisée |

#### Infrastructure — Stripe

| # | Fichier | Description |
|---|---------|-------------|
| 4-B-05 | `infrastructure/stripe/stripe.adapter.ts` | Wrapper Stripe SDK — createCheckoutSession, createPortalSession, cancelSubscription |
| 4-B-06 | `infrastructure/stripe/stripe-webhook.handler.ts` | Handle : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` |
| 4-B-07 | `infrastructure/stripe/stripe-plans.config.ts` | Mapping plan → priceId Stripe |

#### Application

| # | Fichier | Description |
|---|---------|-------------|
| 4-B-08 | `application/use-cases/create-checkout-session/` | Crée session Stripe Checkout → retourne URL |
| 4-B-09 | `application/use-cases/create-portal-session/` | Portail client Stripe (update card, cancel, etc.) |
| 4-B-10 | `application/use-cases/handle-webhook/` | Orchestre les events Stripe → update subscription en base |
| 4-B-11 | `application/use-cases/get-subscription/` | État actuel de l'abonnement |
| 4-B-12 | `application/use-cases/check-plan-limit/` | Vérifier si une action est permise par le plan actuel |

#### Guards & Decorators

| # | Fichier | Description |
|---|---------|-------------|
| 4-B-13 | `shared/guards/plan.guard.ts` | `@RequiresPlan(Plan.PRO)` — vérifie le plan du workspace |
| 4-B-14 | `shared/decorators/requires-plan.decorator.ts` | `@RequiresPlan(plan: Plan)` metadata |

#### Presentation

| # | Fichier | Description |
|---|---------|-------------|
| 4-B-15 | `presentation/controllers/subscription.controller.ts` | Endpoints subscription |
| 4-B-16 | `presentation/controllers/webhook.controller.ts` | `POST /webhooks/stripe` — raw body obligatoire |
| 4-B-17 | `subscription.module.ts` | Module NestJS |
| 4-B-18 | Migration `012-create-subscriptions` | Table `subscriptions` |

#### Endpoints résumé

```
GET    /subscription                      → SubscriptionStatus
POST   /subscription/checkout?plan=pro    → { url: string } (Stripe Checkout)
POST   /subscription/portal               → { url: string } (Stripe Portal)
POST   /webhooks/stripe                   → 200 (raw body, no auth guard)
```

---

### 4-C · Frontend — Feature `analytics`

| # | Fichier | Description |
|---|---------|-------------|
| 4-C-01 | `models/Analytics.ts` | `WorkspaceAnalytics`, `PostAnalytics`, `AccountAnalytics`, `BestTimeSlot`, `AnalyticsDateRange` |
| 4-C-02 | `gateway/AnalyticsGateway.ts` | Port : getWorkspaceAnalytics, getPostAnalytics, getAccountAnalytics, getBestTime, exportCsv, syncNow |
| 4-C-03 | `usecases/fetchWorkspaceAnalytics/` | thunk — params: from, to, platform |
| 4-C-04 | `usecases/fetchPostAnalytics/` | thunk |
| 4-C-05 | `usecases/fetchAccountAnalytics/` | thunk |
| 4-C-06 | `usecases/fetchBestTimeToPost/` | thunk |
| 4-C-07 | `usecases/exportAnalytics/` | thunk — trigger download blob |
| 4-C-08 | `usecases/syncAnalytics/` | thunk — manual refresh |
| 4-C-09 | `slices/analyticsSlice.ts` | workspace, posts, accounts, bestTime, loading states |
| 4-C-10 | `slices/analyticsSelectors.ts` | selectWorkspaceAnalytics, selectPostAnalytics, selectBestTimeSlots |
| 4-C-11 | `infra/repo/HttpAnalyticsGateway.ts` | Adapter HTTP |
| 4-C-12 | `infra/ui/hooks/useWorkspaceAnalytics.ts` | date range picker + dispatch |
| 4-C-13 | `infra/ui/hooks/usePostAnalytics.ts` | métriques d'un post |
| 4-C-14 | `infra/ui/hooks/useExportAnalytics.ts` | trigger download + loading |
| 4-C-15 | `infra/ui/pages/AnalyticsDashboardPage.tsx` | Dashboard principal |
| 4-C-16 | `infra/ui/pages/PostAnalyticsDetailPage.tsx` | Métriques d'un post précis |
| 4-C-17 | `infra/ui/components/AnalyticsDateRangePicker.tsx` | Sélecteur last 7d / 30d / 90d / custom |
| 4-C-18 | `infra/ui/components/EngagementChart.tsx` | Recharts LineChart — likes + comments + shares |
| 4-C-19 | `infra/ui/components/ReachImpressionsChart.tsx` | Recharts AreaChart — reach vs impressions |
| 4-C-20 | `infra/ui/components/FollowersGrowthChart.tsx` | Recharts BarChart — croissance par semaine |
| 4-C-21 | `infra/ui/components/BestTimeHeatmap.tsx` | Grille 7×24 — intensité = engagement rate |
| 4-C-22 | `infra/ui/components/TopPostsTable.tsx` | Tableau top 5 posts par reach |
| 4-C-23 | `infra/ui/components/PlatformBreakdown.tsx` | Recharts PieChart — répartition par plateforme |
| 4-C-24 | `infra/ui/components/MetricCard.tsx` | Card KPI : valeur + variation % + icône |
| 4-C-25 | `infra/ui/components/ExportButton.tsx` | Bouton CSV — loading + download |
| 4-C-26 | `infra/ui/components/SyncAnalyticsButton.tsx` | Refresh manuel + last synced at |
| 4-C-27 | `infra/routes/analyticsRoutes.tsx` | Routes + loader |

---

### 4-D · Frontend — Feature `subscription`

| # | Fichier | Description |
|---|---------|-------------|
| 4-D-01 | `models/Subscription.ts` | `Subscription`, `Plan`, `PlanLimits` |
| 4-D-02 | `gateway/SubscriptionGateway.ts` | Port : getSubscription, createCheckout, createPortal |
| 4-D-03 | `usecases/fetchSubscription/` | thunk — chargé au boot workspace |
| 4-D-04 | `usecases/startCheckout/` | thunk — redirect vers Stripe Checkout |
| 4-D-05 | `usecases/openPortal/` | thunk — redirect vers Stripe Portal |
| 4-D-06 | `slices/subscriptionSlice.ts` | plan, status, limits, loading |
| 4-D-07 | `slices/subscriptionSelectors.ts` | selectCurrentPlan, selectPlanLimits, selectIsProOrAbove |
| 4-D-08 | `infra/repo/HttpSubscriptionGateway.ts` | Adapter HTTP |
| 4-D-09 | `infra/ui/hooks/useSubscription.ts` | plan actuel + limits + checkout/portal |
| 4-D-10 | `infra/ui/hooks/usePlanGuard.ts` | Hook UI : `canUseFeature(feature)` → bool, retourne le plan requis si non |
| 4-D-11 | `infra/ui/pages/PlansPage.tsx` | Comparaison plans — 3 colonnes + CTA |
| 4-D-12 | `infra/ui/pages/CheckoutSuccessPage.tsx` | Page retour Stripe success — confirmation + redirect |
| 4-D-13 | `infra/ui/pages/CheckoutCancelPage.tsx` | Page retour Stripe cancel |
| 4-D-14 | `infra/ui/components/PlanCard.tsx` | Card plan : features + prix + CTA + "Current plan" badge |
| 4-D-15 | `infra/ui/components/UpgradePrompt.tsx` | Banner inline sur features bloquées — "Upgrade to Pro" |
| 4-D-16 | `infra/ui/components/PlanBadge.tsx` | Badge dans header/sidebar : Free / Pro / Business |
| 4-D-17 | `infra/ui/components/UsageMeter.tsx` | Barre de progression posts / comptes / crédits IA utilisés |
| 4-D-18 | `infra/routes/subscriptionRoutes.tsx` | Routes /plans, /checkout/success, /checkout/cancel |
| 4-D-19 | `listeners/subscriptionListeners.ts` | Listener : on fetchSubscription.fulfilled → update ai credits limit |

---

## Variables d'environnement — Phase 4 (additions)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_ANNUAL=price_xxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxx
STRIPE_PRICE_BUSINESS_ANNUAL=price_xxx
```

---

## Tests — Phase 4

### Tests unitaires frontend (Vitest)

```
features/analytics/usecases/fetchWorkspaceAnalytics/__tests__/
  ✓ should populate analyticsSlice on success
  ✓ should handle empty data range
  ✓ should filter by platform

features/subscription/usecases/fetchSubscription/__tests__/
  ✓ should store plan + limits in store
  ✓ should set plan=free by default if no subscription

features/subscription/hooks/usePlanGuard/__tests__/
  ✓ canUseFeature('analytics') → true for Pro
  ✓ canUseFeature('analytics') → false for Free
  ✓ returns required plan for blocked feature
```

### Tests unitaires backend (Vitest)

```
modules/analytics/application/use-cases/get-workspace-analytics/
  ✓ should aggregate metrics across platforms
  ✓ should return empty metrics for date range with no posts
  ✓ should calculate engagement rate correctly

modules/analytics/application/jobs/sync-analytics.job/
  ✓ should call fetcherPort for each social account
  ✓ should save analytics records

modules/subscription/application/use-cases/handle-webhook/
  ✓ checkout.session.completed → subscription created
  ✓ customer.subscription.updated → plan updated
  ✓ customer.subscription.deleted → plan downgraded to free
  ✓ invoice.payment_failed → status=past_due + notification

modules/subscription/domain/services/plan-limits/
  ✓ Free → 10 posts, 2 accounts, 20 ai credits
  ✓ Pro → 100 posts, 10 accounts, 200 ai credits
  ✓ Business → unlimited

modules/subscription/shared/guards/plan.guard/
  ✓ @RequiresPlan(Plan.PRO) → 403 for Free workspace
  ✓ @RequiresPlan(Plan.PRO) → 200 for Pro workspace
```

### Tests d'intégration backend (Supertest)

```
GET /analytics/workspace?from=2024-06-01&to=2024-06-30
  ✓ 200 — métriques agrégées (mock Meta + TikTok API)
  ✓ 401 — non authentifié
  ✓ 403 — plan Free (PlanGuard)

GET /analytics/export?format=csv
  ✓ 200 — Content-Type: text/csv, blob retourné
  ✓ 403 — plan Free

GET /subscription
  ✓ 200 — plan + status + currentPeriodEnd

POST /subscription/checkout?plan=pro
  ✓ 200 — { url: "https://checkout.stripe.com/..." } (mock Stripe)

POST /webhooks/stripe (checkout.session.completed)
  ✓ 200 — subscription créée en base
  ✓ 400 — signature Stripe invalide

POST /webhooks/stripe (customer.subscription.deleted)
  ✓ 200 — plan downgraded to free
```

### Tests E2E (Playwright)

```
e2e/phase-4/analytics.spec.ts
  ✓ Analytics dashboard → KPI cards visibles
  ✓ Date range picker → change to last 30d → charts updated
  ✓ Platform filter → Facebook only → données filtrées
  ✓ Export CSV → fichier téléchargé
  ✓ Sync button → "Last synced" mis à jour
  ✓ Click post in TopPostsTable → redirect PostAnalyticsDetailPage

e2e/phase-4/subscription.spec.ts
  ✓ Free plan → Analytics page → UpgradePrompt visible
  ✓ Navigate to /plans → 3 plan cards visibles
  ✓ Click "Upgrade to Pro" → redirect Stripe Checkout (mock)
  ✓ Return to /checkout/success → plan badge = "Pro" dans header
  ✓ Navigate Stripe Portal (mock) → redirect back
  ✓ UsageMeter sur Free → shows 0/10 posts, 0/2 accounts

e2e/phase-4/plan-guard.spec.ts
  ✓ Free account → try to access Analytics → UpgradePrompt shown
  ✓ Free account → create 11th post → error toast "Upgrade plan"
  ✓ Pro account → Analytics accessible ✓
```

---

## Checklist de validation — Phase 4

### Build & Qualité

```
[ ] pnpm build → 0 erreurs
[ ] pnpm lint → 0 erreurs
[ ] pnpm typecheck → 0 erreurs
```

### Tests

```
[ ] pnpm test → 100% unitaires green
[ ] Coverage domain/usecases ≥ 80%
[ ] pnpm test:integration → 100% green
[ ] pnpm test:e2e → tous scénarios phase-4 green
```

### Architecture

```
[ ] AGENT_ARCHITECT validé
[ ] Stripe uniquement dans infrastructure/ (adapter)
[ ] Logique plan limits dans domain/services/ (pure, sans framework)
[ ] PlanGuard appliqué sur tous les endpoints premium
[ ] Webhook Stripe bypass AuthGuard mais vérifie signature Stripe
[ ] Analytics fetchers dans infrastructure/ (adapters Meta + TikTok)
```

### Sécurité

```
[ ] Stripe webhook : signature vérifiée avec STRIPE_WEBHOOK_SECRET ✓
[ ] Prix Stripe : définis côté serveur uniquement, jamais côté client ✓
[ ] PlanGuard côté backend (UX guard côté frontend = non sécurisé seul) ✓
```

### Fonctionnel

```
[ ] Analytics dashboard avec métriques (mock APIs) ✓
[ ] Date range picker → charts mis à jour ✓
[ ] Export CSV téléchargeable ✓
[ ] Sync manuelle déclenchable ✓
[ ] Plans page — 3 plans affichés ✓
[ ] Stripe Checkout redirect (mock) ✓
[ ] Webhook checkout.session.completed → plan Pro actif ✓
[ ] Webhook subscription.deleted → downgrade Free ✓
[ ] PlanGuard → 403 sur features premium pour Free ✓
[ ] UpgradePrompt affiché sur features bloquées ✓
[ ] UsageMeter précis par plan ✓
```

---

## Commandes de fin de phase (Release v1.0.0)

```bash
# Vérification finale complète
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm test:e2e

# Merge phase/4 → develop
git checkout develop && git merge --no-ff phase/4 -m "feat: phase 4 — analytics + subscription"

# Release v1.0.0 (MVP complet)
git checkout main && git merge --no-ff develop -m "release: v1.0.0 — MVP SocialPilot AI"
git tag -a v1.0.0 -m "v1.0.0: MVP complet — Auth + Posts + Social + AI + Calendar + Notifications + Analytics + Subscription"
git push origin main --tags

# Mettre à jour PROCESS.md → section historique
```

---

## Post-v1.0.0 — Backlog futur

Features hors scope MVP, à planifier en Phase 5+ :

| Feature | Priorité | Notes |
|---------|----------|-------|
| LinkedIn integration | Haute | OAuth2 LinkedIn API |
| Twitter/X integration | Haute | API X v2 |
| Team collaboration | Haute | Multi-members workspace avec rôles |
| Bulk scheduling CSV | Moyenne | Upload CSV → créer N posts |
| Post templates | Moyenne | Sauvegarder des templates de posts |
| Content recycling | Basse | Re-publier automatiquement les posts performants |
| AI auto-scheduling | Basse | IA choisit la meilleure heure basée sur analytics |
| Mobile app | Basse | React Native |
