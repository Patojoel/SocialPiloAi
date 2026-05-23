# PHASE-1.md — Connexion Réseaux Sociaux + Post basique

**Version cible :** v0.2.0  
**Durée estimée :** Semaine 3–5  
**Branche :** `phase/1`  
**Statut :** `NOT_STARTED`  
**Prérequis :** Phase 0 taguée `v0.1.0` sur `main`

---

## Objectif

Connecter des comptes Facebook, Instagram et TikTok via OAuth2. Créer, uploader des médias, publier immédiatement ou planifier un post sur un ou plusieurs comptes.

## Critère de sortie

> Un post texte + image publié avec succès sur une page Facebook connectée. Statut visible dans l'UI. Post planifié exécuté par la queue Bull.

---

## Livrables

### 1-A · Backend — Module `social-account`

| # | Fichier | Description |
|---|---------|-------------|
| 1-A-01 | `domain/entities/social-account.entity.ts` | Interface TS pure : id, workspaceId, platform, accountId, accountName, accessToken (chiffré), expiresAt |
| 1-A-02 | `domain/repositories/social-account.repository.ts` | Port |
| 1-A-03 | `application/use-cases/connect-facebook/` | Échange code OAuth → token, save compte |
| 1-A-04 | `application/use-cases/connect-instagram/` | Via Meta Graph (compte lié à une Page FB) |
| 1-A-05 | `application/use-cases/connect-tiktok/` | Échange code OAuth TikTok |
| 1-A-06 | `application/use-cases/list-social-accounts/` | Lister les comptes connectés du workspace |
| 1-A-07 | `application/use-cases/disconnect-social-account/` | Révoquer + supprimer |
| 1-A-08 | `application/use-cases/refresh-social-token/` | Renouvellement token Meta / TikTok |
| 1-A-09 | `infrastructure/persistence/entities/social-account.orm-entity.ts` | @Entity TypeORM |
| 1-A-10 | `infrastructure/persistence/repositories/typeorm-social-account.repository.ts` | Adapter |
| 1-A-11 | `infrastructure/crypto/token-cipher.service.ts` | AES-256-GCM chiffrement des tokens OAuth |
| 1-A-12 | `presentation/controllers/social-account.controller.ts` | GET /social-accounts, DELETE /:id |
| 1-A-13 | `presentation/controllers/oauth.controller.ts` | Callbacks OAuth FB, IG, TikTok |
| 1-A-14 | `social-account.module.ts` | Module NestJS |
| 1-A-15 | Migration `005-create-social-accounts` | Table `social_accounts` |

---

### 1-B · Backend — Module `media`

| # | Fichier | Description |
|---|---------|-------------|
| 1-B-01 | `domain/entities/media.entity.ts` | id, workspaceId, url, type (image/video), size, mimeType, createdAt |
| 1-B-02 | `domain/repositories/media.repository.ts` | Port |
| 1-B-03 | `domain/services/media-validator.service.ts` | Validation contraintes par plateforme |
| 1-B-04 | `application/use-cases/upload-media/` | Multipart → S3/R2 → save DB |
| 1-B-05 | `application/use-cases/list-media/` | Pagination workspace |
| 1-B-06 | `application/use-cases/delete-media/` | S3 delete + DB |
| 1-B-07 | `infrastructure/storage/s3-storage.adapter.ts` | Adapter S3/R2 |
| 1-B-08 | `infrastructure/storage/local-storage.adapter.ts` | Adapter local (dev uniquement) |
| 1-B-09 | `infrastructure/storage/storage.port.ts` | Interface Port storage |
| 1-B-10 | `infrastructure/persistence/entities/media.orm-entity.ts` | @Entity TypeORM |
| 1-B-11 | `presentation/controllers/media.controller.ts` | POST /media/upload, GET /media, DELETE /media/:id |
| 1-B-12 | `media.module.ts` | Module NestJS |
| 1-B-13 | Migration `006-create-media` | Table `media` |

---

### 1-C · Backend — Module `post`

