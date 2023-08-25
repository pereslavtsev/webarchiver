import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';
import { Watcher } from '../entities/watcher.entity';
import { WATCHERS } from '../mocks/watchers.mock';
import { WatcherContext } from '../interfaces/watcher-context.interface';
import { BotService } from '../../bot/services/bot.service';
import { ApiResponse } from 'mwn';

@Injectable()
export class WatchersService
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  constructor(private readonly botService: BotService) {}

  protected readonly workerThreadMap = new Map<Watcher['id'], Worker>();

  async onApplicationBootstrap(): Promise<void> {
    if (isMainThread) {
      const watcher1 = await this.findById(1);
      const watcher2 = await this.findById(2);
      this.run(watcher1);
      this.run(watcher2);
      setTimeout(() => {
        this.stop(watcher1.id);
      }, 3000);
      return;
    }

    const { params }: Watcher = workerData['data'];

    for await (const json of this.botService.continuedQueryGen(params)) {
      parentPort.postMessage(json);
    }
  }

  beforeApplicationShutdown(): void {
    [...this.workerThreadMap.keys()].forEach((watcherId) =>
      this.stop(watcherId),
    );
  }

  findById(id: Watcher['id']) {
    return WATCHERS.find((watcher) => watcher.id === id);
  }

  run(watcher: Watcher): never | void {
    const { id, name } = watcher;

    if (!isMainThread) {
      throw new Error('!!!');
    }

    if (this.workerThreadMap.has(id)) {
      throw new Error('already run');
    }

    const worker = new Worker(require.main.filename, {
      name: `${id}-${name}__watcher`,
      workerData: {
        type: 'watcher',
        data: watcher,
      },
    });

    const context: WatcherContext = {
      data: watcher,
      worker,
    };

    worker
      .on('message', (message) => this.handleWatcherResponse(message, context))
      .on('online', () => this.handleWatcherOnline(context))
      .on('error', (error) => this.handleWatcherError(error, context))
      .on('exit', (code) => this.handleWatcherExit(code, context));
  }

  async stop(id: Watcher['id']): Promise<number | never> {
    if (!isMainThread) {
      throw new Error();
    }

    const worker = this.workerThreadMap.get(id);

    return worker.removeAllListeners().terminate();
  }

  protected handleWatcherOnline(context: WatcherContext): void {
    const { data: watcher, worker } = context;
    const { id } = watcher;

    this.workerThreadMap.set(id, worker);
  }

  protected handleWatcherResponse(
    response: ApiResponse,
    context: WatcherContext,
  ): void {
    console.log(
      'on message',
      context.worker.threadId,
      JSON.stringify(response),
    );
  }

  protected handleWatcherError(error: Error, context: WatcherContext): void {}

  protected handleWatcherExit(code: number, context: WatcherContext): void {
    const { data: watcher } = context;
    const { id } = watcher;

    this.workerThreadMap.delete(id);
  }
}
