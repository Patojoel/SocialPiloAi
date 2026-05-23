# PROCESS.md — SocialPilot AI

## Workflow de développement

> Ce document définit le cycle obligatoire pour chaque phase.  
> **Aucune phase ne démarre sans que la précédente soit VALIDATED.**

---

## Cycle de vie d'une phase

```
┌─────────────────────────────────────────────────────────────┐
│                      PHASE N LIFECYCLE                      │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│  PLAN    │  BUILD   │  TEST    │  REVIEW  │    VALIDATE     │
│          │          │          │          │                 │
│ Architect│ Frontend │  Tester  │ Reviewer │   Architect     │
│ + Backend│ + Backend│          │          │   sign-off      │
└──────────┴──────────┴──────────┴──────────┴─────────────────┘
     ↓          ↓          ↓          ↓              ↓
  Kick-off   Feature    All tests   Issues       Tag + Merge
  meeting    branches    green      fixed        → Phase N+1
```

---

## Étape 1 — PLAN (Début de phase)

**Agent responsable :** AGENT_ARCHITECT

### Actions

1. Lire `PHASES.md` → identifier tous les livrables de la phase
2. Vérifier que la phase précédente est taguée (`vX.Y.0`) et mergée sur `main`
3. Créer la branche de phase : `git checkout -b phase/N develop`
4. Décomposer chaque livrable en tâches atomiques (issues GitHub/Linear)
5. Assigner les tâches aux agents (frontend/backend)
6. Mettre à jour `PROCESS.md` → section "Phase en cours"

### Checklist PLAN

```
[ ] Phase N-1 tag présent sur main
[ ] Branche phase/N créée depuis develop
[ ] Issues créées pour chaque livrable
[ ] Tâches assignées
[ ] .env.example mis à jour si nouvelles variables
[ ] Dépendances npm identifiées et documentées
```

---

## Étape 2 — BUILD (Implémentation)

**Agents responsables :** AGENT_FRONTEND + AGENT_BACKEND

### Règles de build

- Une feature = une branche : `feature/<nom>` depuis `phase/N`
- Commits Conventional Commits à chaque unité de travail
- Pas de PR sur `main` depuis une feature branch — passer par `phase/N`
- Self-review avant tout PR : relire sa diff, enlever les console.log, vérifier les types

### Ordre d'implémentation recommandé

```
Backend :
  1. Migrations DB
  2. Domain entities + Repository interfaces (Ports)
  3. Infrastructure : TypeORM repositories (Adapters)
  4. Application : Use-cases
  5. Presentation : DTOs + Controllers
  6. Tests d'intégration

Frontend :
  1. models/ — types domaine
  2. gateway/ — interface Port
  3. usecases/ — command + response + thunk
  4. slices/ — slice + selectors
  5. infra/repo/ — Http*Gateway
  6. infra/validation/ — Zod schemas
  7. infra/factories/ — Form + Command factories
  8. infra/ui/hooks/ — use* hooks
  9. infra/ui/components/ — composants UI
  10. infra/ui/pages/ — assemblage final
  11. infra/routes/ — routes
  12. Tests unitaires usecases
```

### Checklist BUILD (par feature)

```
[ ] Modèles domaine définis
[ ] Gateway interface créée
[ ] Use-cases implémentés
[ ] Adapter HTTP implémenté (camelCase transform ici uniquement)
[ ] Slice + selectors créés
[ ] Validation Zod définie
[ ] Factories créées (form + command)
[ ] Hook use<Feature> complet
[ ] Composants UI assemblés
[ ] Routes configurées
[ ] Pas de `any` TypeScript
[ ] Pas de strings hardcodées (i18n)
[ ] Pas de useEffect pour fetch
[ ] Pas d'appel HTTP direct dans composants/hooks
[ ] console.log retiré
```

---

## Étape 3 — TEST

**Agent responsable :** AGENT_TESTER

### Niveaux de tests obligatoires

#### 3.1 Tests unitaires (Vitest)

```bash
pnpm test --filter=web
pnpm test --filter=api
```

Couverture minimale obligatoire :
- `domain/` et `usecases/` (frontend) : **≥ 80%**
- `application/use-cases/` (backend) : **≥ 80%**

**Pattern de test usecase frontend :**

```ts
describe('listPosts usecase', () => {
  it('should load posts into store', async () => {
    const mockGateway: PostGateway = {
      list: vi.fn().mockResolvedValue({ items: [fakePost], total: 1, page: 1 }),
    }
    const store = createTestStore({ postGateway: mockGateway })
    await store.dispatch(listPosts({ page: 1, limit: 20 }))
    expect(selectAllPosts(store.getState())).toHaveLength(1)
    expect(selectPostsLoading(store.getState())).toBe(false)
  })

  it('should set error on failure', async () => {
    const mockGateway: PostGateway = {
      list: vi.fn().mockRejectedValue(new Error('Network error')),
    }
    const store = createTestStore({ postGateway: mockGateway })
    await store.dispatch(listPosts({ page: 1, limit: 20 }))
    expect(selectPostsError(store.getState())).toBe('Network error')
  })
})
```

#### 3.2 Tests d'intégration (Backend)

```bash
pnpm test:integration --filter=api
```

- Utiliser une DB de test (PostgreSQL in-memory ou Docker Compose test)
- Tester les happy paths + cas d'erreur des endpoints critiques

