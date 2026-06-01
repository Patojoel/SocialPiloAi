import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostOrmEntity } from '../post/infrastructure/persistence/entities/post.orm-entity'
import { PostResultOrmEntity } from '../post/infrastructure/persistence/entities/post-result.orm-entity'
import { SocialAccountOrmEntity } from '../social-account/infrastructure/persistence/entities/social-account.orm-entity'
import { MediaOrmEntity } from '../media/infrastructure/persistence/entities/media.orm-entity'
import { TypeOrmPostRepository } from '../post/infrastructure/persistence/repositories/typeorm-post.repository'
import { TypeOrmPostResultRepository } from '../post/infrastructure/persistence/repositories/typeorm-post-result.repository'
import { TypeOrmSocialAccountRepository } from '../social-account/infrastructure/persistence/repositories/typeorm-social-account.repository'
import { TypeOrmMediaRepository } from '../media/infrastructure/persistence/repositories/typeorm-media.repository'
import { POST_REPOSITORY } from '../post/domain/repositories/post.repository'
import { POST_RESULT_REPOSITORY } from '../post/domain/repositories/post-result.repository'
import { SOCIAL_ACCOUNT_REPOSITORY } from '../social-account/domain/repositories/social-account.repository'
import { MEDIA_REPOSITORY } from '../media/domain/repositories/media.repository'
import { TokenCipherService } from '../social-account/infrastructure/crypto/token-cipher.service'
import { FacebookPublisherAdapter } from './infrastructure/adapters/facebook-publisher.adapter'
import { InstagramPublisherAdapter } from './infrastructure/adapters/instagram-publisher.adapter'
import { TiktokPublisherAdapter } from './infrastructure/adapters/tiktok-publisher.adapter'
import { FACEBOOK_PUBLISHER, INSTAGRAM_PUBLISHER, TIKTOK_PUBLISHER } from './domain/ports/publisher.port'
import { PublishPostService } from './application/publish-post.service'
import { TiktokProxyController } from './presentation/tiktok-proxy.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([PostOrmEntity, PostResultOrmEntity, SocialAccountOrmEntity, MediaOrmEntity]),
  ],
  providers: [
    { provide: POST_REPOSITORY, useClass: TypeOrmPostRepository },
    { provide: POST_RESULT_REPOSITORY, useClass: TypeOrmPostResultRepository },
    { provide: SOCIAL_ACCOUNT_REPOSITORY, useClass: TypeOrmSocialAccountRepository },
    { provide: MEDIA_REPOSITORY, useClass: TypeOrmMediaRepository },
    { provide: FACEBOOK_PUBLISHER, useClass: FacebookPublisherAdapter },
    { provide: INSTAGRAM_PUBLISHER, useClass: InstagramPublisherAdapter },
    { provide: TIKTOK_PUBLISHER, useClass: TiktokPublisherAdapter },
    TokenCipherService,
    PublishPostService,
  ],
  controllers: [TiktokProxyController],
  exports: [PublishPostService],
})
export class PublisherModule {}
