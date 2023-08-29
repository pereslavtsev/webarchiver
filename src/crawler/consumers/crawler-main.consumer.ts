import {
  InjectQueue,
  OnGlobalQueueCompleted,
  OnGlobalQueueFailed,
  OnGlobalQueueProgress,
  Processor,
} from '@nestjs/bull';
import { Job, JobId, Queue } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { ApiPage } from 'mwn';
import { Source } from '../../sources/entities/source.entity';
import { PagesService } from '../../pages/services/pages.service';

@Processor('crawler')
export class CrawlerMainConsumer {
  constructor(
    private readonly pagesService: PagesService,
    @InjectQueue('crawler') private crawlerQueue: Queue<Page>,
  ) {}

  @OnGlobalQueueCompleted()
  async handleJobCompleted(jobId: JobId, result: string) {
    const { data: page } = await this.crawlerQueue.getJob(jobId);
    const { id, title, pageId } = page;
    const { sources } = JSON.parse(result);
    console.log('sources', page, sources);
    console.log(
      `page "${title}" (${pageId}) has been scanned, unarchived sources: ${sources.length}`,
    );
    await this.pagesService.save({
      id,
      sources,
      scannedAt: new Date(),
    });
  }

  @OnGlobalQueueFailed()
  handleJobFailed(_: Job, error: Error) {
    console.log('error', error);
  }

  @OnGlobalQueueProgress()
  handleJobProgress(job: Job<Page>, progress: number) {
    console.log('progress', job.data.title, progress);
  }
}
