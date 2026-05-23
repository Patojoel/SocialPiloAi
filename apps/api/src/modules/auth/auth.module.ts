import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from '../user/user.module'
import { RefreshTokenOrmEntity } from './infrastructure/persistence/entities/refresh-token.orm-entity'
import { PasswordResetOrmEntity } from './infrastructure/persistence/entities/password-reset.orm-entity'
import { TypeOrmRefreshTokenRepository } from './infrastructure/persistence/repositories/typeorm-refresh-token.repository'
import { TypeOrmPasswordResetRepository } from './infrastructure/persistence/repositories/typeorm-password-reset.repository'
import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories/refresh-token.repository'
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'
import { RegisterUseCase } from './application/use-cases/register/register.use-case'
import { LoginUseCase } from './application/use-cases/login/login.use-case'
import { LogoutUseCase } from './application/use-cases/logout/logout.use-case'
import { RefreshTokenUseCase } from './application/use-cases/refresh-token/refresh-token.use-case'
import { ForgotPasswordUseCase } from './application/use-cases/forgot-password/forgot-password.use-case'
import { ResetPasswordUseCase } from './application/use-cases/reset-password/reset-password.use-case'
import { UpdateProfileUseCase } from './application/use-cases/update-profile/update-profile.use-case'
import { AuthController } from './presentation/controllers/auth.controller'

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([RefreshTokenOrmEntity, PasswordResetOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<string>('jwt.expiresIn') },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: TypeOrmRefreshTokenRepository },
    TypeOrmPasswordResetRepository,
    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    UpdateProfileUseCase,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
