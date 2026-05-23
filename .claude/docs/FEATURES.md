# FEATURES.md — SocialPilot AI

## Catalogue complet des fonctionnalités

---

## F-01 · Authentification & Gestion de compte

**Priorité :** Critique — Phase 0  
**Backend :** NestJS + Passport JWT  
**Frontend :** `features/auth`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-01-01 | Register | Inscription email + mot de passe, vérification email |
| F-01-02 | Login | Connexion JWT, refresh token, httpOnly cookie |
| F-01-03 | Logout | Invalidation token côté serveur |
| F-01-04 | Forgot Password | Email de réinitialisation + token temporaire |
| F-01-05 | Reset Password | Formulaire de nouveau mot de passe |
| F-01-06 | Profile | Mise à jour nom, email, avatar, mot de passe |

### API Endpoints

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/me
PATCH  /auth/me
```

---

## F-02 · Workspace

**Priorité :** Critique — Phase 0  
**Backend :** NestJS  
**Frontend :** `features/workspace`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-02-01 | Create Workspace | Création d'un espace de travail (marque/projet) |
| F-02-02 | List Workspaces | Voir tous ses workspaces |
| F-02-03 | Switch Workspace | Changer de workspace actif (header `X-Workspace-Id`) |
| F-02-04 | Update Workspace | Modifier nom, logo, timezone |
| F-02-05 | Delete Workspace | Suppression + cascade |
| F-02-06 | Invite Members | Inviter collaborateurs par email (MVP : owner only) |

### API Endpoints

```
POST   /workspaces
GET    /workspaces
GET    /workspaces/:id
PATCH  /workspaces/:id
DELETE /workspaces/:id
POST   /workspaces/:id/members/invite
```

---

## F-03 · Connexion Réseaux Sociaux

**Priorité :** Critique — Phase 1  
**Backend :** NestJS + OAuth2  
**Frontend :** `features/social-account`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-03-01 | Connect Facebook Page | OAuth2 Meta — récupération pages managées |
| F-03-02 | Connect Instagram | Via Meta Graph API (compte pro lié à une page FB) |
| F-03-03 | Connect TikTok | OAuth2 TikTok for Business |
| F-03-04 | List Accounts | Voir comptes connectés par plateforme |
| F-03-05 | Disconnect Account | Révoquer token + supprimer liaison |
| F-03-06 | Refresh Token | Renouvellement automatique des tokens expirés |

### API Endpoints

```
GET    /social-accounts
GET    /social-accounts/:id
DELETE /social-accounts/:id
GET    /auth/facebook/connect
GET    /auth/facebook/callback
GET    /auth/instagram/connect
GET    /auth/instagram/callback
GET    /auth/tiktok/connect
GET    /auth/tiktok/callback
```

---

## F-04 · Gestion des Posts

**Priorité :** Critique — Phase 1  
**Backend :** NestJS  
**Frontend :** `features/post`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-04-01 | Create Post | Création texte + médias, choix des comptes cibles |
| F-04-02 | Edit Post | Modification avant publication/planification |
| F-04-03 | Delete Post | Suppression draft ou planifié |
| F-04-04 | List Posts | Vue liste avec filtres (statut, plateforme, date) |
| F-04-05 | Post Detail | Vue détail + statut de publication par plateforme |
| F-04-06 | Publish Now | Publication immédiate multi-comptes |
| F-04-07 | Schedule Post | Planification avec date/heure + timezone |
| F-04-08 | Duplicate Post | Cloner un post existant |
| F-04-09 | Post Status | Tracking statut : draft / scheduled / published / failed |

### Statuts d'un post

```
DRAFT → SCHEDULED → PUBLISHING → PUBLISHED
                              ↘ FAILED (retry possible)
