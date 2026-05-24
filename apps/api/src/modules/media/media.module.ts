import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { MediaOrmEntity } from './infrastructure/persistence/entities/media.orm-entity'
import { TypeOrmMediaRepository } from './infrastructure/persistence/repositories/typeorm-media.repository'
import { MEDIA_REPOSITORY } from './domain/repositories/media.repository'
import { LocalStorageAdapter } from './infrastructure/storage/local-storage.adapter'
import { CloudinaryStorageAdapter } from './infrastructure/storage/cloudinary-storage.adapter'
import { STORAGE_PORT, type StoragePort } from './infrastructure/storage/storage.port'
import { UploadMediaUseCase } from './application/use-cases/upload-media/upload-media.use-case'
import { ListMediaUseCase } from './application/use-cases/list-media/list-media.use-case'
import { DeleteMediaUseCase } from './application/use-cases/delete-media/delete-media.use-case'
import { MediaController } from './presentation/controllers/media.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaOrmEntity]),
    MulterModule.register({ dest: '/tmp/socialpilot-uploads' }),
  ],
  providers: [
    { provide: MEDIA_REPOSITORY, useClass: TypeOrmMediaRepository },
    LocalStorageAdapter,
    CloudinaryStorageAdapter,
    {
      provide: STORAGE_PORT,
      useFactory: (config: ConfigService, local: LocalStorageAdapter, cloudinary: CloudinaryStorageAdapter): StoragePort =>
        config.get<string>('app.storageProvider') === 'cloudinary' ? cloudinary : local,
      inject: [ConfigService, LocalStorageAdapter, CloudinaryStorageAdapter],
    },
    UploadMediaUseCase,
    ListMediaUseCase,
    DeleteMediaUseCase,
  ],
  controllers: [MediaController],
})
export class MediaModule {}
