import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { CreatePostUseCase } from '../../application/use-cases/create-post/create-post.use-case'
import { UpdatePostUseCase } from '../../application/use-cases/update-post/update-post.use-case'
import { DeletePostUseCase } from '../../application/use-cases/delete-post/delete-post.use-case'
import { ListPostsUseCase } from '../../application/use-cases/list-posts/list-posts.use-case'
import { GetPostUseCase } from '../../application/use-cases/get-post/get-post.use-case'
import { PublishNowUseCase } from '../../application/use-cases/publish-now/publish-now.use-case'
import { SchedulePostUseCase } from '../../application/use-cases/schedule-post/schedule-post.use-case'
import { DuplicatePostUseCase } from '../../application/use-cases/duplicate-post/duplicate-post.use-case'
import { CreatePostDto } from '../dtos/create-post.dto'
import { UpdatePostDto } from '../dtos/update-post.dto'
import { ListPostsQueryDto } from '../dtos/list-posts-query.dto'
import { SchedulePostDto } from '../dtos/schedule-post.dto'
import { serializePost, serializePostDetail } from '../serializers/post.serializer'
import type { Platform, PostStatus } from '../../domain/entities/post.entity'

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly publishNowUseCase: PublishNowUseCase,
    private readonly schedulePostUseCase: SchedulePostUseCase,
    private readonly duplicatePostUseCase: DuplicatePostUseCase,
  ) {}

  private getWorkspaceId(workspaceId: string | undefined): string {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    return workspaceId
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreatePostDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const post = await this.createPostUseCase.execute({
      workspaceId: wsId,
      content: dto.content,
      platforms: dto.platforms as Platform[],
      mediaIds: dto.mediaIds,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
    })
    return { data: serializePost(post) }
  }

  @Get()
  async list(
    @Query() query: ListPostsQueryDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const result = await this.listPostsUseCase.execute(wsId, page, limit, {
      status: query.status as PostStatus | undefined,
      platform: query.platform as Platform | undefined,
      search: query.search,
    })
    return {
      data: result.items.map(serializePost),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    }
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const { post, results } = await this.getPostUseCase.execute(id, wsId)
    return { data: serializePostDetail(post, results) }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const post = await this.updatePostUseCase.execute({
      id,
      workspaceId: wsId,
      content: dto.content,
      platforms: dto.platforms as Platform[] | undefined,
      mediaIds: dto.mediaIds,
      scheduledAt: dto.scheduledAt !== undefined
        ? (dto.scheduledAt ? new Date(dto.scheduledAt) : null)
        : undefined,
    })
    return { data: serializePost(post) }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    await this.deletePostUseCase.execute(id, wsId)
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publishNow(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const post = await this.publishNowUseCase.execute(id, wsId)
    return { data: serializePost(post) }
  }

  @Post(':id/schedule')
  @HttpCode(HttpStatus.OK)
  async schedule(
    @Param('id') id: string,
    @Body() dto: SchedulePostDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const post = await this.schedulePostUseCase.execute({
      id,
      workspaceId: wsId,
      scheduledAt: new Date(dto.scheduledAt),
    })
    return { data: serializePost(post) }
  }

  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  async duplicate(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const post = await this.duplicatePostUseCase.execute(id, wsId)
    return { data: serializePost(post) }
  }
}
