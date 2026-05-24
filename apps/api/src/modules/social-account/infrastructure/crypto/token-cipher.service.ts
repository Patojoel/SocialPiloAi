import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'

@Injectable()
export class TokenCipherService {
  private readonly key: Buffer

  constructor(private readonly configService: ConfigService) {
    const rawKey = this.configService.get<string>('app.encryptionKey') ?? 'change-me-32-char-encryption-key!'
    this.key = Buffer.from(rawKey.slice(0, 32).padEnd(32, '0'), 'utf8')
  }

  encrypt(token: string): string {
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv)
    const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    return [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':')
  }

  decrypt(encryptedStr: string): string {
    const parts = encryptedStr.split(':')
    if (parts.length !== 3) throw new Error('Invalid encrypted token format')
    const [ivB64, authTagB64, encryptedB64] = parts as [string, string, string]
    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(authTagB64, 'base64')
    const encrypted = Buffer.from(encryptedB64, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv)
    decipher.setAuthTag(authTag)
    return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
  }
}
