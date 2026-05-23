# PHASE-3.md — Calendrier éditorial + Notifications

**Version cible :** v0.4.0  
**Durée estimée :** Semaine 8–10  
**Branche :** `phase/3`  
**Statut :** `NOT_STARTED`  
**Prérequis :** Phase 2 taguée `v0.3.0` sur `main`

---

## Objectif

Offrir une vue calendrier des posts planifiés avec drag & drop pour replanifier, et un système de notifications in-app + email pour tenir l'utilisateur informé des publications réussies ou échouées.

## Critère de sortie

> Calendrier mensuel/hebdomadaire affiché avec tous les posts planifiés. Drag & drop d'un post vers une nouvelle date fonctionnel. Notification in-app reçue après publication réussie ou échouée.

---

## Livrables

### 3-A · Backend — Extension module `post` (calendrier)

| # | Fichier | Description |
|---|---------|-------------|
| 3-A-01 | `application/use-cases/list-posts-calendar/list-posts-calendar.use-case.ts` | Query posts par range de dates (from/to) pour le calendrier |
| 3-A-02 | `application/use-cases/list-posts-calendar/list-posts-calendar.query.ts` | `workspaceId, from: Date, to: Date, platforms?: Platform[]` |
| 3-A-03 | `application/use-cases/reschedule-post/reschedule-post.use-case.ts` | Changer la date d'un post scheduled — cancel ancien job Bull + créer nouveau |
| 3-A-04 | `application/use-cases/reschedule-post/reschedule-post.command.ts` | `postId, newScheduledAt: Date` |
| 3-A-05 | `presentation/controllers/post.controller.ts` | Ajouter : `GET /posts/calendar?from=&to=&platforms=` et `PATCH /posts/:id/reschedule` |

---

### 3-B · Backend — Module `notification`

#### Domain

| # | Fichier | Description |
|---|---------|-------------|
| 3-B-01 | `domain/entities/notification.entity.ts` | id, workspaceId, userId, type (publish_success / publish_failure / system), title, message, isRead, data (JSON), createdAt |
| 3-B-02 | `domain/repositories/notification.repository.ts` | Port : save, findByUser(pagination), markAsRead, markAllAsRead, countUnread |
| 3-B-03 | `domain/ports/email-sender.port.ts` | Interface : `sendEmail(to, template, data): Promise<void>` |

#### Infrastructure

| # | Fichier | Description |
|---|---------|-------------|
| 3-B-04 | `infrastructure/persistence/entities/notification.orm-entity.ts` | @Entity TypeORM |
| 3-B-05 | `infrastructure/persistence/repositories/typeorm-notification.repository.ts` | Adapter |
| 3-B-06 | `infrastructure/email/resend-email.adapter.ts` | Implémente `EmailSenderPort` via Resend SDK |
| 3-B-07 | `infrastructure/email/templates/publish-success.template.ts` | Template email publication réussie |
| 3-B-08 | `infrastructure/email/templates/publish-failure.template.ts` | Template email publication échouée |

#### Application

| # | Fichier | Description |
|---|---------|-------------|
| 3-B-09 | `application/use-cases/create-notification/` | Créer une notification in-app |
| 3-B-10 | `application/use-cases/list-notifications/` | Pagination + filtres |
| 3-B-11 | `application/use-cases/mark-notification-read/` | Mark one as read |
| 3-B-12 | `application/use-cases/mark-all-read/` | Mark all as read |
| 3-B-13 | `application/services/notification.service.ts` | Orchestre création notif in-app + envoi email selon préférences |

#### Intégration avec `publisher`

| # | Fichier | Description |
|---|---------|-------------|
| 3-B-14 | `infrastructure/queues/publish-post.processor.ts` | On success → `NotificationService.notifyPublishSuccess(postId)` |
| 3-B-15 | `infrastructure/queues/publish-post.processor.ts` | On final failure → `NotificationService.notifyPublishFailure(postId, error)` |

#### Presentation

| # | Fichier | Description |
|---|---------|-------------|
| 3-B-16 | `presentation/controllers/notification.controller.ts` | Endpoints notifications |
| 3-B-17 | `presentation/dtos/notification.response.dto.ts` | Serialisation |
| 3-B-18 | `notification.module.ts` | Module NestJS |
| 3-B-19 | Migration `010-create-notifications` | Table `notifications` |

#### Endpoints résumé

```
GET    /notifications               → Paginated<Notification> (unread first)
GET    /notifications/unread-count  → { count: number }
PATCH  /notifications/:id/read      → 200
PATCH  /notifications/read-all      → 200
DELETE /notifications/:id           → 204
```

---

### 3-C · Frontend — Feature `calendar`

