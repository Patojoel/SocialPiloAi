import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostOrmEntity } from './infrastructure/persistence/entities/post.orm-entity'
import { PostResultOrmEntity } from './infrastructure/persistence/entities/post-result.orm-entity'
import { TypeOrmPostRepository } from './infrastructure/persistence/repositories/typeorm-post.repository'
import { TypeOrmPostResultRepository } from './infrastructure/persistence/repositories/typeorm-post-result.repository'
import { POST_REPOSITORY } from './domain/repositories/post.repository'
import { POST_RESULT_REPOSITORY } from './domain/repositories/post-result.repository'
import { CreatePostUseCase } from './application/use-cases/create-post/create-post.use-case'
import { UpdatePostUseCase } from './application/use-cases/update-post/update-post.use-case'
import { DeletePostUseCase } from './application/use-cases/delete-post/delete-post.use-case'
import { ListPostsUseCase } from './application/use-cases/list-posts/list-posts.use-case'
import { GetPostUseCase } from './application/use-cases/get-post/get-post.use-case'
import { PublishNowUseCase } from './application/use-cases/publish-now/publish-now.use-case'
import { SchedulePostUseCase } from './application/use-cases/schedule-post/schedule-post.use-case'
import { DuplicatePostUseCase } from './application/use-cases/duplicate-post/duplicate-post.use-case'
import { PostController } from './presentation/controllers/post.controller'
import { SchedulerModule } from '../scheduler/scheduler.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([PostOrmEntity, PostResultOrmEntity]),
    forwardRef(() => SchedulerModule),
  ],
  providers: [
    { provide: POST_REPOSITORY, useClass: TypeOrmPostRepository },
    { provide: POST_RESULT_REPOSITORY, useClass: TypeOrmPostResultRepository },
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    ListPostsUseCase,
    GetPostUseCase,
    PublishNowUseCase,
    SchedulePostUseCase,
    DuplicatePostUseCase,
  ],
  controllers: [PostController],
  exports: [POST_REPOSITORY, POST_RESULT_REPOSITORY],
})
export class PostModule {}
