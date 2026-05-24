export interface PublishPostQueuePort {
  addImmediateJob(postId: string): Promise<void>
  addDelayedJob(postId: string, scheduledAt: Date): Promise<void>
  removeJob(postId: string): Promise<void>
}

export const PUBLISH_POST_QUEUE_PORT = Symbol('PublishPostQueuePort')
