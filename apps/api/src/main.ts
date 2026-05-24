import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Security
  app.use(helmet())
  app.use(cookieParser())
  app.enableCors({
    origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-Id'],
  })

  // Serve uploaded files statically — cross-origin so the Vite dev server (localhost:5173)
  // can load images without being blocked by Helmet's default CORP: same-origin header.
  app.useStaticAssets('/tmp/socialpilot-uploads', {
    prefix: '/uploads/',
    setHeaders: (res: import('http').ServerResponse) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    },
  })

  // Global pipes, filters, interceptors
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseTransformInterceptor())

  // API prefix
  app.setGlobalPrefix('api/v1')

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SocialPilot AI API')
    .setDescription('SocialPilot AI REST API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const port = process.env['PORT'] ?? 3000
  await app.listen(port)
  console.warn(`API running on http://localhost:${port}`)
}

bootstrap()
