import { Injectable } from '@nestjs/common'
import type { PublisherPort, ExternalPostResult } from '../../domain/ports/publisher.port'
import type { Post } from '../../../post/domain/entities/post.entity'

@Injectable()
export class TiktokPublisherAdapter implements PublisherPort {
  async publish(post: Post, _accessToken: string): Promise<ExternalPostResult> {
    console.log(`Publishing post ${post.id} to TikTok`)
    return {
      externalId: `tt_mock_${Date.now()}`,
      status: 'published',
      errorMessage: null,
    }
  }
}
