import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PagesService } from '../../pages/services/pages.service';
import { isMainThread, Worker, SHARE_ENV } from 'worker_threads';
import { IsNull } from 'typeorm';
import { InjectMatcherQueue } from '../matcher.decorators';
import { ConfigType } from '@nestjs/config';
import matcherConfig from '../config/matcher.config';
import { formatObject } from '../../utils';
import { TemplatesService } from '../../templates/services/templates.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatcherJob, MatcherQueue } from '../matcher.types';

@Injectable()
export class MatcherService implements OnApplicationBootstrap {
  private worker?: Worker;
  private readonly logger = new Logger(MatcherService.name);

  constructor(
    @Inject(matcherConfig.KEY)
    private readonly config: ConfigType<typeof matcherConfig>,
    private readonly pagesService: PagesService,
    private readonly eventEmitter: EventEmitter2,
    private readonly templatesService: TemplatesService,
    @InjectMatcherQueue() private readonly matcherQueue: MatcherQueue,
  ) {}

  async clearAll() {
    for (const status of ['active', 'completed', 'delayed', 'failed', 'wait']) {
      await this.matcherQueue.clean(0, status as any);
    }
  }

  async synchroniseJobs(): Promise<MatcherJob[]> {
    const pages = await this.pagesService.find({
      take: 10,
      // where: {
      //   scannedAt: IsNull(),
      // },
      order: { priority: 'desc', createdAt: 'desc' },
    });
    const jobs = pages.map((page) => ({
      data: { page },
      opts: {
        jobId: page.id,
      },
    }));
    return this.matcherQueue.addBulk(jobs);
  }

  async onApplicationBootstrap(): Promise<void> {
    if (isMainThread) {
      if (this.config.enabled) {
        this.worker = new Worker(require.main.filename, {
          name: 'crawler',
          workerData: {
            name: 'matcher',
            type: 'crawler',
            data: {
              templates: JSON.stringify(this.templatesService.getMap()),
            },
          },
        });

        this.worker
          .on('message', this.handleWorkerMessage.bind(this))
          .on('online', this.handleWorkerStarted.bind(this))
          .on('error', this.handleWorkerError.bind(this))
          .on('exit', this.handleWorkerExit.bind(this));
      }

      // await this.pagesService.delete({});
      await this.clearAll();
      await this.synchroniseJobs();
    }
  }

  protected async handleWorkerMessage(message: any) {
    this.logger.debug(
      { threadId: this.worker.threadId },
      'Handle worker thread message...',
    );
    const { eventName, payload } = message;
    switch (eventName) {
      case 'revision.received': {
        await this.eventEmitter.emitAsync('revision.received', payload);
        break;
      }
    }
    // console.log('message', { message });
  }

  protected handleWorkerStarted() {
    this.logger.log(
      { threadId: this.worker.threadId },
      'Worker thread started',
    );
  }

  protected handleWorkerError(error: Error) {
    this.logger.error(
      { threadId: this.worker.threadId },
      'Worker thread error',
      error,
    );
  }

  protected handleWorkerExit(exitCode: number) {
    this.logger.log(
      { threadId: this.worker.threadId },
      'Worker thread exited with code: %d',
      exitCode,
    );
  }
}
