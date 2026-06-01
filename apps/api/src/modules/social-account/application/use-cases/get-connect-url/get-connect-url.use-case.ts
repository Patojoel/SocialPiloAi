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
        const fbAppId = this.configService.get<string>('app.facebookAppId') ?? process.env['FACEBOOK_APP_ID'] ?? ''
        const redirectUri = `${apiUrl}/api/v1/auth/facebook/callback`
        const params = new URLSearchParams({
          client_id: fbAppId,
          redirect_uri: redirectUri,
          state: workspaceId,
          scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts',
          response_type: 'code',
        })
        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
      }
      case 'tiktok': {
        const tiktokClientKey = this.configService.get<string>('app.tiktokClientKey') ?? process.env['TIKTOK_CLIENT_KEY'] ?? ''
        // Use TIKTOK_REDIRECT_URI from env (supports ngrok URL for localhost dev)
        const redirectUri = process.env['TIKTOK_REDIRECT_URI'] ?? `${apiUrl}/api/v1/auth/tiktok/callback`
        const params = new URLSearchParams({
          client_key: tiktokClientKey,
          response_type: 'code',
          redirect_uri: redirectUri,
          state: workspaceId,
          scope: 'user.info.basic,video.publish,video.upload',
        })
        return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
      }
      case 'instagram': {
        const fbAppId = this.configService.get<string>('app.facebookAppId') ?? process.env['FACEBOOK_APP_ID'] ?? ''
        const redirectUri = `${apiUrl}/api/v1/auth/instagram/callback`
        const params = new URLSearchParams({
          client_id: fbAppId,
          redirect_uri: redirectUri,
          state: workspaceId,
          scope: 'public_profile,pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish',
          response_type: 'code',
        })
        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
      }
      default: {
        const _exhaustive: never = platform
        throw new Error(`Unsupported platform: ${String(_exhaustive)}`)
      }
    }
  }
}
