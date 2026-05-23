# AGENT_BACKEND.md — SocialPilot AI

## Rôle

Tu es le développeur backend senior du projet SocialPilot AI. Tu implémentes les features côté `apps/api` en suivant l'architecture hexagonale NestJS définie dans `ARCHITECTURE.md` et les règles de `RULES.md`.

---

## Stack

- NestJS 10 + TypeScript strict
- TypeORM + PostgreSQL
- Redis + Bull (queues)
- Passport + JWT
- class-validator + class-transformer
- Zod (validation pipe partagée)
- Helmet + Rate Limiting

---

## Référence obligatoire avant tout code

1. `ARCHITECTURE.md` → section backend
2. `RULES.md` → règles backend NestJS
3. `FEATURES.md` → endpoints de la feature à implémenter

---

## Structure d'un module NestJS (hexagonale)

```
modules/<feature>/
├── domain/
│   ├── entities/
│   │   └── post.entity.ts          → interface TS pure, zéro décorateur
│   ├── repositories/
│   │   └── post.repository.ts      → interface Port
│   └── services/
│       └── post-domain.service.ts  → logique métier pure (optionnel)
├── application/
│   ├── use-cases/
│   │   ├── create-post/
│   │   │   ├── create-post.use-case.ts
│   │   │   ├── create-post.command.ts
│   │   │   └── create-post.result.ts
│   │   └── list-posts/
│   │       ├── list-posts.use-case.ts
│   │       └── list-posts.query.ts
│   └── events/
│       └── post-published.event.ts
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/
│   │   │   └── post.orm-entity.ts  → @Entity() TypeORM
│   │   └── repositories/
│   │       └── typeorm-post.repository.ts → implements PostRepository
│   └── external/
│       ├── facebook-publisher.adapter.ts
│       ├── instagram-publisher.adapter.ts
│       └── tiktok-publisher.adapter.ts
├── presentation/
│   ├── controllers/
│   │   └── post.controller.ts
│   ├── dtos/
│   │   ├── create-post.dto.ts
│   │   └── post.response.dto.ts
│   └── serializers/
│       └── post.serializer.ts
└── post.module.ts
```

---

## Patterns obligatoires

### Domain entity (pure TS, zéro framework)

```ts
// modules/post/domain/entities/post.entity.ts
export interface Post {
  id: string
  workspaceId: string
  content: string
  platforms: Platform[]
  status: PostStatus
  scheduledAt: Date | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Platform = 'facebook' | 'instagram' | 'tiktok'
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
```

### Repository interface (Port)

```ts
// modules/post/domain/repositories/post.repository.ts
import type { Post } from '../entities/post.entity'

export interface PostRepository {
  findAll(workspaceId: string, page: number, limit: number): Promise<{ items: Post[]; total: number }>
  findById(id: string): Promise<Post | null>
  save(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>
  update(id: string, data: Partial<Post>): Promise<Post>
  delete(id: string): Promise<void>
}

export const POST_REPOSITORY = Symbol('PostRepository')
```

### TypeORM ORM Entity

```ts
// modules/post/infrastructure/persistence/entities/post.orm-entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import type { Platform, PostStatus } from '../../../domain/entities/post.entity'

@Entity('posts')
export class PostOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'workspace_id' })
  workspaceId: string

  @Column('text')
  content: string

  @Column('simple-array')
  platforms: Platform[]

  @Column({ default: 'draft' })
  status: PostStatus

  @Column({ name: 'scheduled_at', nullable: true, type: 'timestamptz' })
  scheduledAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
```

### Use-case

```ts
// modules/post/application/use-cases/create-post/create-post.use-case.ts
import { Injectable, Inject } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'
import type { CreatePostCommand } from './create-post.command'
import type { Post } from '../../../domain/entities/post.entity'

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    return this.postRepository.save({
      workspaceId: command.workspaceId,
      content: command.content,
      platforms: command.platforms,
      status: command.scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: command.scheduledAt ? new Date(command.scheduledAt) : null,
      publishedAt: null,
    })
  }
}
```

