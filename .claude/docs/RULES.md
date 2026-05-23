# RULES.md — SocialPilot AI

## Conventions & règles de code

> Ces règles sont non-négociables. Toute PR qui les viole est bloquée.

---

## 1. TypeScript

```
✅ strict mode toujours activé
✅ Pas de `any` — utiliser `unknown` + type guards
✅ Pas de `as unknown as X` — redesigner le type
✅ `interface` pour les shapes d'objets
✅ `type` pour les unions, intersections, mapped types
✅ Named exports partout
✅ Default exports uniquement pour les pages lazy-loaded
✅ Props toujours typées explicitement
✅ Composants = const arrow functions
✅ Path alias @/ → src/
```

**Type guards obligatoires pour les réponses API :**

```ts
// ✅ Correct
function isApiError(err: unknown): err is { message: string; status: number } {
  return typeof err === 'object' && err !== null && 'message' in err
}

// ❌ Interdit
const err = error as any
```

---

## 2. Architecture — Hexagonale

### Règle d'import stricte (frontend)

```
models/         → aucun import externe
gateway/        → importe models/ uniquement
usecases/       → importe models/, gateway/ uniquement
slices/         → importe models/, usecases/
infra/repo/     → importe gateway/, models/, HttpProvider
infra/ui/       → importe slices/, models/, shared/ui
infra/ui/hooks  → importe slices/ (selectors + dispatch), usecases/
```

**Violation d'architecture = PR bloquée.**

```ts
// ❌ INTERDIT — usecase qui importe de l'infra
import { HttpPostGateway } from '../infra/repo/HttpPostGateway' // dans un usecase

// ❌ INTERDIT — composant qui appelle fetch directement
const res = await fetch('/api/posts') // dans un composant

// ✅ Correct
dispatch(listPosts({ page: 1, limit: 20 })) // dans un hook
```

### Case transformation

```ts
// ❌ INTERDIT — dans un composant
const title = post.post_title

// ❌ INTERDIT — dans un usecase
const mapped = { name: dto.first_name }

// ✅ Correct — uniquement dans l'adapter (Http*Gateway)
return toCamelCase<Post>(dto)
```

---

## 3. React

```
✅ Pas de useEffect pour le data fetching
✅ Dispatch thunks au mount (loader) ou sur événement
✅ Selectors dans fichiers dédiés *Selectors.ts, jamais inline
✅ useAppDispatch / useAppSelector — jamais useDispatch/useSelector raw
✅ Logique métier dans les hooks use*.ts, pas dans les composants
✅ Composants = UI pure — lecture selectors + dispatch actions
✅ Pas de props drilling > 2 niveaux — utiliser selectors
```

**Pas de useEffect pour fetch :**

```ts
// ❌ INTERDIT
useEffect(() => {
  dispatch(listPosts({ page: 1 }))
}, [])

// ✅ Correct — via loader React Router
export const PostListLoader = (store: AppStore) => async () => {
  await store.dispatch(listPosts({ page: 1, limit: 20 }))
  return null
}

// ✅ Correct — via event (bouton, submit, etc.)
const handleSearch = () => dispatch(listPosts({ page: 1, search: term }))
```

---

## 4. Formulaires

```
✅ React Hook Form + Zod partout
✅ Schema Zod défini en premier, type inféré avec z.infer<>
✅ zodResolver() dans useForm()
✅ Erreurs backend mappées au niveau adapter/action, jamais dans le composant
✅ Factory pattern : FormFactory.buildFormValue() pour les valeurs par défaut
✅ CommandFactory.buildCommand() pour construire la commande depuis les données du form
```

```ts
// ✅ Pattern complet
const schema = z.object({
  title: z.string().min(1).max(280),
  platforms: z.array(z.enum(['facebook', 'instagram', 'tiktok'])).min(1),
})

type FormValues = z.infer<typeof schema>

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: PostFormFactory.buildFormValue(currentPost),
})
```

---

## 5. Redux Toolkit

```
✅ createEntityAdapter pour les collections (list de ressources)
✅ LoadingState enum : idle / pending / success / failed
✅ Slice = reducers sync + extraReducers pour thunks
✅ Pas de logique dans les reducers au-delà de l'état
✅ currentId dans le slice pour l'entité sélectionnée
✅ rejectWithValue({ message, status? }) dans tous les thunks
```

