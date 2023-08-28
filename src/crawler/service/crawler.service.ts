import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PagesService } from '../../pages/services/pages.service';
import { InjectQueue } from '@nestjs/bull';
import { Page } from '../../pages/entities/page.entity';
import { Queue } from 'bull';
import { isMainThread, Worker } from 'worker_threads';
import { ApiPage } from 'mwn';
import { Source } from '../../sources/entities/source.entity';

@Injectable()
export class CrawlerService implements OnApplicationBootstrap {
  constructor(
    private readonly pagesService: PagesService,
    @InjectQueue('crawler') private crawlerQueue: Queue<Page>,
  ) {}

  async clearAll() {
    for (const status of ['active', 'completed', 'delayed', 'failed', 'wait']) {
      await this.crawlerQueue.clean(0, status as any);
    }
  }

  async sync() {
    const pages = await this.pagesService.find({
      take: 10,
      order: { priority: 'asc', createdAt: 'desc' },
    });
    const jobs = pages.map((page) => ({
      data: page,
      opts: {
        jobId: page.pageId,
      },
    }));
    await this.crawlerQueue.addBulk(jobs);
  }

  async onApplicationBootstrap(): Promise<void> {
    if (isMainThread) {
      // await this.pagesService.delete({});
      await this.clearAll();
      await this.sync();

      const worker = new Worker(require.main.filename, {
        name: 'crawler',
        workerData: {
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

  protected async handleResponse(message: {
    page: Page;
    response: ApiPage;
    sources: Source[];
  }) {
    // console.log('message', message);
    const { page, sources, response } = message;
    const { id } = page;
    console.log(response)
    await this.pagesService.save({ id, sources });
  }

  protected handleOnline() {}

  protected handleError(error) {}

  protected handleExit(code) {}
}
