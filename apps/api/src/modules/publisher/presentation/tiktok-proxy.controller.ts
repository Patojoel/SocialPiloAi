import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common'
import type { Response } from 'express'

/**
 * TikTok domain verification + image proxy controller.
 *
 * TikTok PULL_FROM_URL requires owning the image domain.
 * Since images are hosted on Cloudinary (a third-party domain),
 * we proxy them through our own server (exposed via ngrok) so TikTok
 * can pull from a domain we control and have verified.
 */
@Controller()
export class TiktokProxyController {
  /**
   * TikTok domain verification endpoint.
   * After creating the verification in TikTok Developer Console,
   * put the verification token in TIKTOK_DOMAIN_VERIFY env var.
   * TikTok will call GET /tiktok-domain-verify to confirm ownership.
   */
  @Get('tiktok-domain-verify')
  verify(@Res() res: Response) {
    const token = process.env['TIKTOK_DOMAIN_VERIFY'] ?? ''
    res.setHeader('Content-Type', 'text/plain')
    res.send(token)
  }

  /**
   * Image proxy — downloads from Cloudinary and streams to TikTok.
   * Usage: GET /api/v1/media/tiktok-proxy?url=<cloudinary_url>
   */
  @Get('media/tiktok-proxy')
  async proxyImage(
    @Query('url') imageUrl: string | undefined,
    @Res() res: Response,
  ) {
    if (!imageUrl) throw new BadRequestException('url query param is required')

    const upstream = await fetch(decodeURIComponent(imageUrl))
    if (!upstream.ok) {
      throw new BadRequestException(`Failed to fetch image: ${upstream.status}`)
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg'
    const buffer = await upstream.arrayBuffer()

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', buffer.byteLength)
    res.send(Buffer.from(buffer))
  }
}
