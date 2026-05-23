# PHASE-2.md — Génération IA de contenu

**Version cible :** v0.3.0  
**Durée estimée :** Semaine 6–7  
**Branche :** `phase/2`  
**Statut :** `NOT_STARTED`  
**Prérequis :** Phase 1 taguée `v0.2.0` sur `main`

---

## Objectif

Intégrer une IA de génération de contenu (texte via OpenRouter, images via Higgsfield) directement dans l'éditeur de post. L'utilisateur peut générer un caption, des hashtags, des variations, reformuler, choisir un ton, et générer une image — le tout injectable en un clic dans le post.

## Critère de sortie

> Depuis l'éditeur de post : générer un caption + hashtags + image IA, les injecter dans le formulaire, et publier. Crédits IA décomptés correctement par plan.

---

## Livrables

### 2-A · Backend — Module `ai-generator`

#### Domain

| # | Fichier | Description |
|---|---------|-------------|
| 2-A-01 | `domain/entities/ai-usage.entity.ts` | id, workspaceId, userId, type (caption/hashtag/rephrase/variation/image), creditsUsed, createdAt |
| 2-A-02 | `domain/entities/saved-prompt.entity.ts` | id, workspaceId, name, prompt, createdAt |
| 2-A-03 | `domain/repositories/ai-usage.repository.ts` | Port : save, countByWorkspace(month) |
| 2-A-04 | `domain/repositories/saved-prompt.repository.ts` | Port CRUD |
| 2-A-05 | `domain/services/credits-guard.service.ts` | Logique : plan → limite mensuelle, vérification avant génération |
| 2-A-06 | `domain/ports/text-generator.port.ts` | Interface : `generateText(prompt, options): Promise<string>` |
| 2-A-07 | `domain/ports/image-generator.port.ts` | Interface : `generateImage(prompt, options): Promise<string>` (URL) |

#### Infrastructure — Adapters IA

| # | Fichier | Description |
|---|---------|-------------|
| 2-A-08 | `infrastructure/openrouter/openrouter.adapter.ts` | Implémente `TextGeneratorPort` — appel OpenRouter API |
| 2-A-09 | `infrastructure/openrouter/openrouter-prompts.ts` | Templates de prompts système par type (caption, hashtag, rephrase, variation) |
| 2-A-10 | `infrastructure/higgsfield/higgsfield.adapter.ts` | Implémente `ImageGeneratorPort` — appel Higgsfield `nano_banana_pro` |
| 2-A-11 | `infrastructure/higgsfield/higgsfield-poll.service.ts` | Polling du statut job Higgsfield jusqu'à completion |

#### Application — Use Cases

| # | Fichier | Description |
|---|---------|-------------|
| 2-A-12 | `application/use-cases/generate-caption/generate-caption.use-case.ts` | Prompt → OpenRouter → caption, décompte 1 crédit |
| 2-A-13 | `application/use-cases/generate-caption/generate-caption.command.ts` | topic, tone, platform, language, maxLength |
| 2-A-14 | `application/use-cases/generate-hashtags/generate-hashtags.use-case.ts` | Contenu → hashtags pertinents par plateforme, décompte 1 crédit |
| 2-A-15 | `application/use-cases/rephrase/rephrase.use-case.ts` | Texte existant → reformulé selon tone + length, 1 crédit |
| 2-A-16 | `application/use-cases/generate-variations/generate-variations.use-case.ts` | Texte → 3 variations, 2 crédits |
| 2-A-17 | `application/use-cases/generate-image/generate-image.use-case.ts` | Prompt → Higgsfield → URL image, 5 crédits |
| 2-A-18 | `application/use-cases/check-credits/check-credits.use-case.ts` | Retourne crédits restants ce mois |
| 2-A-19 | `application/use-cases/save-prompt/save-prompt.use-case.ts` | Sauvegarder un prompt favori |
| 2-A-20 | `application/use-cases/list-saved-prompts/` | Lister les prompts du workspace |
| 2-A-21 | `application/use-cases/delete-saved-prompt/` | Supprimer |

#### Presentation

