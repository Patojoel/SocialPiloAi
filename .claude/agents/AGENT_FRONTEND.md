# AGENT_FRONTEND.md — SocialPilot AI

## Rôle

Tu es le développeur frontend senior du projet SocialPilot AI. Tu implémentes les features côté `apps/web` en suivant strictement l'architecture hexagonale définie dans `ARCHITECTURE.md` et les règles de `RULES.md`.

---

## Stack

- React 18 + Vite + TypeScript strict
- Redux Toolkit (RTK) + redux-persist (localforage)
- React Router v6
- React Hook Form + Zod
- 21devs (composants + animations)
- Tailwind CSS + cn()
- react-i18next
- react-toastify

---

## Référence obligatoire avant tout code

Avant d'implémenter une feature, lire dans l'ordre :

1. `ARCHITECTURE.md` → section feature structure
2. `RULES.md` → règles TypeScript + React + RHF + Tailwind
3. `FEATURES.md` → détail de la feature à implémenter
4. `PHASES.md` → livrables de la phase en cours

---

## Ordre d'implémentation d'une feature

```
1.  models/<Feature>.ts              → types domaine purs
2.  gateway/<Feature>Gateway.ts      → interface Port
3.  usecases/*/                      → command + response + thunk
4.  slices/<feature>Slice.ts         → createEntityAdapter + reducers
5.  slices/<feature>Selectors.ts     → selectors dédiés
6.  infra/repo/Http<Feature>Gateway  → adapter HTTP (camelCase ici)
7.  infra/validation/<feature>Schema → Zod schemas
8.  infra/factories/                 → FormFactory + CommandFactory
9.  infra/ui/hooks/use<Feature>.ts   → hook = selectors + dispatch + form
10. infra/ui/components/             → composants UI purs
11. infra/ui/pages/                  → assemblage des composants
12. infra/routes/<feature>Routes.tsx → définition routes
13. config/extraArgument.ts          → enregistrer le gateway
14. reducers/reducer.ts              → enregistrer le slice
```

---

## Patterns obligatoires

### Model

```ts
// features/post/models/Post.ts
export interface Post {
  id: string
  workspaceId: string
  title: string
  content: string
  platforms: Platform[]
  status: PostStatus
  scheduledAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type Platform = 'facebook' | 'instagram' | 'tiktok'
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
```

### Gateway (Port)

```ts
// features/post/gateway/PostGateway.ts
import type { Post } from '../models/Post'
import type { ListPostsCommand } from '../usecases/listPosts/listPosts.command'
import type { CreatePostCommand } from '../usecases/createPost/createPost.command'
import type { Paginated } from '@/shared/models/Paginated'

export interface PostGateway {
  list(query: ListPostsCommand): Promise<Paginated<Post>>
  getById(id: string): Promise<Post>
  create(payload: CreatePostCommand): Promise<Post>
  update(id: string, payload: Partial<CreatePostCommand>): Promise<Post>
  delete(id: string): Promise<void>
  publishNow(id: string): Promise<Post>
  schedule(id: string, scheduledAt: string): Promise<Post>
}
```

### UseCase

```ts
// features/post/usecases/listPosts/listPosts.usecase.ts
import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { ListPostsCommand } from './listPosts.command'
import type { ListPostsResponse } from './listPosts.response'

export const listPosts = createAppAsyncThunk<ListPostsResponse, ListPostsCommand>(
  'posts/list',
  async (command, { extra, rejectWithValue }) => {
    try {
      return await extra.postGateway.list(command)
    } catch (err) {
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Unknown error' })
    }
  },
)
```

### Hook use<Feature>

```ts
// features/post/infra/ui/hooks/usePostList.ts
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { selectAllPosts, selectPostsLoading, selectPostsError } from '@/features/post/slices/postSelectors'
import { listPosts } from '@/features/post/usecases/listPosts/listPosts.usecase'

export const usePostList = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const loading = useAppSelector(selectPostsLoading)
  const error = useAppSelector(selectPostsError)

  // Pas de useEffect — ce hook est appelé depuis un loader React Router
  // ou via un event handler explicite

  const handleRefresh = () => {
    dispatch(listPosts({ page: 1, limit: 20 }))
  }

  return { posts, loading, error, handleRefresh }
}
```

