import type { Post } from '../../domain/entities/post.entity'
import type { PostResult } from '../../domain/entities/post-result.entity'

export interface PostResponseDto {
  id: string
  workspace_id: string
  content: string
  platforms: string[]
  status: string
  media_ids: string[]
  scheduled_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PostResultResponseDto {
  id: string
  post_id: string
  platform: string
  external_id: string | null
  status: string
  error_message: string | null
  created_at: string
}

export interface PostDetailResponseDto extends PostResponseDto {
  results: PostResultResponseDto[]
}

export function serializePost(post: Post): PostResponseDto {
  return {
    id: post.id,
    workspace_id: post.workspaceId,
    content: post.content,
    platforms: post.platforms,
    status: post.status,
    media_ids: post.mediaIds,
    scheduled_at: post.scheduledAt ? post.scheduledAt.toISOString() : null,
    published_at: post.publishedAt ? post.publishedAt.toISOString() : null,
    created_at: post.createdAt.toISOString(),
    updated_at: post.updatedAt.toISOString(),
  }
}

export function serializePostResult(result: PostResult): PostResultResponseDto {
  return {
    id: result.id,
    post_id: result.postId,
    platform: result.platform,
    external_id: result.externalId,
    status: result.status,
    error_message: result.errorMessage,
    created_at: result.createdAt.toISOString(),
  }
}

export function serializePostDetail(post: Post, results: PostResult[]): PostDetailResponseDto {
  return {
    ...serializePost(post),
    results: results.map(serializePostResult),
  }
}
