import {
  OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueFailed,
  OnGlobalQueueProgress,
  OnGlobalQueueDrained,
} from '@nestjs/bull';
import { Job, JobId, Queue } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { Source } from '../../pages/entities/source.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatcherService } from '../service/matcher.service';
import { InjectMatcherQueue, MatcherProcessor } from '../matcher.decorators';
import { Logger } from '@nestjs/common';

@MatcherProcessor()
export class MatcherMainConsumer {
  private readonly logger = new Logger(MatcherMainConsumer.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectMatcherQueue() private readonly matcherQueue: Queue<Page>,
    private readonly crawlerService: MatcherService,
  ) {}

  @OnGlobalQueueActive()
  async handleJobStarted(jobId: JobId) {
    const { data: page } = await this.matcherQueue.getJob(jobId);
    const { id: pageId, title } = page;
  }

  @OnGlobalQueueCompleted()
  async handleJobCompleted(jobId: JobId, result: string) {
    const { data: page } = await this.matcherQueue.getJob(jobId);
    const { id: pageId, title } = page;
    const { sources } = JSON.parse(result) as { sources: Partial<Source>[] };
    // console.log(
    //   `page "${title}" (${pageId}) has been scanned, unarchived sources: ${sources.length}`,
    // );
    await this.eventEmitter.emitAsync(Page.Event.SCANNED, { page });
  }

  @OnGlobalQueueFailed()
  async handleJobFailed(jobId: JobId, error: Error) {
    const { data: page } = await this.matcherQueue.getJob(jobId);
    this.logger.error({ jobId }, 'Matcher job failed: %s', error);
    await this.eventEmitter.emitAsync(Page.Event.FAILED, {
      page,
      failure: error,
    });
  }

  @OnGlobalQueueProgress()
  handleJobProgress(job: Job<Page>, progress: number) {
    console.log('progress', job, progress);
  }

  @OnGlobalQueueDrained()
  async handleQueueDrained(): Promise<void> {
    console.log('OnGlobalQueueDrained');
    await this.crawlerService.synchroniseJobs();
  }
}
