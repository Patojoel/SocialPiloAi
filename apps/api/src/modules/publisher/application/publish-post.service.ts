import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../post/domain/repositories/post.repository'
import { POST_RESULT_REPOSITORY, type PostResultRepository } from '../../post/domain/repositories/post-result.repository'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../social-account/domain/repositories/social-account.repository'
import {
  FACEBOOK_PUBLISHER,
  INSTAGRAM_PUBLISHER,
  TIKTOK_PUBLISHER,
  type PublisherPort,
} from '../domain/ports/publisher.port'
import { TokenCipherService } from '../../social-account/infrastructure/crypto/token-cipher.service'
import type { Platform } from '../../post/domain/entities/post.entity'

@Injectable()
export class PublishPostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
    @Inject(POST_RESULT_REPOSITORY)
    private readonly postResultRepo: PostResultRepository,
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
    @Inject(FACEBOOK_PUBLISHER)
    private readonly facebookPublisher: PublisherPort,
    @Inject(INSTAGRAM_PUBLISHER)
    private readonly instagramPublisher: PublisherPort,
    @Inject(TIKTOK_PUBLISHER)
    private readonly tiktokPublisher: PublisherPort,
    private readonly tokenCipher: TokenCipherService,
  ) {}

  async execute(postId: string): Promise<void> {
    const post = await this.postRepo.findById(postId)
    if (!post) throw new NotFoundException(`Post ${postId} not found`)

    const publisherMap: Record<Platform, PublisherPort> = {
      facebook: this.facebookPublisher,
      instagram: this.instagramPublisher,
      tiktok: this.tiktokPublisher,
    }

    let allSucceeded = true
    let anySucceeded = false

    for (const platform of post.platforms) {
      const accounts = await this.socialAccountRepo.findByWorkspaceAndPlatform(post.workspaceId, platform)
      const activeAccount = accounts.find((a) => a.status === 'active')

      if (!activeAccount) {
        await this.postResultRepo.save({
          postId,
          platform,
          externalId: null,
          status: 'failed',
          errorMessage: `No active ${platform} account found`,
        })
        allSucceeded = false
        continue
      }

      let accessToken: string
      try {
        accessToken = this.tokenCipher.decrypt(activeAccount.accessTokenEncrypted)
      } catch {
        await this.postResultRepo.save({
          postId,
          platform,
          externalId: null,
          status: 'failed',
          errorMessage: 'Failed to decrypt access token',
        })
        allSucceeded = false
        continue
      }

      const publisher = publisherMap[platform]
      try {
        const result = await publisher.publish(post, accessToken)
        await this.postResultRepo.save({
          postId,
          platform,
          externalId: result.externalId,
          status: result.status,
          errorMessage: result.errorMessage,
        })
        if (result.status === 'published') {
          anySucceeded = true
        } else {
          allSucceeded = false
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        await this.postResultRepo.save({
          postId,
          platform,
          externalId: null,
          status: 'failed',
          errorMessage: message,
        })
        allSucceeded = false
      }
    }

    const finalStatus = allSucceeded ? 'published' : anySucceeded ? 'published' : 'failed'
    const updatePayload: Partial<import('../../post/domain/entities/post.entity').Post> = {
      status: finalStatus,
    }
    if (anySucceeded) updatePayload.publishedAt = new Date()

    await this.postRepo.update(postId, updatePayload)
  }
}
