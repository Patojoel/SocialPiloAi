import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message = this.getMessage(exception)
    const errors = this.getValidationErrors(exception)

    if (status >= 500) {
      this.logger.error(exception)
    }

    response.status(status).json({
      type: `https://socialpilot.ai/errors/${status}`,
      title: this.getTitle(status),
      status,
      detail: message,
      ...(errors && { errors }),
    })
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      if (typeof response === 'string') return response
      if (typeof response === 'object' && response !== null && 'message' in response) {
        const msg = (response as Record<string, unknown>)['message']
        if (typeof msg === 'string') return msg
        if (Array.isArray(msg)) return msg.join(', ')
      }
    }
    if (exception instanceof Error) return exception.message
    return 'An unexpected error occurred'
  }

  private getValidationErrors(exception: unknown): Record<string, string[]> | undefined {
    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response &&
        Array.isArray((response as Record<string, unknown>)['message'])
      ) {
        return { validation: (response as Record<string, unknown>)['message'] as string[] }
      }
    }
    return undefined
  }

  private getTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
    }
    return titles[status] ?? 'Error'
  }
}
