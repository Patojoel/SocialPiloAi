import type { PostGateway } from '../../gateway/PostGateway'
import type { HttpProvider } from '@/shared/infra/http/HttpProvider'
import type { Post, PostStatus, Platform } from '../../models/Post'
import type { Paginated } from '@/shared/models/Paginated'
import { toCamelCase } from '@/shared/utils/caseTransform'

interface ApiPost {
  id: string
  workspace_id: string
  content: string
  platforms: Platform[]
  status: PostStatus
  media_ids: string[]
  scheduled_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

interface ApiPaginatedPosts {
  data: ApiPost[]
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export class HttpPostGateway implements PostGateway {
  constructor(private readonly http: HttpProvider) {}

  async list(query: { page: number; limit: number; status?: PostStatus; platform?: Platform }): Promise<Paginated<Post>> {
    const params: Record<string, string | number | boolean> = {
      page: query.page,
      limit: query.limit,
    }
    if (query.status) params['status'] = query.status
    if (query.platform) params['platform'] = query.platform

    const res = await this.http.get<ApiPaginatedPosts>('/posts', { params })
    return {
      items: res.data.map((p) => toCamelCase<Post>(p)),
      total: res.meta.total,
      page: res.meta.page,
      limit: res.meta.limit,
      totalPages: res.meta.total_pages,
    }
  }

  async getById(id: string): Promise<Post> {
    const res = await this.http.get<{ data: ApiPost }>(`/posts/${id}`)
    return toCamelCase<Post>(res.data)
  }

  async create(payload: { content: string; platforms: Platform[]; mediaIds: string[]; scheduledAt: string | null }): Promise<Post> {
    const res = await this.http.post<{ data: ApiPost }>('/posts', {
      content: payload.content,
      platforms: payload.platforms,
      mediaIds: payload.mediaIds,
      scheduledAt: payload.scheduledAt,
    })
    return toCamelCase<Post>(res.data)
  }

  async update(id: string, payload: Partial<{ content: string; platforms: Platform[]; scheduledAt: string | null }>): Promise<Post> {
    const body: Record<string, unknown> = {}
    if (payload.content !== undefined) body['content'] = payload.content
    if (payload.platforms !== undefined) body['platforms'] = payload.platforms
    if (payload.scheduledAt !== undefined) body['scheduledAt'] = payload.scheduledAt

    const res = await this.http.patch<{ data: ApiPost }>(`/posts/${id}`, body)
    return toCamelCase<Post>(res.data)
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/posts/${id}`)
  }

  async publishNow(id: string): Promise<Post> {
    const res = await this.http.post<{ data: ApiPost }>(`/posts/${id}/publish`)
    return toCamelCase<Post>(res.data)
  }

  async schedule(id: string, scheduledAt: string): Promise<Post> {
    const res = await this.http.post<{ data: ApiPost }>(`/posts/${id}/schedule`, {
      scheduledAt,
    })
    return toCamelCase<Post>(res.data)
  }

  async duplicate(id: string): Promise<Post> {
    const res = await this.http.post<{ data: ApiPost }>(`/posts/${id}/duplicate`)
    return toCamelCase<Post>(res.data)
  }
}
