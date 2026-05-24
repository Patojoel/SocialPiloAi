import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { PublisherModule } from '../publisher/publisher.module'
import { PublishPostProducer } from './publish-post.producer'
import { PublishPostProcessor } from './publish-post.processor'
import { PUBLISH_POST_QUEUE_PORT } from '../post/domain/ports/publish-post-queue.port'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'publish-post' }),
    PublisherModule,
  ],
  providers: [
    PublishPostProducer,
    PublishPostProcessor,
    {
      provide: PUBLISH_POST_QUEUE_PORT,
      useExisting: PublishPostProducer,
    },
  ],
  exports: [PUBLISH_POST_QUEUE_PORT, PublishPostProducer],
})
export class SchedulerModule {}
