import { Injectable } from '@nestjs/common'
import type { PublisherPort, ExternalPostResult } from '../../domain/ports/publisher.port'
import type { Post } from '../../../post/domain/entities/post.entity'

@Injectable()
export class InstagramPublisherAdapter implements PublisherPort {
  async publish(post: Post, _accessToken: string, _mediaUrls: string[]): Promise<ExternalPostResult> {
    console.log(`Publishing post ${post.id} to Instagram`)
    return {
      externalId: `ig_mock_${Date.now()}`,
      status: 'published',
      errorMessage: null,
    }
  }
}
