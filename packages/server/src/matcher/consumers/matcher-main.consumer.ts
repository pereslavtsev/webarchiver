import {
  OnGlobalQueueCompleted,
  OnGlobalQueueFailed,
  OnGlobalQueueProgress,
  OnGlobalQueueDrained,
} from '@nestjs/bull';
import { Job, JobId, Queue } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { Source } from '../../pages/entities/source.entity';
import { DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatcherService } from '../service/matcher.service';
import { InjectMatcherQueue, MatcherProcessor } from '../matcher.decorators';

@MatcherProcessor()
export class MatcherMainConsumer {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
    @InjectMatcherQueue() private readonly matcherQueue: Queue<Page>,
    private readonly crawlerService: MatcherService,
  ) {}

  @OnGlobalQueueCompleted()
  async handleJobCompleted(jobId: JobId, result: string) {
    const { data: page } = await this.matcherQueue.getJob(jobId);
    const { id: pageId, title } = page;
    const { sources } = JSON.parse(result) as { sources: Partial<Source>[] };
    console.log(
      `page "${title}" (${pageId}) has been scanned, unarchived sources: ${sources.length}`,
    );
    // const queryRunner = this.dataSource.createQueryRunner();
    //
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    //
    // try {
    //   await queryRunner.manager
    //     .getRepository(Page)
    //     .update({ id: pageId }, { scannedAt: new Date() });
    //   await queryRunner.manager.getRepository(Source).upsert(
    //     sources.map((source) => ({ ...source, pageId })),
    //     ['url', 'pageId'],
    //   );
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   console.log(err);
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    //   await this.eventEmitter.emitAsync(Page.Event.SCANNED, { page });
    // }
  }

  @OnGlobalQueueFailed()
  handleJobFailed(_: Job, error: Error) {
    console.log('error', error);
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
