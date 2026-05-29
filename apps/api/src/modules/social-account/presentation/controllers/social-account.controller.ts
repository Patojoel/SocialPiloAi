import {
  Controller,
  Get,
  Delete,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { ListSocialAccountsUseCase } from '../../application/use-cases/list-social-accounts/list-social-accounts.use-case'
import { DisconnectSocialAccountUseCase } from '../../application/use-cases/disconnect-social-account/disconnect-social-account.use-case'
import { GetConnectUrlUseCase } from '../../application/use-cases/get-connect-url/get-connect-url.use-case'
import { GetFacebookPagesUseCase } from '../../application/use-cases/get-facebook-pages/get-facebook-pages.use-case'
import type { Platform } from '../../domain/entities/social-account.entity'

const VALID_PLATFORMS: Platform[] = ['facebook', 'instagram', 'tiktok']

function isPlatform(value: unknown): value is Platform {
  return typeof value === 'string' && (VALID_PLATFORMS as string[]).includes(value)
}

@ApiTags('social-accounts')
@ApiBearerAuth()
@Controller('social-accounts')
@UseGuards(JwtAuthGuard)
export class SocialAccountController {
  constructor(
    private readonly listSocialAccountsUseCase: ListSocialAccountsUseCase,
    private readonly disconnectSocialAccountUseCase: DisconnectSocialAccountUseCase,
    private readonly getConnectUrlUseCase: GetConnectUrlUseCase,
    private readonly getFacebookPagesUseCase: GetFacebookPagesUseCase,
  ) {}

  @Get()
  async list(@Headers('x-workspace-id') workspaceId: string) {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    const accounts = await this.listSocialAccountsUseCase.execute(workspaceId)
    return { data: accounts }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async disconnect(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    await this.disconnectSocialAccountUseCase.execute(id, workspaceId)
  }

  @Get(':id/pages')
  async getFacebookPages(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    const pages = await this.getFacebookPagesUseCase.execute(id, workspaceId)
    return { data: pages }
  }

  @Get('connect/:platform')
  getConnectUrl(
    @Param('platform') platform: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    if (!isPlatform(platform)) throw new BadRequestException(`Invalid platform: ${platform}`)
    const url = this.getConnectUrlUseCase.execute(platform, workspaceId)
    return { data: { url } }
  }
}