| # | Fichier | Description |
|---|---------|-------------|
| 2-A-22 | `presentation/controllers/ai.controller.ts` | Tous les endpoints /ai/* |
| 2-A-23 | `presentation/dtos/generate-caption.dto.ts` | Validation |
| 2-A-24 | `presentation/dtos/generate-hashtags.dto.ts` | Validation |
| 2-A-25 | `presentation/dtos/rephrase.dto.ts` | Validation |
| 2-A-26 | `presentation/dtos/generate-variations.dto.ts` | Validation |
| 2-A-27 | `presentation/dtos/generate-image.dto.ts` | Validation |
| 2-A-28 | `ai-generator.module.ts` | Module NestJS + throttling IA |

#### Migrations

| # | Migration | Tables créées |
|---|-----------|--------------|
| 2-A-29 | `008-create-ai-usages` | `ai_usages` |
| 2-A-30 | `009-create-saved-prompts` | `saved_prompts` |

#### Limites par plan

| Plan | Crédits/mois | Caption | Image |
|------|-------------|---------|-------|
| Free | 20 | 1 crédit | 5 crédits |
| Pro | 200 | 1 crédit | 5 crédits |
| Business | 1000 | 1 crédit | 5 crédits |

---

### 2-B · Backend — Endpoints résumé

```
POST   /ai/generate-caption        → { caption: string, creditsUsed: number, creditsRemaining: number }
POST   /ai/generate-hashtags       → { hashtags: string[], creditsUsed: number, creditsRemaining: number }
POST   /ai/rephrase                → { text: string, creditsUsed: number, creditsRemaining: number }
POST   /ai/generate-variations     → { variations: string[], creditsUsed: number, creditsRemaining: number }
POST   /ai/generate-image          → { url: string, creditsUsed: number, creditsRemaining: number }
GET    /ai/credits                 → { used: number, remaining: number, limit: number, resetAt: string }
GET    /ai/prompts                 → Paginated<SavedPrompt>
POST   /ai/prompts                 → SavedPrompt
DELETE /ai/prompts/:id             → 204
```

---

### 2-C · Frontend — Feature `ai-generator`

#### Models & Gateway

| # | Fichier | Description |
|---|---------|-------------|
| 2-C-01 | `models/AiGenerator.ts` | `GenerateCaptionResult`, `GenerateHashtagsResult`, `GenerateVariationsResult`, `GenerateImageResult`, `AiCredits`, `SavedPrompt`, `AiTone` |
| 2-C-02 | `gateway/AiGeneratorGateway.ts` | Port : generateCaption, generateHashtags, rephrase, generateVariations, generateImage, getCredits, listSavedPrompts, savePrompt, deletePrompt |

#### Use Cases

| # | Fichier | Description |
|---|---------|-------------|
| 2-C-03 | `usecases/generateCaption/generate-caption.usecase.ts` | thunk — command: topic, tone, platform |
| 2-C-04 | `usecases/generateCaption/generate-caption.command.ts` | `topic, tone, platform, language?, maxLength?` |
| 2-C-05 | `usecases/generateHashtags/generate-hashtags.usecase.ts` | thunk |
| 2-C-06 | `usecases/rephrase/rephrase.usecase.ts` | thunk |
| 2-C-07 | `usecases/generateVariations/generate-variations.usecase.ts` | thunk |
| 2-C-08 | `usecases/generateImage/generate-image.usecase.ts` | thunk |
| 2-C-09 | `usecases/fetchCredits/fetch-credits.usecase.ts` | thunk |
| 2-C-10 | `usecases/savePrompt/save-prompt.usecase.ts` | thunk |
| 2-C-11 | `usecases/listSavedPrompts/` | thunk |
| 2-C-12 | `usecases/deletePrompt/` | thunk |

#### Slice & Selectors

| # | Fichier | Description |
|---|---------|-------------|
| 2-C-13 | `slices/aiGeneratorSlice.ts` | caption, hashtags, variations, imageUrl, credits, savedPrompts, loading states par type |
| 2-C-14 | `slices/aiGeneratorSelectors.ts` | selectCaption, selectVariations, selectImageUrl, selectCredits, selectAiLoading |

#### Infra

| # | Fichier | Description |
|---|---------|-------------|
| 2-C-15 | `infra/repo/HttpAiGeneratorGateway.ts` | Adapter HTTP — tous les endpoints /ai/* |
| 2-C-16 | `infra/validation/aiGeneratorSchema.ts` | Zod : generateCaptionSchema, rephraseSchema, generateImageSchema |
| 2-C-17 | `infra/factories/AiGeneratorCommandFactory.ts` | buildCaptionCommand, buildImageCommand |

#### Hooks

| # | Fichier | Description |
|---|---------|-------------|
| 2-C-18 | `infra/ui/hooks/useGenerateCaption.ts` | form (topic + tone + platform) + dispatch + inject result in post editor |
| 2-C-19 | `infra/ui/hooks/useGenerateHashtags.ts` | dispatch depuis contenu post existant |
| 2-C-20 | `infra/ui/hooks/useRephrase.ts` | form (text + tone) + dispatch |
| 2-C-21 | `infra/ui/hooks/useGenerateVariations.ts` | dispatch + sélection variation |
| 2-C-22 | `infra/ui/hooks/useGenerateImage.ts` | form (prompt + aspectRatio) + dispatch + inject |
| 2-C-23 | `infra/ui/hooks/useAiCredits.ts` | fetch + affichage crédits restants |
| 2-C-24 | `infra/ui/hooks/useSavedPrompts.ts` | CRUD prompts favoris |

#### Composants UI

| # | Fichier | Description |
|---|---------|-------------|
| 2-C-25 | `infra/ui/components/AIGeneratorPanel.tsx` | Drawer latéral — tabs : Caption / Hashtags / Rephrase / Variations / Image |
| 2-C-26 | `infra/ui/components/ToneSelector.tsx` | Select : Professional, Casual, Humorous, Inspirational, Urgent, Educational |
| 2-C-27 | `infra/ui/components/CaptionGenerator.tsx` | Form topic + tone + platform + btn Generate → résultat + btn Inject |
| 2-C-28 | `infra/ui/components/HashtagSuggestions.tsx` | Liste hashtags avec checkboxes — btn Append to post |
| 2-C-29 | `infra/ui/components/RephrasePanel.tsx` | Textarea existant + tone + btn Rephrase → résultat |
| 2-C-30 | `infra/ui/components/VariationCards.tsx` | 3 cards côte à côte — click → inject in editor |
| 2-C-31 | `infra/ui/components/AIImageGenerator.tsx` | Form prompt + aspect ratio + btn Generate → image preview + btn Use this image |
| 2-C-32 | `infra/ui/components/CreditsIndicator.tsx` | Badge : "XX crédits restants" — warning si < 10, error si 0 |
| 2-C-33 | `infra/ui/components/SavePromptButton.tsx` | Sauvegarder le prompt actuel avec un nom |
| 2-C-34 | `infra/ui/components/SavedPromptsList.tsx` | Dropdown liste prompts favoris — click → pré-remplir le form |
| 2-C-35 | `infra/ui/components/AILoadingState.tsx` | Skeleton animé pendant la génération |

#### Intégration dans PostEditor

| # | Modification | Description |
|---|-------------|-------------|
| 2-C-36 | `infra/ui/components/PostEditor.tsx` | Ajouter bouton ✨ "Generate with AI" → ouvre AIGeneratorPanel |
| 2-C-37 | `infra/ui/hooks/useCreatePost.ts` | Ajouter `injectAiContent(content)` — met à jour le champ content via RHF `setValue` |

---

## Variables d'environnement — Phase 2 (additions)

```bash
# OpenRouter
OPENROUTER_API_KEY=sk-or-your-openrouter-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o

# Higgsfield AI
HIGGSFIELD_API_KEY=your-higgsfield-api-key
HIGGSFIELD_BASE_URL=https://api.higgsfield.ai
HIGGSFIELD_DEFAULT_MODEL=nano_banana_pro
```

---

## Tests — Phase 2

### Tests unitaires frontend (Vitest)

```
features/ai-generator/usecases/generateCaption/__tests__/
  ✓ should set caption in store on success
  ✓ should set loading=pending during request
  ✓ should set error on API failure
  ✓ should reject with 'Insufficient credits' when credits = 0

features/ai-generator/usecases/generateVariations/__tests__/
  ✓ should store 3 variations in store
  ✓ should handle partial response (< 3 variations)

features/ai-generator/usecases/generateImage/__tests__/
  ✓ should set imageUrl in store on success
  ✓ should handle Higgsfield polling timeout

features/ai-generator/slices/__tests__/
  ✓ loading states indépendants par type (caption, image, etc.)
  ✓ reset state on clearAiResults
```

### Tests unitaires backend (Vitest)

```
modules/ai-generator/application/use-cases/generate-caption/
  ✓ should call textGeneratorPort with correct prompt
  ✓ should save ai_usage record
  ✓ should throw InsufficientCreditsException when limit reached
  ✓ should return caption + creditsRemaining

modules/ai-generator/domain/services/credits-guard/
  ✓ Free plan: 20 crédits/mois → throw si dépassé
  ✓ Pro plan: 200 crédits/mois
  ✓ Reset au 1er du mois

modules/ai-generator/infrastructure/openrouter/
  ✓ should build correct prompt for caption
  ✓ should build correct prompt for hashtags
  ✓ should handle OpenRouter API error (mock)
```

### Tests d'intégration backend (Supertest)

```
POST /ai/generate-caption
  ✓ 200 — caption retourné + crédits décomptés (mock OpenRouter)
  ✓ 402 — crédits insuffisants
  ✓ 422 — topic manquant
  ✓ 401 — non authentifié

POST /ai/generate-image
  ✓ 200 — imageUrl retourné (mock Higgsfield)
  ✓ 402 — crédits insuffisants (< 5)

GET /ai/credits
  ✓ 200 — used / remaining / limit / resetAt

POST /ai/prompts
  ✓ 201 — prompt sauvegardé

DELETE /ai/prompts/:id
  ✓ 204 — prompt supprimé
  ✓ 403 — pas le owner
```

### Tests E2E (Playwright)

```
e2e/phase-2/ai-generator.spec.ts
  ✓ PostEditor → Click "Generate with AI" → Panel ouvert
  ✓ Fill topic "summer sale" + tone "casual" → Generate → caption affiché
  ✓ Click "Inject" → caption injecté dans PostEditor
  ✓ Generate hashtags → sélectionner 3 → Append → hashtags ajoutés au content
  ✓ Generate 3 variations → click variation 2 → injectée dans editor
  ✓ Generate image → image preview → "Use this image" → image attachée au post
  ✓ Credits indicator : décrémente après chaque génération
  ✓ Save prompt → visible dans liste prompts favoris
  ✓ Select saved prompt → form pré-rempli
```

---

## Checklist de validation — Phase 2

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
[ ] pnpm test:e2e → tous scénarios phase-2 green
```

### Architecture

```
[ ] AGENT_ARCHITECT validé
[ ] OpenRouter + Higgsfield uniquement dans infrastructure/ (Adapters)
[ ] domain/ports/ contiennent uniquement des interfaces
[ ] CreditGuard dans domain/services/ (logique pure, sans framework)
[ ] Zéro appel direct fetch vers OpenRouter / Higgsfield depuis un controller
```

### Fonctionnel

```
[ ] Generate caption (mock OpenRouter) → injecté dans editor ✓
[ ] Generate hashtags → appendés au contenu ✓
[ ] Generate 3 variations → sélectionnable ✓
[ ] Generate image (mock Higgsfield) → attachée au post ✓
[ ] Crédits décomptés après chaque génération ✓
[ ] Erreur 402 affichée si crédits épuisés ✓
[ ] Save / list / delete prompts favoris ✓
[ ] CreditsIndicator se met à jour en temps réel ✓
```

---

## Commandes de fin de phase

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm test:e2e

git checkout develop && git merge --no-ff phase/2 -m "feat: phase 2 — AI content generator"
git checkout main && git merge --no-ff develop -m "release: v0.3.0"
git tag -a v0.3.0 -m "Phase 2: AI Generator (OpenRouter + Higgsfield)"
git push origin main --tags
```
