# Intégration Facebook — Guide complet

Ce guide explique pas à pas comment créer une application Facebook Developer, la configurer correctement, et lier un compte Facebook à SocialPilotAI pour publier des posts sur des Pages Facebook.

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Créer une application Facebook Developer](#2-créer-une-application-facebook-developer)
3. [Ajouter Facebook Login](#3-ajouter-facebook-login)
4. [Configurer les permissions](#4-configurer-les-permissions)
5. [Variables d'environnement](#5-variables-denvironnement)
6. [Flux OAuth — Comment ça fonctionne](#6-flux-oauth--comment-ça-fonctionne)
7. [Lier un compte Facebook dans l'application](#7-lier-un-compte-facebook-dans-lapplication)
8. [Publier un post sur une Page Facebook](#8-publier-un-post-sur-une-page-facebook)
9. [Passer en mode Production](#9-passer-en-mode-production)
10. [Dépannage](#10-dépannage)

---

## 1. Prérequis

- Un compte Facebook (celui qui sera admin de la Page Facebook à publier)
- Être admin de la Page Facebook sur laquelle tu veux publier
- Accès à [developers.facebook.com](https://developers.facebook.com)
- L'application SocialPilotAI en cours d'exécution localement (`http://localhost:3000` pour l'API, `http://localhost:5173` pour le frontend)

---

## 2. Créer une application Facebook Developer

### 2.1 Accéder au tableau de bord

1. Va sur [https://developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Clique sur **Create App** (ou **Créer une app**)

### 2.2 Choisir le type d'application

Lors de la création, Facebook te demande le type d'app :

| Type | Description | Recommandé ? |
|------|-------------|--------------|
| **Other** (Autre) | Accès complet aux produits disponibles | ✅ Oui |
| Business | Pour les apps liées à un Business Manager | Non (limitation des permissions) |
| Consumer | Pour les apps grand public | Possible |

> **Important** : Choisis **Other** → puis **Business** comme sous-type.  
> Le type "Business" avec Facebook Login for Business **ne supporte pas** `pages_manage_posts` via le scope OAuth — il faut utiliser Facebook Login classique.

### 2.3 Remplir les informations

- **App name** : `SocialPilotAI Dev` (ou autre nom descriptif)
- **App contact email** : ton email
- **Business Account** : optionnel pour le développement
- Clique **Create App**

### 2.4 Récupérer les clés

Une fois l'app créée, va dans :  
**Settings** → **Basic**

Tu trouveras :
- **App ID** → correspond à `FACEBOOK_APP_ID` dans le `.env`
- **App Secret** (clique "Show") → correspond à `FACEBOOK_APP_SECRET` dans le `.env`

---

## 3. Ajouter Facebook Login

### 3.1 Ajouter le produit

Dans le dashboard de ton app :
1. Clique **Add Product** dans le menu gauche
2. Cherche **Facebook Login**
3. Clique **Set Up**
4. Choisis **Web**
5. Entre l'URL du site : `http://localhost:3000`
6. Clique **Save** puis **Continue**

### 3.2 Configurer les redirect URIs

1. Menu gauche → **Facebook Login** → **Settings**
2. Dans le champ **Valid OAuth Redirect URIs**, ajoute :
   ```
   http://localhost:3000/api/v1/auth/facebook/callback
   ```
3. Clique **Save Changes**

> **Pourquoi cette URL ?**  
> Après l'autorisation OAuth, Facebook redirige le navigateur de l'utilisateur vers cette URL. L'API NestJS reçoit alors le `code` d'autorisation et l'échange contre un `access_token`.

---

## 4. Configurer les permissions

### 4.1 Comprendre les niveaux d'accès

Facebook distingue deux niveaux pour chaque permission :

| Niveau | Description |
|--------|-------------|
| **Standard Access** (Développement) | Utilisable uniquement par les admins/testeurs de l'app, sans App Review |
| **Advanced Access** (Production) | Disponible pour tous les utilisateurs, nécessite une App Review officielle |

En **mode développement**, tu peux utiliser toutes les permissions en Standard Access sans review, mais uniquement avec ton propre compte (admin de l'app).

### 4.2 Permissions requises pour SocialPilotAI

| Permission | Rôle |
|------------|------|
| `public_profile` | Récupérer le nom et l'ID de l'utilisateur lors de la connexion |
| `pages_show_list` | Lister les Pages Facebook que l'utilisateur administre |
| `pages_read_engagement` | Lire les données de la page (requis avec `pages_manage_posts`) |
| `pages_manage_posts` | Créer et publier des posts sur une Page Facebook |

### 4.3 Ajouter les permissions via Use Cases

> **Note importante** : Dans la nouvelle interface Meta (2024+), les permissions doivent être liées à un **Use Case**. Sans ça, elles sont considérées comme "Invalid Scopes" lors de l'OAuth.

1. Menu gauche → **Use Cases**
2. Clique **Add** ou **Get started** sur le cas **"Create and manage content"** (ou "Créer et gérer du contenu")
3. Dans ce Use Case, active :
   - `pages_manage_posts` ✓
   - `pages_read_engagement` ✓
4. Clique **Save**

### 4.4 Vérifier dans Permissions and Features

1. Menu gauche → **App Review** → **Permissions and Features**
2. Vérifie que `pages_manage_posts` et `pages_read_engagement` apparaissent dans ta liste
3. Le statut doit être **"Development"** (suffisant pour tester)

---

## 5. Variables d'environnement

Dans `apps/api/.env`, configure les variables suivantes :

```env
# Identifiants de l'application Facebook
FACEBOOK_APP_ID=<ton App ID>
FACEBOOK_APP_SECRET=<ton App Secret>

# URL de callback OAuth (doit correspondre exactement à ce qui est configuré dans Facebook Login)
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/v1/auth/facebook/callback
```

> **Ne jamais committer le `.env`** avec de vraies clés dans git. Le fichier est dans `.gitignore`.

---

## 6. Flux OAuth — Comment ça fonctionne

Voici le flux complet de la connexion d'un compte Facebook dans SocialPilotAI :

```
Utilisateur clique "Connect Facebook"
        │
        ▼
Frontend → GET /api/v1/social-accounts/connect/facebook
        │
        ▼
API génère l'URL OAuth Facebook :
https://www.facebook.com/v18.0/dialog/oauth
  ?client_id=APP_ID
  &redirect_uri=http://localhost:3000/api/v1/auth/facebook/callback
  &state=WORKSPACE_ID
  &scope=public_profile,pages_show_list,pages_read_engagement,pages_manage_posts
  &response_type=code
        │
        ▼
Navigateur redirigé vers Facebook
Utilisateur autorise l'application
        │
        ▼
Facebook redirige vers :
http://localhost:3000/api/v1/auth/facebook/callback?code=AUTH_CODE&state=WORKSPACE_ID
        │
        ▼
API (OAuthController) reçoit le code
        │
        ▼
ConnectFacebookUseCase :
  1. Échange le code contre un user access token
     POST https://graph.facebook.com/v18.0/oauth/access_token
       ?client_id=APP_ID&client_secret=APP_SECRET
       &redirect_uri=REDIRECT_URI&code=AUTH_CODE
  2. Récupère l'identité de l'utilisateur
     GET https://graph.facebook.com/me?fields=id,name&access_token=TOKEN
  3. Chiffre le token (AES-256-GCM)
  4. Sauvegarde en base de données (table social_accounts)
        │
        ▼
API redirige vers le frontend :
http://localhost:5173/social-accounts?connected=facebook
        │
        ▼
Toast de succès affiché à l'utilisateur
```

### Pourquoi le token est-il chiffré ?

L'`access_token` Facebook donne accès à la page au nom de l'utilisateur. S'il est volé, un attaquant pourrait publier du contenu. Le chiffrement AES-256-GCM en base de données protège contre les fuites de données SQL.

---

## 7. Lier un compte Facebook dans l'application

### Étapes dans l'interface

1. Dans l'application, va dans **Social Accounts**
2. Clique sur **Connect** sous la section Facebook
3. Une fenêtre Facebook s'ouvre — **accepte toutes les permissions** :
   - Accès au profil public ✓
   - Accès à tes Pages ✓
   - Gérer les posts de tes Pages ✓
4. Tu es redirigé vers l'application avec un message de succès

### Ce qui est stocké en base de données

La table `social_accounts` contient :

| Colonne | Valeur exemple | Description |
|---------|---------------|-------------|
| `platform` | `facebook` | Réseau social |
| `account_id` | `10225...` | ID Facebook de l'utilisateur |
| `account_name` | `Jean Dupont` | Nom affiché sur Facebook |
| `access_token_encrypted` | `iv:tag:data` | Token chiffré AES-256-GCM |
| `expires_at` | `2026-07-01` | Date d'expiration du token |
| `status` | `active` | État de la connexion |

### Pages disponibles

Une fois le compte connecté, tu peux voir les Pages Facebook associées en cliquant sur l'avatar du compte dans la barre "Connected accounts" de la page Posts.

L'API appelle `GET /me/accounts` avec le token stocké pour lister les pages que l'utilisateur administre.

---

## 8. Publier un post sur une Page Facebook

### Flux de publication

```
Utilisateur clique "Publish Now"
        │
        ▼
Frontend → POST /api/v1/posts/:id/publish
        │
        ▼
PublishNowUseCase → met le post en status "publishing"
                  → envoie dans la queue Bull
        │
        ▼
Worker Bull (PublishPostService) :
  1. Récupère le post en base
  2. Résout les URLs des médias (images/vidéos) depuis Cloudinary
  3. Déchiffre l'access token de l'account Facebook
        │
        ▼
FacebookPublisherAdapter :
  1. GET /me/accounts → récupère la liste des Pages avec leur page access token
  2. Selon les médias attachés :

     Aucun média → POST /{page-id}/feed
       { message, access_token: PAGE_TOKEN }

     1 image    → POST /{page-id}/photos
       { url: IMAGE_URL, message, access_token: PAGE_TOKEN }

     N images   → Pour chaque image :
                    POST /{page-id}/photos?published=false
                    → obtient un photo_id
                  Puis POST /{page-id}/feed
                    { message, attached_media: [photo_ids], access_token: PAGE_TOKEN }
        │
        ▼
Facebook Graph API publie le post sur la Page
        │
        ▼
Post mis à jour : status "published", publishedAt = now
```

### Pourquoi utiliser le Page Access Token ?

Le token Facebook obtenu via OAuth est un **User Access Token** — il représente l'utilisateur.

Pour publier sur une **Page**, Facebook exige un **Page Access Token** — qui représente la Page elle-même. Ce token est retourné dans `/me/accounts` et contient nativement les droits d'administration de la Page.

```
User Access Token  →  GET /me/accounts  →  Page Access Token (par page)
                                           └─ POST /{page-id}/feed ✓
```

---

## 9. Passer en mode Production

En mode développement, seuls les admins et testeurs de l'app Facebook peuvent se connecter.

Pour permettre à n'importe quel utilisateur de connecter son compte :

### 9.1 Passer l'app en mode Live

1. Dashboard de l'app → toggle **In development** → **Live**
2. Facebook peut demander une Privacy Policy URL — fournis l'URL de ta politique de confidentialité

### 9.2 Soumettre les permissions à l'App Review

Pour chaque permission avancée (`pages_manage_posts`, `pages_read_engagement`) :

1. Menu gauche → **App Review** → **Permissions and Features**
2. Pour chaque permission → clique **Request Advanced Access**
3. Remplis le formulaire :
   - Description de l'usage (ex: "Our app publishes marketing content to Facebook Pages on behalf of social media managers")
   - Vidéo de démonstration du flux OAuth
   - Screencast montrant comment la permission est utilisée
4. Soumets — Meta review prend généralement 3 à 7 jours

### 9.3 Configurer les redirect URIs de production

Dans **Facebook Login** → **Settings**, ajoute l'URL de production :
```
https://api.ton-domaine.com/api/v1/auth/facebook/callback
```

Et dans le `.env` de production :
```env
FACEBOOK_APP_ID=<même App ID>
FACEBOOK_APP_SECRET=<même App Secret>
FRONTEND_URL=https://app.ton-domaine.com
```

---

## 10. Dépannage

### "Invalid Scopes: pages_manage_posts"

**Cause** : La permission n'est pas liée à un Use Case dans la console Facebook.  
**Solution** : Ajouter le Use Case "Create and manage content" dans la console → ré-activer `pages_manage_posts`.

### "Malformed access token"

**Cause** : L'ancienne version de l'app stockait le code OAuth (pas le token) dans la base de données.  
**Solution** : Déconnecter le compte dans Social Accounts → reconnecter.

### "(#200) requires pages_read_engagement and pages_manage_posts"

**Cause** : Le token actuel n'inclut pas ces permissions (connexion faite avant leur ajout).  
**Solution** : Déconnecter → reconnecter pour obtenir un nouveau token avec les bonnes permissions.

### "OAuthException code 190 — Malformed access token"

**Cause** : Le token stocké est expiré ou invalide.  
**Solution** :
1. Vérifier la date `expires_at` dans la table `social_accounts`
2. Si expiré → déconnecter et reconnecter le compte
3. Les tokens Facebook expirent généralement après 60 jours (long-lived token)

### Le post est publié mais n'apparaît pas sur la Page

**Causes possibles** :
- La Page a des paramètres de modération activés → vérifier les posts "en attente" dans la Page Facebook
- Le compte n'est pas admin de la Page → vérifier le rôle dans les paramètres de la Page
- Le token utilisé appartient à un utilisateur sans droits de publication → déconnecter et reconnecter avec le bon compte

### La fenêtre OAuth se ferme sans redirection

**Cause** : L'URL de redirect n'est pas enregistrée dans Facebook Login.  
**Solution** : Vérifier que `http://localhost:3000/api/v1/auth/facebook/callback` est bien dans les **Valid OAuth Redirect URIs** de Facebook Login → Settings.

---

## Récapitulatif — Checklist de mise en place

```
□ App Facebook créée (type: Other → Business)
□ App ID et App Secret récupérés et mis dans .env
□ Facebook Login (classique) ajouté comme produit
□ Redirect URI configuré : http://localhost:3000/api/v1/auth/facebook/callback
□ Use Case "Create and manage content" ajouté
□ Permissions activées : pages_manage_posts + pages_read_engagement
□ API redémarrée après modification du .env
□ Compte Facebook déconnecté et reconecté dans Social Accounts
□ Post de test publié avec succès sur la Page
```
