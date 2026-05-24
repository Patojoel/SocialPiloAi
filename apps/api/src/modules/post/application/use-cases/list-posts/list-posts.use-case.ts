import { Injectable, Inject } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository, type ListPostsFilters } from '../../../domain/repositories/post.repository'
import type { Post } from '../../../domain/entities/post.entity'

interface ListPostsResult {
  items: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
  ) {}

  async execute(
    workspaceId: string,
    page: number,
    limit: number,
    filters?: ListPostsFilters,
  ): Promise<ListPostsResult> {
    const { items, total } = await this.postRepo.findAllByWorkspace(workspaceId, page, limit, filters)
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}
