import { Processor, Process, OnQueueFailed } from '@nestjs/bull'
import type { Job } from 'bull'
import { PublishPostService } from '../publisher/application/publish-post.service'

@Processor('publish-post')
export class PublishPostProcessor {
  constructor(private readonly publishPostService: PublishPostService) {}

  @Process()
  async handle(job: Job<{ postId: string }>): Promise<void> {
    await this.publishPostService.execute(job.data.postId)
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error): void {
    if (job.attemptsMade >= 3) {
      console.error(
        `Post ${(job.data as { postId: string }).postId} failed permanently:`,
        err.message,
      )
    }
  }
}
