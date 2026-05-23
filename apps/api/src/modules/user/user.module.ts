import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity'
import { TypeOrmUserRepository } from './infrastructure/persistence/repositories/typeorm-user.repository'
import { USER_REPOSITORY } from './domain/repositories/user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