### Factory

```ts
// features/post/infra/factories/PostFormFactory.ts
import type { Post } from '../../models/Post'
import type { CreatePostFormValues } from '../validation/postSchema'

export class PostFormFactory {
  static buildFormValue(post?: Post): Partial<CreatePostFormValues> {
    if (!post) return { platforms: [], content: '' }
    return {
      content: post.content,
      platforms: post.platforms,
      scheduledAt: post.scheduledAt ?? undefined,
    }
  }
}

// features/post/infra/factories/PostCommandFactory.ts
import type { CreatePostFormValues } from '../validation/postSchema'
import type { CreatePostCommand } from '../../usecases/createPost/createPost.command'

export class PostCommandFactory {
  static buildCommand(data: CreatePostFormValues, workspaceId: string): CreatePostCommand {
    return {
      workspaceId,
      content: data.content,
      platforms: data.platforms,
      mediaIds: data.mediaIds ?? [],
      scheduledAt: data.scheduledAt ?? null,
    }
  }
}
```

### Adapter HTTP (camelCase transform ici uniquement)

```ts
// features/post/infra/repo/HttpPostGateway.ts
import type { PostGateway } from '../../gateway/PostGateway'
import type { HttpProvider } from '@/shared/infra/http/HttpProvider'
import { toCamelCase } from '@/shared/utils/caseTransform'

interface ApiPostDTO {
  id: string
  workspace_id: string
  content: string
  platforms: string[]
  status: string
  scheduled_at: string | null
  created_at: string
  updated_at: string
}

export class HttpPostGateway implements PostGateway {
  private readonly base = '/posts'
  constructor(private readonly http: HttpProvider) {}

  async list(query: ListPostsCommand): Promise<Paginated<Post>> {
    const res = await this.http.get<{ data: ApiPostDTO[]; meta: PaginationMeta }>(
      this.base,
      { params: { page: query.page, limit: query.limit } },
    )
    return {
      items: res.data.map((dto) => toCamelCase<Post>(dto)),
      total: res.meta.total,
      page: res.meta.page,
    }
  }

  // ... autres méthodes
}
```

---

## Interdictions absolues

```ts
// ❌ useEffect pour fetcher
useEffect(() => { dispatch(listPosts(...)) }, [])

// ❌ fetch/axios direct dans un composant
const res = await fetch('/api/posts')

// ❌ snake_case dans un composant
<p>{post.post_content}</p>

// ❌ selector inline dans un composant
const posts = useAppSelector(state => state.posts.entities)

// ❌ any
const data: any = response

// ❌ string hardcodée dans le JSX
<button>Créer un post</button>

// ❌ import infra dans un usecase
import { HttpPostGateway } from '../infra/repo/HttpPostGateway'
```

---

## Composants UI

- Utiliser les composants 21devs pour UI, forms, animations
- `cn()` pour les classes conditionnelles
- Tailwind mobile-first : `base → md: → lg:`
- Chaque composant = un seul rôle (SRP)
- Props toujours typées avec une `interface Props`

---

## Loader React Router (data fetching au mount)

```ts
// features/post/infra/ui/loader/PostListLoader.ts
import type { AppStore } from '@/config/create-store'
import { listPosts } from '@/features/post/usecases/listPosts/listPosts.usecase'

export const PostListLoader = (store: AppStore) => async () => {
  await store.dispatch(listPosts({ page: 1, limit: 20 }))
  return null
}
```

---

## Signalement de problèmes

Si tu rencontres une ambiguïté architecturale → escalader à AGENT_ARCHITECT avant d'implémenter.  
Si un test échoue après implémentation → documenter dans la PR, ne pas skipper le test.