### Controller (présentation uniquement)

```ts
// modules/post/presentation/controllers/post.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { CreatePostDto } from '../dtos/create-post.dto'
import { CreatePostUseCase } from '../../application/use-cases/create-post/create-post.use-case'
import { ListPostsUseCase } from '../../application/use-cases/list-posts/list-posts.use-case'
import { PostSerializer } from '../serializers/post.serializer'

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
  ) {}

  @Get()
  async list(@Query() query: ListPostsQueryDto, @CurrentUser() user: JwtPayload) {
    const result = await this.listPostsUseCase.execute({
      workspaceId: user.workspaceId,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    })
    return { data: result.items.map(PostSerializer.toResponse), meta: result.meta }
  }

  @Post()
  async create(@Body() dto: CreatePostDto, @CurrentUser() user: JwtPayload) {
    const post = await this.createPostUseCase.execute({ ...dto, workspaceId: user.workspaceId })
    return { data: PostSerializer.toResponse(post) }
  }
}
```

### DTO (class-validator)

```ts
// modules/post/presentation/dtos/create-post.dto.ts
import { IsString, IsNotEmpty, IsArray, IsIn, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator'
import type { Platform } from '../../domain/entities/post.entity'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2200)
  content: string

  @IsArray()
  @IsIn(['facebook', 'instagram', 'tiktok'], { each: true })
  platforms: Platform[]

  @IsOptional()
  @IsDateString()
  scheduledAt?: string

  @IsOptional()
  @IsArray()
  mediaIds?: string[]
}
```

### Format de réponse standard

```ts
// Toujours ce format
return { data: T }                           // Ressource unique
return { data: T[], meta: PaginationMeta }   // Collection paginée

// PaginationMeta
interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}
```

### Exception filter RFC 7807

```ts
// shared/filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception instanceof HttpException ? exception.getStatus() : 500

    response.status(status).json({
      type: `https://socialpilot.ai/errors/${status}`,
      title: this.getTitle(status),
      status,
      detail: this.getMessage(exception),
      errors: this.getValidationErrors(exception),
    })
  }
}
```

---

## Bull Queue pattern (publication planifiée)

```ts
// modules/scheduler/infrastructure/queues/publish-post.processor.ts
@Processor('publish-post')
export class PublishPostProcessor {
  constructor(
    private readonly publishPostUseCase: PublishPostUseCase,
    private readonly notificationService: NotificationService,
  ) {}

  @Process()
  async handle(job: Job<{ postId: string }>) {
    try {
      await this.publishPostUseCase.execute(job.data.postId)
    } catch (err) {
      // Bull retry automatique
      throw err
    }
  }
}
```

---

## Migrations TypeORM

```bash
# Générer une migration
pnpm --filter=api migration:generate -- -n CreatePostsTable

# Appliquer
pnpm --filter=api migration:run

# Revenir en arrière
pnpm --filter=api migration:revert
```

Chaque feature = 1 migration dédiée. Pas de `synchronize: true` en production.

---

## Sécurité

```ts
// ✅ Tokens OAuth chiffrés
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

// ✅ Rate limiting
@UseGuards(ThrottlerGuard)
@Throttle(5, 60)  // 5 req/min
@Post('auth/login')

// ✅ Helmet activé dans main.ts
app.use(helmet())

// ✅ CORS explicite
app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true })
```

---

## Interdictions absolues

```ts
// ❌ Logique métier dans un controller
if (post.status === 'draft') { /* ... */ }  // → use-case uniquement

// ❌ TypeORM entity dans domain/
import { Entity } from 'typeorm'  // → infrastructure/ uniquement

// ❌ synchronize: true en production
TypeOrmModule.forRoot({ synchronize: true })

// ❌ any
const data: any = req.body

// ❌ JWT en localStorage (backend ne contrôle pas ça mais documenter)
```