import {
  OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueFailed,
  OnGlobalQueueProgress,
  OnGlobalQueueDrained,
} from '@nestjs/bull';
import { JobId } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { Source } from '../../pages/entities/source.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatcherService } from '../service/matcher.service';
import { InjectMatcherQueue, MatcherProcessor } from '../matcher.decorators';
import { Logger } from '@nestjs/common';
import { MatcherQueue } from '../matcher.types';

@MatcherProcessor()
export class MatcherMainConsumer {
  private readonly logger = new Logger(MatcherMainConsumer.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectMatcherQueue() private readonly matcherQueue: MatcherQueue,
    private readonly crawlerService: MatcherService,
  ) {}

  @OnGlobalQueueActive()
  async handleJobStarted(jobId: JobId) {
    const {
      data: { page },
    } = await this.matcherQueue.getJob(jobId);
    const { id: pageId, title } = page;
  }

  @OnGlobalQueueCompleted()
  async handleJobCompleted(jobId: JobId, result: string) {
    const {
      data: { page },
    } = await this.matcherQueue.getJob(jobId);
    const { id: pageId, title } = page;
    const { processedRevisionsCount } = JSON.parse(result) as {
      processedRevisionsCount: number;
    };
    // console.log(
    //   `page "${title}" (${pageId}) has been scanned, unarchived sources: ${sources.length}`,
    // );
    await this.eventEmitter.emitAsync(Page.Event.SCANNED, {
      page,
      processedRevisionsCount,
    });
  }

  @OnGlobalQueueFailed()
  async handleJobFailed(jobId: JobId, error: Error) {
    const {
      data: { page },
    } = await this.matcherQueue.getJob(jobId);
    this.logger.error({ jobId }, 'Matcher job failed: %s', error);
    await this.eventEmitter.emitAsync(Page.Event.FAILED, {
      page,
      failure: error,
    });
  }

  @OnGlobalQueueProgress()
  handleJobProgress(jobId: JobId, progress: number) {
    console.log('progress', jobId, progress);
  }

  @OnGlobalQueueDrained()
  async handleQueueDrained(): Promise<void> {
    console.log('OnGlobalQueueDrained');
    await this.crawlerService.synchroniseJobs();
  }
}
