import { Controller, Get, Query, BadRequestException } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ConnectFacebookUseCase } from '../../application/use-cases/connect-facebook/connect-facebook.use-case'
import { ConnectTiktokUseCase } from '../../application/use-cases/connect-tiktok/connect-tiktok.use-case'

@ApiTags('oauth')
@Controller('auth')
export class OAuthController {
  constructor(
    private readonly connectFacebookUseCase: ConnectFacebookUseCase,
    private readonly connectTiktokUseCase: ConnectTiktokUseCase,
  ) {}

  @Get('facebook/callback')
  async facebookCallback(
    @Query('code') code: string,
    @Query('state') workspaceId: string,
  ) {
    if (!code) throw new BadRequestException('Missing code')
    if (!workspaceId) throw new BadRequestException('Missing workspace_id (state)')
    const account = await this.connectFacebookUseCase.execute({ code, workspaceId })
    return { data: account }
  }

  @Get('tiktok/callback')
  async tiktokCallback(
    @Query('code') code: string,
    @Query('state') workspaceId: string,
  ) {
    if (!code) throw new BadRequestException('Missing code')
    if (!workspaceId) throw new BadRequestException('Missing workspace_id (state)')
    const account = await this.connectTiktokUseCase.execute({ code, workspaceId })
    return { data: account }
  }
}