#### 3.3 Tests E2E (Playwright)

```bash
pnpm test:e2e
```

Scénarios E2E obligatoires par phase définis dans `PHASES.md`.

### Checklist TEST

```
[ ] pnpm test → 0 erreurs
[ ] Coverage domain/usecases ≥ 80%
[ ] Tests intégration backend → green
[ ] Tests E2E phase → green
[ ] Pas de test skippé (`.skip`) sans raison documentée
```

---

## Étape 4 — REVIEW

**Agent responsable :** AGENT_REVIEWER

### Processus de review

1. PR créée de `phase/N` vers `develop`
2. AGENT_REVIEWER exécute la checklist complète
3. Issues classées en 3 niveaux :
   - 🔴 **BLOCKING** — viole les rules ou casse les tests → doit être fixé avant merge
   - 🟡 **IMPROVEMENT** — n'est pas bloquant mais doit être adressé dans cette phase
   - 🟢 **SUGGESTION** — style ou optimisation, peut être reporté

### Checklist REVIEW

#### Architecture

```
[ ] Aucun import domain/ → infra/
[ ] Aucun import usecase/ → infra/
[ ] snake_case→camelCase uniquement dans Http*Gateway
[ ] Aucun appel HTTP direct dans composants ou hooks
[ ] Aucun useEffect pour data fetching
[ ] Selectors dans fichiers dédiés, jamais inline
```

#### TypeScript

```
[ ] Zéro `any`
[ ] Zéro `as unknown as X`
[ ] Tous les props typés explicitement
[ ] Type guards utilisés pour les assertions
```

#### Sécurité

```
[ ] Tokens non stockés en localStorage
[ ] Pas de secret dans le code
[ ] OAuth tokens chiffrés en base
[ ] Rate limiting configuré sur routes sensibles
```

#### Qualité

```
[ ] Zéro console.log en production
[ ] Zéro string hardcodée dans les composants
[ ] Factories utilisées pour form values et commands
[ ] Gestion d'erreur dans tous les thunks (rejectWithValue)
[ ] Notify.error() appelé sur les rejections dans les hooks
```

#### Tests

```
[ ] Tests ajoutés pour toute nouvelle feature
[ ] Coverage ≥ 80% sur domain/usecases
[ ] Pas de test skippé sans justification
```

### Rapport de review

Le reviewer crée un fichier `review-phase-N.md` dans `docs/reviews/` :

```markdown
# Code Review — Phase N

**Date :** YYYY-MM-DD  
**Reviewer :** AGENT_REVIEWER  
**Statut :** BLOCKED | APPROVED

## Issues bloquantes
- [ ] #123 — description

## Améliorations requises
- [ ] #124 — description

## Suggestions
- #125 — description

## Décision
[ ] APPROVED — prêt pour validation
[ ] BLOCKED — issues bloquantes à corriger
```

---

## Étape 5 — FIX

**Agents responsables :** AGENT_FRONTEND + AGENT_BACKEND

- Tous les issues 🔴 BLOCKING doivent être résolus
- Commit sur la même branche `phase/N`
- Re-run des tests après chaque fix
- Si nouveau bug introduit par un fix → traiter immédiatement

```bash
# Après fix, re-run complet
pnpm test && pnpm test:integration && pnpm test:e2e
```

---

## Étape 6 — VALIDATE

**Agent responsable :** AGENT_ARCHITECT

### Checklist VALIDATE

```
[ ] Tous les issues BLOCKING résolus
[ ] CI entièrement verte (lint + test + build)
[ ] AGENT_REVIEWER a re-approuvé
[ ] Critère de sortie de la phase (PHASES.md) satisfait
[ ] .env.example à jour
[ ] CHANGELOG.md mis à jour
[ ] No merge conflicts
```

### Actions de validation

```bash
# Merge phase/N → develop
git checkout develop
git merge --no-ff phase/N -m "feat: phase N complete"

# Merge develop → main
git checkout main
git merge --no-ff develop -m "release: vX.Y.0"

# Tag
git tag -a vX.Y.0 -m "Phase N: <description>"
git push origin main --tags

# Mettre à jour PROCESS.md
# → Phase en cours → passer à Phase N+1
```

---

## Phase en cours

```
Phase : 0 — Fondations
Statut : NOT_STARTED
Branche : —
Dernière action : —
Prochain milestone : Login + Workspace opérationnels
```

---

## Historique des phases

| Phase | Version | Date | Statut |
|-------|---------|------|--------|
| 0 | v0.1.0 | — | NOT_STARTED |
| 1 | v0.2.0 | — | NOT_STARTED |
| 2 | v0.3.0 | — | NOT_STARTED |
| 3 | v0.4.0 | — | NOT_STARTED |
| 4 | v1.0.0 | — | NOT_STARTED |

---

## Commandes utiles

```bash
# Lancer tout en dev
pnpm dev

# Tests unitaires watch
pnpm test --watch --filter=web

# Tests integration
pnpm test:integration --filter=api

# E2E
pnpm test:e2e

# Build production
pnpm build

# Lint
pnpm lint

# Type check
pnpm typecheck

# Nouvelle migration
pnpm --filter=api migration:generate -- -n <NomMigration>

# Appliquer migrations
pnpm --filter=api migration:run
```