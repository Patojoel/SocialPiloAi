import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SocialAccountOrmEntity } from './infrastructure/persistence/entities/social-account.orm-entity'
import { TypeOrmSocialAccountRepository } from './infrastructure/persistence/repositories/typeorm-social-account.repository'
import { SOCIAL_ACCOUNT_REPOSITORY } from './domain/repositories/social-account.repository'
import { TokenCipherService } from './infrastructure/crypto/token-cipher.service'
import { ListSocialAccountsUseCase } from './application/use-cases/list-social-accounts/list-social-accounts.use-case'
import { DisconnectSocialAccountUseCase } from './application/use-cases/disconnect-social-account/disconnect-social-account.use-case'
import { ConnectFacebookUseCase } from './application/use-cases/connect-facebook/connect-facebook.use-case'
import { ConnectInstagramUseCase } from './application/use-cases/connect-instagram/connect-instagram.use-case'
import { ConnectTiktokUseCase } from './application/use-cases/connect-tiktok/connect-tiktok.use-case'
import { GetConnectUrlUseCase } from './application/use-cases/get-connect-url/get-connect-url.use-case'
import { GetFacebookPagesUseCase } from './application/use-cases/get-facebook-pages/get-facebook-pages.use-case'
import { SocialAccountController } from './presentation/controllers/social-account.controller'
import { OAuthController } from './presentation/controllers/oauth.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccountOrmEntity])],
  providers: [
    { provide: SOCIAL_ACCOUNT_REPOSITORY, useClass: TypeOrmSocialAccountRepository },
    TokenCipherService,
    ListSocialAccountsUseCase,
    DisconnectSocialAccountUseCase,
    ConnectFacebookUseCase,
    ConnectInstagramUseCase,
    ConnectTiktokUseCase,
    GetConnectUrlUseCase,
    GetFacebookPagesUseCase,
  ],
  controllers: [SocialAccountController, OAuthController],
  exports: [SOCIAL_ACCOUNT_REPOSITORY],
})
export class SocialAccountModule {}
