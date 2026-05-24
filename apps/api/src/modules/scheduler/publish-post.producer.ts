import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import type { Queue } from 'bull'
import type { PublishPostQueuePort } from '../post/domain/ports/publish-post-queue.port'

@Injectable()
export class PublishPostProducer implements PublishPostQueuePort {
  constructor(@InjectQueue('publish-post') private readonly queue: Queue) {}

  async addImmediateJob(postId: string): Promise<void> {
    await this.queue.add(
      { postId },
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    )
  }

  async addDelayedJob(postId: string, scheduledAt: Date): Promise<void> {
    const delay = scheduledAt.getTime() - Date.now()
    await this.queue.add(
      { postId },
      { delay, attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    )
  }

  async removeJob(postId: string): Promise<void> {
    const jobs = await this.queue.getJobs(['waiting', 'delayed'])
    for (const job of jobs) {
      if ((job.data as { postId: string }).postId === postId) {
        await job.remove()
      }
    }
  }
}