```ts
// ✅ LoadingState
export enum LoadingState {
  idle = 'idle',
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}
```

---

## 6. Tailwind CSS

```
✅ Utility classes dans JSX uniquement
✅ Pas de styles inline
✅ Pas de CSS modules (sauf legacy)
✅ Classes conditionnelles via cn() — clsx + twMerge
✅ Mobile-first : base → md: → lg:
✅ Tokens sémantiques shadcn/ui ou 21devs
```

```ts
// ✅ Correct
<button className={cn('px-4 py-2 rounded-lg', isActive && 'bg-primary text-white')} />

// ❌ Interdit
<button style={{ padding: '8px 16px' }} />
```

---

## 7. Backend NestJS

```
✅ Un module par feature (hexagonale)
✅ Repository pattern — interface dans domain/, implem dans infrastructure/
✅ DTO validés class-validator + ZodValidationPipe
✅ GlobalExceptionFilter → RFC 7807
✅ JWT en httpOnly cookie (production)
✅ Pas de logique dans les controllers — déléguer aux use-cases
✅ Bull pour toute tâche asynchrone (publication, email, sync analytics)
✅ Transactions TypeORM pour les opérations multi-tables
```

**Format de réponse standard :**

```ts
// Liste paginée
{
  data: T[],
  meta: { total: number, page: number, limit: number, totalPages: number }
}

// Ressource unique
{
  data: T
}

// Erreur (RFC 7807)
{
  type: string,
  title: string,
  status: number,
  detail: string,
  errors?: Record<string, string[]>  // validation errors
}
```

---

## 8. Sécurité

```
✅ JWT : httpOnly cookie en production, mémoire en dev
✅ JAMAIS localStorage pour les tokens
✅ Tokens OAuth sociaux chiffrés en base (AES-256)
✅ Rate limiting sur toutes les routes publiques (auth, ai)
✅ CORS configuré côté NestJS — origines explicites
✅ Helmet.js activé
✅ Variables d'environnement validées au démarrage (Joi/Zod)
✅ Pas de secrets dans le code — .env uniquement
✅ VITE_APP_ uniquement pour les variables exposées au browser
```

---

## 9. Tests

```
✅ Vitest pour unit tests
✅ Tester domain logic et usecases en isolation
✅ Mocker l'interface gateway, PAS la couche HTTP
✅ React Testing Library pour composants
✅ Playwright pour E2E
✅ Coverage minimum : 80% sur domain/ et usecases/
✅ Pas de tests snapshot — tests comportementaux
```

**Pattern de test usecase :**

```ts
// ✅ Mock du gateway (Port), pas de fetch
const mockPostGateway: PostGateway = {
  list: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1 }),
  create: vi.fn(),
  // ...
}

const store = createTestStore({ postGateway: mockPostGateway })
await store.dispatch(listPosts({ page: 1, limit: 20 }))
expect(selectAllPosts(store.getState())).toHaveLength(0)
```

---

## 10. Git & CI

```
✅ Branches : main / develop / feature/xxx / fix/xxx / phase/N
✅ Commits : Conventional Commits (feat:, fix:, chore:, docs:, test:)
✅ PR obligatoire pour merge sur main
✅ PR = description + checklist PROCESS.md + tests green
✅ Pas de merge si CI fail
✅ Tags : v0.1.0 (Phase 0), v0.2.0 (Phase 1), etc.
```

**Format de commit :**

```
feat(post): add schedule picker component
fix(auth): refresh token race condition
chore(monorepo): configure turbo pipelines
test(post): add usecase unit tests for createPost
docs(architecture): update feature structure diagram
```

---

## 11. Internationalisation (i18n)

```
✅ react-i18next
✅ Fichiers de traduction dans assets/locales/<lang>/
✅ Zéro string hardcodée dans les composants UI
✅ Clés de traduction : feature.component.key (ex: post.form.title)
✅ Langues initiales : fr (défaut), en
```

---

## 12. Performance

```
✅ Lazy loading des routes (React.lazy + Suspense)
✅ next/image → Vite : images via import statique ou CDN
✅ Selectors mémoïsés avec createSelector si calcul coûteux
✅ Pagination côté serveur — jamais de fetch all
✅ AbortController sur les requêtes annulables
✅ Debounce sur les champs de recherche (300ms)
```