| # | Fichier | Description |
|---|---------|-------------|
| 1-C-01 | `domain/entities/post.entity.ts` | Interface TS pure (voir ARCHITECTURE.md) |
| 1-C-02 | `domain/entities/post-result.entity.ts` | Résultat publication par plateforme : postId, platform, externalId, status, errorMessage |
| 1-C-03 | `domain/repositories/post.repository.ts` | Port |
| 1-C-04 | `domain/repositories/post-result.repository.ts` | Port |
| 1-C-05 | `application/use-cases/create-post/` | F-04-01 |
| 1-C-06 | `application/use-cases/update-post/` | F-04-02 — uniquement si status=draft/scheduled |
| 1-C-07 | `application/use-cases/delete-post/` | F-04-03 — cancel job Bull si scheduled |
| 1-C-08 | `application/use-cases/list-posts/` | F-04-04 — pagination + filtres |
| 1-C-09 | `application/use-cases/get-post/` | F-04-05 — détail + post_results |
| 1-C-10 | `application/use-cases/publish-now/` | F-04-06 — dispatch job Bull immédiat |
| 1-C-11 | `application/use-cases/schedule-post/` | F-04-07 — créer job Bull retardé |
| 1-C-12 | `application/use-cases/duplicate-post/` | F-04-08 — clone → draft |
| 1-C-13 | `infrastructure/persistence/entities/post.orm-entity.ts` | @Entity |
| 1-C-14 | `infrastructure/persistence/entities/post-result.orm-entity.ts` | @Entity |
| 1-C-15 | `infrastructure/persistence/repositories/typeorm-post.repository.ts` | Adapter |
| 1-C-16 | `presentation/controllers/post.controller.ts` | Tous les endpoints post |
| 1-C-17 | `presentation/dtos/create-post.dto.ts` | Validation DTO |
| 1-C-18 | `presentation/serializers/post.serializer.ts` | Post → ResponseDTO |
| 1-C-19 | `post.module.ts` | Module NestJS |
| 1-C-20 | Migration `007-create-posts` | Tables `posts`, `post_results`, `post_media` (pivot) |

---

### 1-D · Backend — Module `publisher` (service de publication)

| # | Fichier | Description |
|---|---------|-------------|
| 1-D-01 | `domain/ports/publisher.port.ts` | Interface `publish(post, account): Promise<ExternalPostResult>` |
| 1-D-02 | `infrastructure/facebook-publisher.adapter.ts` | Meta Graph API — créer post sur Page |
| 1-D-03 | `infrastructure/instagram-publisher.adapter.ts` | Meta Graph API — container + publish |
| 1-D-04 | `infrastructure/tiktok-publisher.adapter.ts` | TikTok for Business API |
| 1-D-05 | `application/publish-post.service.ts` | Orchestre multi-plateformes, save post_results |
| 1-D-06 | `publisher.module.ts` | Module NestJS |

---

### 1-E · Backend — Module `scheduler` (Bull queues)

| # | Fichier | Description |
|---|---------|-------------|
| 1-E-01 | `infrastructure/queues/publish-post.processor.ts` | @Processor Bull — exécute PublishPostService |
| 1-E-02 | `infrastructure/queues/publish-post.producer.ts` | Ajoute un job dans la queue |
| 1-E-03 | `application/schedule-post.service.ts` | Crée / annule les jobs Bull |
| 1-E-04 | `scheduler.module.ts` | BullModule.registerQueue('publish-post') |

**Configuration Bull :**
- Retry : 3 tentatives avec backoff exponentiel (1min, 5min, 15min)
- On failure finale → `post_results.status = 'failed'` + notification créée

---

### 1-F · Frontend — Feature `social-account`

| # | Fichier | Description |
|---|---------|-------------|
| 1-F-01 | `models/SocialAccount.ts` | `SocialAccount`, `Platform`, `ConnectionStatus` |
| 1-F-02 | `gateway/SocialAccountGateway.ts` | Port : list, disconnect, getConnectUrl |
| 1-F-03 | `usecases/listSocialAccounts/` | thunk |
| 1-F-04 | `usecases/disconnectSocialAccount/` | thunk |
| 1-F-05 | `usecases/initOAuthConnection/` | thunk — redirect vers URL OAuth |
| 1-F-06 | `slices/socialAccountSlice.ts` | EntityAdapter |
| 1-F-07 | `slices/socialAccountSelectors.ts` | selectByPlatform, selectConnectedAccounts |
| 1-F-08 | `infra/repo/HttpSocialAccountGateway.ts` | Adapter HTTP |
| 1-F-09 | `infra/ui/hooks/useSocialAccounts.ts` | liste + disconnect |
| 1-F-10 | `infra/ui/pages/SocialAccountsPage.tsx` | Page settings — connexions |
| 1-F-11 | `infra/ui/components/SocialAccountCard.tsx` | Card compte (avatar + nom + platform + disconnect btn) |
| 1-F-12 | `infra/ui/components/ConnectAccountButton.tsx` | Bouton connect par plateforme |
| 1-F-13 | `infra/ui/pages/OAuthCallbackPage.tsx` | Page intermédiaire — token exchange → redirect |
| 1-F-14 | `infra/routes/socialAccountRoutes.tsx` | Routes settings/social-accounts + callback |

---

### 1-G · Frontend — Feature `media`

