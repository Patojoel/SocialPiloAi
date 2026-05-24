import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import type { StoragePort } from './storage.port'

@Injectable()
export class LocalStorageAdapter implements StoragePort {
  private readonly publicUrl: string

  constructor() {
    this.publicUrl = process.env['STORAGE_PUBLIC_URL'] ?? 'http://localhost:3000/uploads'
  }

  async upload(file: Express.Multer.File, workspaceId: string): Promise<{ url: string; filename: string }> {
    const uploadDir = path.join('/tmp/socialpilot-uploads', workspaceId)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`
    const filePath = path.join(uploadDir, filename)

    fs.writeFileSync(filePath, file.buffer)

    const url = `${this.publicUrl}/${workspaceId}/${filename}`
    return { url, filename }
  }

  async delete(filename: string): Promise<void> {
    const parts = filename.split('/')
    if (parts.length < 2) return

    const workspaceId = parts[parts.length - 2]
    const file = parts[parts.length - 1]
    if (!workspaceId || !file) return

    const filePath = path.join('/tmp/socialpilot-uploads', workspaceId, file)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}