```

### API Endpoints

```
POST   /posts
GET    /posts
GET    /posts/:id
PATCH  /posts/:id
DELETE /posts/:id
POST   /posts/:id/publish
POST   /posts/:id/schedule
POST   /posts/:id/duplicate
GET    /posts/:id/status
```

---

## F-05 · Génération IA de contenu

**Priorité :** Haute — Phase 2  
**Backend :** NestJS + OpenRouter API  
**Frontend :** `features/ai-generator`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-05-01 | Generate Caption | Générer un texte de post depuis un prompt ou sujet |
| F-05-02 | Generate Hashtags | Suggestions de hashtags par plateforme |
| F-05-03 | Rephrase | Reformuler un texte existant (ton, longueur) |
| F-05-04 | Generate Variations | 3 variations d'un même contenu |
| F-05-05 | Tone Selector | Professionnel, casual, humour, inspirant... |
| F-05-06 | Platform-Aware | Adapter le contenu selon la plateforme cible |
| F-05-07 | Generate Image | Génération d'image via Higgsfield AI |
| F-05-08 | Save Prompt | Sauvegarder ses prompts favoris |

### Modèles IA utilisés

| Modèle | Usage | Provider |
|--------|-------|----------|
| `gpt-4o` / `claude-3.5-sonnet` | Génération texte | OpenRouter |
| Higgsfield `nano_banana_pro` | Génération image | Higgsfield |

### API Endpoints

```
POST   /ai/generate-caption
POST   /ai/generate-hashtags
POST   /ai/rephrase
POST   /ai/variations
POST   /ai/generate-image
GET    /ai/prompts
POST   /ai/prompts
DELETE /ai/prompts/:id
```

---

## F-06 · Gestion des Médias

**Priorité :** Haute — Phase 1  
**Backend :** NestJS + S3 (ou Cloudflare R2)  
**Frontend :** `features/media`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-06-01 | Upload Media | Upload image/vidéo avec validation format/taille |
| F-06-02 | Media Library | Bibliothèque des médias uploadés |
| F-06-03 | Delete Media | Suppression S3 + DB |
| F-06-04 | Platform Constraints | Validation par plateforme (ratio, taille, durée) |

### Contraintes par plateforme

| Plateforme | Image | Vidéo |
|------------|-------|-------|
| Facebook | JPEG/PNG ≤ 30MB | MP4 ≤ 4GB, ≤ 240min |
| Instagram | JPEG/PNG 4:5 ratio recommandé | MP4 ≤ 650MB, 3–60s (feed) |
| TikTok | — | MP4 9:16, ≤ 287.6MB, 15s–10min |

### API Endpoints

```
POST   /media/upload
GET    /media
DELETE /media/:id
GET    /media/constraints/:platform
```

---

## F-07 · Calendrier éditorial

**Priorité :** Moyenne — Phase 3  
**Frontend :** `features/calendar`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-07-01 | Calendar View | Vue mensuelle/hebdomadaire des posts planifiés |
| F-07-02 | Drag & Drop | Déplacer un post planifié dans le calendrier |
| F-07-03 | Quick Create | Créer un post depuis une case du calendrier |

---

## F-08 · Analytics

**Priorité :** Basse — Phase 4  
**Backend :** NestJS + Meta Graph API + TikTok Analytics  
**Frontend :** `features/analytics`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-08-01 | Post Performance | Likes, comments, shares, reach, impressions |
| F-08-02 | Account Overview | Croissance followers, engagement rate |
| F-08-03 | Best Time to Post | Analyse des meilleures heures par plateforme |
| F-08-04 | Export Report | Export PDF/CSV des analytics |

---

## F-09 · Notifications

**Priorité :** Moyenne — Phase 3  
**Backend :** NestJS + Bull events  
**Frontend :** `features/notification`

### Sous-fonctionnalités

| ID | Nom | Description |
|----|-----|-------------|
| F-09-01 | In-App Notifications | Alertes publication réussie/échouée |
| F-09-02 | Email Notifications | Email digest quotidien / alertes critiques |
| F-09-03 | Notification Center | Liste des notifications avec statut lu/non-lu |

---

## F-10 · Subscription & Billing

**Priorité :** Basse — Phase 4  
**Backend :** NestJS + Stripe  
**Frontend :** `features/subscription`

### Plans

| Plan | Posts/mois | Comptes sociaux | IA credits/mois |
|------|-----------|-----------------|-----------------|
| Free | 10 | 2 | 20 |
| Pro | 100 | 10 | 200 |
| Business | ∞ | ∞ | 1000 |