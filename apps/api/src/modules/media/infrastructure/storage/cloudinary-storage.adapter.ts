import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import type { StoragePort } from './storage.port'

@Injectable()
export class CloudinaryStorageAdapter implements StoragePort {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('app.cloudinaryCloudName'),
      api_key: config.get<string>('app.cloudinaryApiKey'),
      api_secret: config.get<string>('app.cloudinaryApiSecret'),
    })
  }

  async upload(file: Express.Multer.File, workspaceId: string): Promise<{ url: string; filename: string }> {
    const folder = `SocialPiloAi/${workspaceId}`
    const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image'

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType, use_filename: false },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'))
          resolve({ url: result.secure_url, filename: result.public_id })
        },
      )
      stream.end(file.buffer)
    })
  }

  async delete(filename: string): Promise<void> {
    // filename is the public_id stored at upload time
    await cloudinary.uploader.destroy(filename, { resource_type: 'image' }).catch(() =>
      cloudinary.uploader.destroy(filename, { resource_type: 'video' }),
    )
  }
}
