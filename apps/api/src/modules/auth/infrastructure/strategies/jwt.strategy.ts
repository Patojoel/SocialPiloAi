import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import type { JwtPayload } from '@/shared/decorators/current-user.decorator'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') ?? 'change-me',
    })
  }

  validate(payload: Record<string, unknown>): JwtPayload {
    if (typeof payload['sub'] !== 'string' || typeof payload['email'] !== 'string') {
      throw new UnauthorizedException('Invalid token payload')
    }
    return { sub: payload['sub'], email: payload['email'] }
  }
}
