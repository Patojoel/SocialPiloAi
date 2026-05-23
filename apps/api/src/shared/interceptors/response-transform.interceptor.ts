import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(
      map((value) => {
        // If already wrapped (has data key), return as-is
        if (value !== null && typeof value === 'object' && 'data' in (value as object)) {
          return value
        }
        return { data: value }
      }),
    )
  }
}
