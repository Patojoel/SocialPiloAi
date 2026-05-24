import type { CreatePostFormValues } from '../validation/postSchema'
import type { Post } from '../../models/Post'

export const PostFormFactory = {
  buildFormValue(post?: Post): CreatePostFormValues {
    if (!post) {
      return {
        content: '',
        platforms: [],
        mediaIds: [],
        scheduledAt: null,
      }
    }
    return {
      content: post.content,
      platforms: post.platforms,
      mediaIds: post.mediaIds,
      scheduledAt: post.scheduledAt,
    }
  },
}
