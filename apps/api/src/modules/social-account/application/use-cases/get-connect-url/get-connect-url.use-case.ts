import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Platform } from '../../../domain/entities/social-account.entity'

@Injectable()
export class GetConnectUrlUseCase {
  constructor(private readonly configService: ConfigService) {}

  execute(platform: Platform, workspaceId: string): string {
    const baseUrl = this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:5173'
    const apiUrl = `http://localhost:${this.configService.get<number>('app.port') ?? 3000}`

    switch (platform) {
      case 'facebook': {
        const fbAppId = process.env['FACEBOOK_APP_ID'] ?? 'placeholder'
        const redirectUri = `${apiUrl}/api/v1/auth/facebook/callback`
        return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${workspaceId}&scope=pages_manage_posts,pages_read_engagement`
      }
      case 'tiktok': {
        const tiktokClientKey = process.env['TIKTOK_CLIENT_KEY'] ?? 'placeholder'
        const redirectUri = `${apiUrl}/api/v1/auth/tiktok/callback`
        return `https://www.tiktok.com/auth/authorize/?client_key=${tiktokClientKey}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${workspaceId}&scope=user.info.basic,video.upload`
      }
      case 'instagram': {
        const fbAppId = process.env['FACEBOOK_APP_ID'] ?? 'placeholder'
        const redirectUri = `${apiUrl}/api/v1/auth/instagram/callback`
        return `https://api.instagram.com/oauth/authorize?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${workspaceId}&scope=instagram_basic,instagram_content_publish&response_type=code`
      }
      default: {
        const _exhaustive: never = platform
        throw new Error(`Unsupported platform: ${String(_exhaustive)}`)
      }
    }
  }
}