| # | Fichier | Description |
|---|---------|-------------|
| 1-G-01 | `models/Media.ts` | `Media`, `MediaType`, `PlatformConstraints` |
| 1-G-02 | `gateway/MediaGateway.ts` | Port : upload, list, delete, getConstraints |
| 1-G-03 | `usecases/uploadMedia/` | thunk — FormData |
| 1-G-04 | `usecases/listMedia/` | thunk |
| 1-G-05 | `usecases/deleteMedia/` | thunk |
| 1-G-06 | `slices/mediaSlice.ts` | EntityAdapter + uploadProgress |
| 1-G-07 | `slices/mediaSelectors.ts` | selectAllMedia, selectUploadProgress |
| 1-G-08 | `infra/repo/HttpMediaGateway.ts` | Adapter HTTP (multipart) |
| 1-G-09 | `infra/ui/hooks/useMediaLibrary.ts` | liste + delete |
| 1-G-10 | `infra/ui/hooks/useMediaUpload.ts` | upload avec progress |
| 1-G-11 | `infra/ui/components/MediaLibrary.tsx` | Grid de médias |
| 1-G-12 | `infra/ui/components/MediaUploader.tsx` | Drop zone + preview + progress bar |
| 1-G-13 | `infra/ui/components/MediaPicker.tsx` | Modal sélection depuis bibliothèque |
| 1-G-14 | `infra/routes/mediaRoutes.tsx` | Routes |

---

### 1-H · Frontend — Feature `post`

| # | Fichier | Description |
|---|---------|-------------|
| 1-H-01 | `models/Post.ts` | `Post`, `PostStatus`, `Platform`, `PostResult` |
| 1-H-02 | `gateway/PostGateway.ts` | Port complet (voir AGENT_FRONTEND.md) |
| 1-H-03 | `usecases/listPosts/` | command (page, limit, filters) + response + thunk |
| 1-H-04 | `usecases/getPostById/` | thunk |
| 1-H-05 | `usecases/createPost/` | command + response + thunk |
| 1-H-06 | `usecases/updatePost/` | command + thunk |
| 1-H-07 | `usecases/deletePost/` | thunk |
| 1-H-08 | `usecases/publishNow/` | thunk |
| 1-H-09 | `usecases/schedulePost/` | command + thunk |
| 1-H-10 | `usecases/duplicatePost/` | thunk |
| 1-H-11 | `usecases/pollPostStatus/` | thunk — polling toutes les 5s si status=publishing |
| 1-H-12 | `slices/postSlice.ts` | EntityAdapter + currentId + filters |
| 1-H-13 | `slices/postSelectors.ts` | selectAllPosts, selectPostsByStatus, selectCurrentPost |
| 1-H-14 | `infra/repo/HttpPostGateway.ts` | Adapter HTTP (camelCase transform) |
| 1-H-15 | `infra/validation/postSchema.ts` | createPostSchema, schedulePostSchema |
| 1-H-16 | `infra/factories/PostFormFactory.ts` | buildFormValue |
| 1-H-17 | `infra/factories/PostCommandFactory.ts` | buildCreateCommand, buildScheduleCommand |
| 1-H-18 | `infra/ui/hooks/usePostList.ts` | liste + filtres + pagination |
| 1-H-19 | `infra/ui/hooks/useCreatePost.ts` | RHF + dispatch createPost + publishNow/schedule |
| 1-H-20 | `infra/ui/hooks/usePostDetail.ts` | détail + polling statut |
| 1-H-21 | `infra/ui/hooks/useDeletePost.ts` | confirm + dispatch delete |
| 1-H-22 | `infra/ui/pages/PostListPage.tsx` | Liste posts + filtres |
| 1-H-23 | `infra/ui/pages/PostCreatePage.tsx` | Éditeur nouveau post |
| 1-H-24 | `infra/ui/pages/PostEditPage.tsx` | Éditeur post existant |
| 1-H-25 | `infra/ui/pages/PostDetailPage.tsx` | Détail + statut par plateforme |
| 1-H-26 | `infra/ui/components/PostEditor.tsx` | Zone texte + CharCount + plateforme-aware |
| 1-H-27 | `infra/ui/components/PlatformSelector.tsx` | Checkbox multi-plateforme avec avatars comptes |
| 1-H-28 | `infra/ui/components/SchedulePicker.tsx` | DateTimePicker + timezone |
| 1-H-29 | `infra/ui/components/PostCard.tsx` | Card liste — contenu tronqué + statut badge + actions |
| 1-H-30 | `infra/ui/components/PostStatusBadge.tsx` | Badge coloré par statut |
| 1-H-31 | `infra/ui/components/PostResultRow.tsx` | Statut publication par plateforme (dans detail) |
| 1-H-32 | `infra/ui/components/PostFilters.tsx` | Filtres par statut + plateforme + date range |
| 1-H-33 | `infra/ui/components/PublishActions.tsx` | Boutons : Save Draft / Publish Now / Schedule |
| 1-H-34 | `infra/routes/postRoutes.tsx` | Routes + loaders |
| 1-H-35 | `listeners/postListeners.ts` | Listener : on publishNow.fulfilled → start polling |