| # | Fichier | Description |
|---|---------|-------------|
| 3-C-01 | `models/Calendar.ts` | `CalendarPost` (Post allégé pour la vue calendrier : id, title preview, platforms, status, scheduledAt) |
| 3-C-02 | `gateway/CalendarGateway.ts` | Port : `listCalendarPosts(query): Promise<CalendarPost[]>` + `reschedule(id, newDate): Promise<Post>` |
| 3-C-03 | `usecases/listCalendarPosts/list-calendar-posts.usecase.ts` | thunk — query: from, to, platforms |
| 3-C-04 | `usecases/listCalendarPosts/list-calendar-posts.command.ts` | `from: string, to: string, platforms?: Platform[]` |
| 3-C-05 | `usecases/reschedulePost/reschedule-post.usecase.ts` | thunk — optimistic update + cancel si error |
| 3-C-06 | `usecases/reschedulePost/reschedule-post.command.ts` | `postId: string, newScheduledAt: string` |
| 3-C-07 | `slices/calendarSlice.ts` | posts (by date key), viewMode (month/week), currentRange, loading |
| 3-C-08 | `slices/calendarSelectors.ts` | selectPostsByDate, selectCurrentRange, selectCalendarLoading |
| 3-C-09 | `infra/repo/HttpCalendarGateway.ts` | Adapter HTTP |
| 3-C-10 | `infra/ui/hooks/useCalendar.ts` | navigation month/week + dispatch listCalendarPosts |
| 3-C-11 | `infra/ui/hooks/useReschedule.ts` | drag drop handler + dispatch reschedulePost + optimistic update |
| 3-C-12 | `infra/ui/pages/CalendarPage.tsx` | Page principale calendrier |
| 3-C-13 | `infra/ui/components/CalendarGrid.tsx` | Grille mensuelle — cellules cliquables |
| 3-C-14 | `infra/ui/components/WeekView.tsx` | Vue hebdomadaire avec colonnes par jour |
| 3-C-15 | `infra/ui/components/CalendarPostItem.tsx` | Mini card post dans une cellule : couleur platform + status |
| 3-C-16 | `infra/ui/components/CalendarNav.tsx` | Navigation mois précédent/suivant + today + switch month/week |
| 3-C-17 | `infra/ui/components/CalendarFilters.tsx` | Filtres par plateforme |
| 3-C-18 | `infra/ui/components/DragDropCalendar.tsx` | Wrapper HTML5 DnD — drag CalendarPostItem + drop sur cellule |
| 3-C-19 | `infra/ui/components/QuickCreatePopover.tsx` | Popover sur click cellule vide → shortcut vers création post avec date pré-remplie |
| 3-C-20 | `infra/routes/calendarRoutes.tsx` | Routes + loader (fetch mois courant) |

---

### 3-D · Frontend — Feature `notification`

| # | Fichier | Description |
|---|---------|-------------|
| 3-D-01 | `models/Notification.ts` | `Notification`, `NotificationType` |
| 3-D-02 | `gateway/NotificationGateway.ts` | Port : list, countUnread, markRead, markAllRead, delete |
| 3-D-03 | `usecases/listNotifications/` | thunk + pagination |
| 3-D-04 | `usecases/fetchUnreadCount/` | thunk |
| 3-D-05 | `usecases/markNotificationRead/` | thunk |
| 3-D-06 | `usecases/markAllNotificationsRead/` | thunk |
| 3-D-07 | `usecases/deleteNotification/` | thunk |
| 3-D-08 | `slices/notificationSlice.ts` | EntityAdapter + unreadCount |
| 3-D-09 | `slices/notificationSelectors.ts` | selectAllNotifications, selectUnreadCount, selectUnread |
| 3-D-10 | `infra/repo/HttpNotificationGateway.ts` | Adapter HTTP |
| 3-D-11 | `infra/ui/hooks/useNotifications.ts` | liste + mark read + delete |
| 3-D-12 | `infra/ui/hooks/useNotificationBell.ts` | unreadCount + polling toutes les 30s |
| 3-D-13 | `infra/ui/components/NotificationBell.tsx` | Icône cloche + badge unread count dans Header |
| 3-D-14 | `infra/ui/components/NotificationDropdown.tsx` | Dropdown 5 dernières notifs + "See all" |
| 3-D-15 | `infra/ui/components/NotificationItem.tsx` | Row : icon type + title + message + temps relatif + unread indicator |
| 3-D-16 | `infra/ui/pages/NotificationCenterPage.tsx` | Page dédiée — liste complète + pagination + "Mark all read" |
| 3-D-17 | `infra/routes/notificationRoutes.tsx` | Routes |
| 3-D-18 | `listeners/notificationListeners.ts` | Listener : on publishNow.fulfilled → dispatch fetchUnreadCount |

---

## Variables d'environnement — Phase 3

Pas de nouvelles variables requises pour cette phase.  
`RESEND_API_KEY` déjà ajouté en Phase 0 est utilisé pour les emails de notification.

```bash
# Templates email — optionnel : custom domain
EMAIL_FROM=noreply@socialpilot.ai
EMAIL_FROM_NAME=SocialPilot AI
```

