import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PagesService } from '../../pages/services/pages.service';
import { Page } from '../../pages/entities/page.entity';
import type { Job, Queue } from 'bull';
import { isMainThread, Worker } from 'worker_threads';
import { IsNull } from 'typeorm';
import { InjectMatcherQueue } from '../matcher.decorators';

@Injectable()
export class MatcherService implements OnApplicationBootstrap {
  constructor(
    private readonly pagesService: PagesService,
    @InjectMatcherQueue() private readonly matcherQueue: Queue<Page>,
  ) {}

  async clearAll() {
    for (const status of ['active', 'completed', 'delayed', 'failed', 'wait']) {
      await this.matcherQueue.clean(0, status as any);
    }
  }

  async synchroniseJobs(): Promise<Job<Page>[]> {
    const pages = await this.pagesService.find({
      take: 10,
      // where: {
      //   scannedAt: IsNull(),
      // },
      order: { priority: 'asc', createdAt: 'desc' },
    });
    const jobs = pages.map((page) => ({
      data: page,
      opts: {
        jobId: page.id,
      },
    }));
    return this.matcherQueue.addBulk(jobs);
  }

  async onApplicationBootstrap(): Promise<void> {
    if (isMainThread) {
      // await this.pagesService.delete({});
      await this.clearAll();
      await this.synchroniseJobs();

      const worker = new Worker(require.main.filename, {
        name: 'crawler',
        workerData: {
          name: 'crawler',
          type: 'crawler',
          data: {},
        },
      });

      worker
        .on('message', (message) => this.handleResponse(message))
        .on('online', () => this.handleOnline())
        .on('error', (error) => this.handleError(error))
        .on('exit', (code) => this.handleExit(code));
    }
  }

  protected async handleResponse(message: any) {}

  protected handleOnline() {}

  protected handleError(error) {
    console.log('error', error);
  }

  protected handleExit(code) {
    console.log('code', code);
  }
}
