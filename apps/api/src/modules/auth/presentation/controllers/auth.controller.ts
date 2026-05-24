import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { CurrentUser, type JwtPayload } from '@/shared/decorators/current-user.decorator'
import { RegisterUseCase } from '../../application/use-cases/register/register.use-case'
import { LoginUseCase } from '../../application/use-cases/login/login.use-case'
import { LogoutUseCase } from '../../application/use-cases/logout/logout.use-case'
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token/refresh-token.use-case'
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password/forgot-password.use-case'
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password/reset-password.use-case'
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile/update-profile.use-case'
import { GetMeUseCase } from '../../application/use-cases/get-me/get-me.use-case'
import { RegisterDto } from '../dtos/register.dto'
import { LoginDto } from '../dtos/login.dto'
import { ForgotPasswordDto } from '../dtos/forgot-password.dto'
import { ResetPasswordDto } from '../dtos/reset-password.dto'
import { UpdateProfileDto } from '../dtos/update-profile.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto)
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.loginUseCase.execute(dto)
    if (process.env['NODE_ENV'] === 'production') {
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth/refresh',
      })
    }
    return result
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: Response) {
    await this.logoutUseCase.execute(refreshToken)
    res.clearCookie('refresh_token')
    return { message: 'Logged out successfully' }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string, @Req() req: Request) {
    const token = refreshToken ?? (req.cookies as Record<string, string>)['refresh_token']
    return this.refreshTokenUseCase.execute(token)
  }

  @Post('forgot-password')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.forgotPasswordUseCase.execute(dto.email)
    return { message: 'If this email exists, a reset link has been sent' }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(dto.token, dto.password)
    return { message: 'Password reset successfully' }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@CurrentUser() user: JwtPayload) {
    const fullUser = await this.getMeUseCase.execute(user.sub)
    return { data: fullUser }
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute({ userId: user.sub, ...dto })
  }
}