---

## Tests — Phase 3

### Tests unitaires frontend (Vitest)

```
features/calendar/usecases/listCalendarPosts/__tests__/
  ✓ should populate calendarSlice with posts by date
  ✓ should load next month on navigation
  ✓ should filter by platform

features/calendar/usecases/reschedulePost/__tests__/
  ✓ should optimistically update scheduledAt in store
  ✓ should revert on API failure
  ✓ should call gateway with new date

features/notification/usecases/listNotifications/__tests__/
  ✓ should populate store with notifications
  ✓ unreadCount selector returns correct count

features/notification/usecases/markNotificationRead/__tests__/
  ✓ should update isRead=true in store
  ✓ should decrement unreadCount

features/notification/slices/__tests__/
  ✓ markAllRead → tous isRead=true, unreadCount=0
```

### Tests unitaires backend (Vitest)

```
modules/post/application/use-cases/list-posts-calendar/
  ✓ should return posts between from and to dates
  ✓ should filter by platform array
  ✓ should return empty array if no posts in range

modules/post/application/use-cases/reschedule-post/
  ✓ should update scheduledAt and recreate Bull job
  ✓ should throw if post not found
  ✓ should throw if post status is not 'scheduled'
  ✓ should cancel old Bull job before creating new one

modules/notification/application/services/notification.service/
  ✓ should create in-app notification on publish_success
  ✓ should create in-app notification on publish_failure
  ✓ should send email if user has email notifications enabled (mock Resend)
  ✓ should NOT send email if user has email notifications disabled
```

### Tests d'intégration backend (Supertest)

```
GET /posts/calendar?from=2024-06-01&to=2024-06-30
  ✓ 200 — liste des posts du mois
  ✓ 200 — filtre par platform=facebook
  ✓ 401 — non authentifié

PATCH /posts/:id/reschedule
  ✓ 200 — scheduledAt mis à jour
  ✓ 422 — date dans le passé
  ✓ 400 — post status != scheduled
  ✓ 403 — workspace mismatch

GET /notifications
  ✓ 200 — liste paginée, unread en premier
  ✓ 200 — page 2 avec curseur

GET /notifications/unread-count
  ✓ 200 — { count: N }

PATCH /notifications/:id/read
  ✓ 200 — isRead=true
  ✓ 403 — pas le owner

PATCH /notifications/read-all
  ✓ 200 — toutes marquées lues

DELETE /notifications/:id
  ✓ 204 — supprimée
```

### Tests E2E (Playwright)

```
e2e/phase-3/calendar.spec.ts
  ✓ Navigate to Calendar → posts planifiés visibles dans les cellules
  ✓ Navigate prev/next month → posts du mois correspondant chargés
  ✓ Switch to week view → posts de la semaine visibles
  ✓ Drag post from June 10 to June 15 → scheduledAt mis à jour + post déplacé
  ✓ Click empty cell → QuickCreate popover avec date pré-remplie
  ✓ Click post item in calendar → redirect PostDetailPage
  ✓ Filter by Facebook → seuls les posts Facebook visibles

e2e/phase-3/notifications.spec.ts
  ✓ Publish post → NotificationBell badge count +1
  ✓ Click bell → dropdown affiche la notification publish_success
  ✓ Click notification → markAsRead → badge décrémenté
  ✓ "Mark all read" → badge disparaît
  ✓ Navigate to NotificationCenter → liste complète visible
  ✓ Delete notification → disparaît de la liste
```

---

## Checklist de validation — Phase 3

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
[ ] pnpm test:e2e → tous scénarios phase-3 green
```

### Architecture

```
[ ] AGENT_ARCHITECT validé
[ ] EmailSenderPort dans domain/ — Resend adapter dans infrastructure/
[ ] Drag & drop n'appelle pas fetch directement (passe par hook → dispatch → thunk)
[ ] Optimistic update + rollback implémenté dans reschedulePost
[ ] Polling notifications via listener RTK (pas useEffect)
```

### Fonctionnel

```
[ ] Calendrier mensuel : posts planifiés visibles ✓
[ ] Calendrier hebdomadaire : vue fonctionnelle ✓
[ ] Drag & drop : post replanifié ✓
[ ] Click cellule vide : QuickCreate avec date ✓
[ ] Filtre plateforme calendrier ✓
[ ] Notification créée après publish success ✓
[ ] Notification créée après publish failure ✓
[ ] Email notification envoyé (mock Resend) ✓
[ ] NotificationBell badge count correct ✓
[ ] Mark read / Mark all read ✓
[ ] NotificationCenter page complète ✓
```

---

## Commandes de fin de phase

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm test:e2e

git checkout develop && git merge --no-ff phase/3 -m "feat: phase 3 — calendar + notifications"
git checkout main && git merge --no-ff develop -m "release: v0.4.0"
git tag -a v0.4.0 -m "Phase 3: Calendar + Notifications"
git push origin main --tags
```
