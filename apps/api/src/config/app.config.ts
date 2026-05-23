import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  env: process.env['NODE_ENV'] ?? 'development',
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:5173',
  emailProvider: process.env['EMAIL_PROVIDER'] ?? 'resend',
  resendApiKey: process.env['RESEND_API_KEY'] ?? '',
  emailFrom: process.env['EMAIL_FROM'] ?? 'noreply@socialpilot.ai',
}))
