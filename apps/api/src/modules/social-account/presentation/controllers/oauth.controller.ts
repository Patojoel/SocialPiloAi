import { Controller, Get, Query, Res, Logger } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import type { Response } from 'express'
import { ConnectFacebookUseCase } from '../../application/use-cases/connect-facebook/connect-facebook.use-case'
import { ConnectInstagramUseCase } from '../../application/use-cases/connect-instagram/connect-instagram.use-case'
import { ConnectTiktokUseCase } from '../../application/use-cases/connect-tiktok/connect-tiktok.use-case'

@ApiTags('oauth')
@Controller('auth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name)

  constructor(
    private readonly connectFacebookUseCase: ConnectFacebookUseCase,
    private readonly connectInstagramUseCase: ConnectInstagramUseCase,
    private readonly connectTiktokUseCase: ConnectTiktokUseCase,
    private readonly configService: ConfigService,
  ) {}

  private get frontendUrl(): string {
    return this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:5173'
  }

  @Get('facebook/callback')
  async facebookCallback(
    @Query('code') code: string | undefined,
    @Query('error') error: string | undefined,
    @Query('state') workspaceId: string | undefined,
    @Res() res: Response,
  ) {
    if (error || !code || !workspaceId) {
      return res.redirect(`${this.frontendUrl}/social-accounts?error=oauth_failed`)
    }
    try {
      await this.connectFacebookUseCase.execute({ code, workspaceId })
      return res.redirect(`${this.frontendUrl}/social-accounts?connected=facebook`)
    } catch {
      return res.redirect(`${this.frontendUrl}/social-accounts?error=connection_failed`)
    }
  }

  @Get('instagram/callback')
  async instagramCallback(
    @Query('code') code: string | undefined,
    @Query('error') error: string | undefined,
    @Query('state') workspaceId: string | undefined,
    @Res() res: Response,
  ) {
    if (error || !code || !workspaceId) {
      return res.redirect(`${this.frontendUrl}/social-accounts?error=oauth_failed`)
    }
    try {
      await this.connectInstagramUseCase.execute({ code, workspaceId })
      return res.redirect(`${this.frontendUrl}/social-accounts?connected=instagram`)
    } catch {
      return res.redirect(`${this.frontendUrl}/social-accounts?error=connection_failed`)
    }
  }

  @Get('tiktok/callback')
  async tiktokCallback(
    @Query('code') code: string | undefined,
    @Query('error') error: string | undefined,
    @Query('state') workspaceId: string | undefined,
    @Res() res: Response,
  ) {
    this.logger.log(`TikTok callback — code: ${code ? 'present' : 'missing'}, state: ${workspaceId}, error: ${error}`)
    if (error || !code || !workspaceId) {
      this.logger.warn(`TikTok callback rejected — error: ${error}, code: ${code}, workspaceId: ${workspaceId}`)
      return res.redirect(`${this.frontendUrl}/social-accounts?error=oauth_failed`)
    }
    try {
      await this.connectTiktokUseCase.execute({ code, workspaceId })
      return res.redirect(`${this.frontendUrl}/social-accounts?connected=tiktok`)
    } catch (err) {
      this.logger.error(`TikTok connect failed: ${err instanceof Error ? err.message : String(err)}`)
      return res.redirect(`${this.frontendUrl}/social-accounts?error=connection_failed`)
    }
  }
}