---

## Variables d'environnement — Phase 1 (additions)

```bash
# Social OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/facebook/callback
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
TIKTOK_REDIRECT_URI=http://localhost:3000/auth/tiktok/callback

# Chiffrement tokens OAuth
ENCRYPTION_KEY=change-me-32-char-encryption-key!

# Storage
STORAGE_PROVIDER=local           # local en dev
STORAGE_BUCKET=socialpilot-media
STORAGE_PUBLIC_URL=http://localhost:3000/uploads

# Redis + Bull
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Tests — Phase 1

### Tests unitaires frontend (Vitest)

```
features/post/usecases/listPosts/__tests__/
  ✓ popule le store avec les posts retournés
  ✓ loading=true pendant pending
  ✓ set error sur échec réseau

features/post/usecases/createPost/__tests__/
  ✓ ajoute le post au store + set currentId
  ✓ rejectWithValue sur erreur API

features/post/usecases/publishNow/__tests__/
  ✓ met à jour le statut du post à 'publishing'
  ✓ déclenche le listener de polling

features/post/usecases/schedulePost/__tests__/
  ✓ met à jour scheduledAt + status='scheduled'

features/social-account/usecases/listSocialAccounts/__tests__/
  ✓ popule le store par plateforme

features/post/slices/__tests__/
  ✓ setCurrentPostId / clearCurrentPost
  ✓ extraReducers publish.fulfilled → status mis à jour
```

### Tests d'intégration backend (Supertest)

```
POST /media/upload
  ✓ 201 — fichier uploadé, URL retournée
  ✓ 422 — format non supporté
  ✓ 422 — taille dépassée

GET /social-accounts
  ✓ 200 — liste des comptes du workspace

GET /auth/facebook/connect
  ✓ 302 — redirect vers Meta OAuth URL

GET /auth/facebook/callback?code=xxx
  ✓ 302 — compte sauvegardé, redirect frontend

DELETE /social-accounts/:id
  ✓ 204 — compte déconnecté

POST /posts
  ✓ 201 — post créé en draft
  ✓ 422 — platforms vide

POST /posts/:id/publish
  ✓ 200 — job Bull créé, status=publishing
  ✓ 403 — workspace mismatch

POST /posts/:id/schedule
  ✓ 200 — scheduledAt enregistré, job Bull planifié
  ✓ 422 — date dans le passé

POST /posts/:id/duplicate
  ✓ 201 — nouveau post draft cloné

GET /posts
  ✓ 200 + pagination
  ✓ filtre par status
  ✓ filtre par platform
```

### Tests E2E (Playwright)

```
e2e/phase-1/social-connect.spec.ts
  ✓ Settings → Connect Facebook (mock OAuth) → compte visible
  ✓ Disconnect account → disparaît de la liste

e2e/phase-1/post-flow.spec.ts
  ✓ Create post → fill content → select FB account → Publish Now → status=published
  ✓ Create post → Schedule for tomorrow → status=scheduled → visible dans liste
  ✓ Edit draft post → update content → re-save
  ✓ Delete scheduled post → disparaît de la liste
  ✓ Duplicate post → nouveau draft créé

e2e/phase-1/media.spec.ts
  ✓ Upload image → visible dans MediaLibrary
  ✓ Create post → Open MediaPicker → select image → image attachée au post
  ✓ Delete media → disparaît de la bibliothèque
```

---

## Checklist de validation — Phase 1

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
[ ] pnpm test:e2e → tous scénarios phase-1 green
```

### Architecture

```
[ ] AGENT_ARCHITECT validé : boundaries hexagonales respectées
[ ] Tokens OAuth chiffrés (AES-256-GCM) en base
[ ] snake_case→camelCase uniquement dans Http*Gateway
[ ] Zéro appel direct API sociale depuis un controller (passe par use-case → publisher adapter)
[ ] Bull queue configurée : retry 3x avec backoff
```

### Fonctionnel

```
[ ] OAuth Facebook → token sauvegardé + compte visible ✓
[ ] OAuth TikTok → token sauvegardé + compte visible ✓
[ ] Upload image → URL S3/local disponible ✓
[ ] Create post + Publish Now → status=published (via mock API sociale) ✓
[ ] Create post + Schedule → job Bull créé ✓
[ ] Job Bull exécuté → post_result créé + status=published ✓
[ ] Job Bull failed 3x → status=failed + notification ✓
[ ] Duplicate post → draft cloné ✓
```

---

## Commandes de fin de phase

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm test:e2e

git checkout develop && git merge --no-ff phase/1 -m "feat: phase 1 — social accounts + posts"
git checkout main && git merge --no-ff develop -m "release: v0.2.0"
git tag -a v0.2.0 -m "Phase 1: Social Accounts + Posts + Media"
git push origin main --tags
```
