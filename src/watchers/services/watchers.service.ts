import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { isMainThread, Worker } from 'worker_threads';
import { Watcher } from '../entities/watcher.entity';
import { WATCHERS } from '../mocks/watchers.mock';
import { WatcherContext } from '../interfaces/watcher-context.interface';
import { ApiResponse } from 'mwn';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WatchersService
  extends Repository<Watcher>
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  constructor(
    @InjectRepository(Watcher)
    repository: Repository<Watcher>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  protected readonly workerThreadMap = new Map<Watcher['id'], Worker>();

  async onApplicationBootstrap(): Promise<void> {
    // await this.save(WATCHERS);
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

    // console.log('worker', worker);

    if (!worker) {
      throw new Error(`Worker for watcher ${id} not found`);
    }

    return worker.terminate();
  }

  protected async handleWatcherOnline(context: WatcherContext): Promise<void> {
    const { data: watcher, worker } = context;
    const { id } = watcher;

    console.log(`watcher ${id} has been started`);

    this.workerThreadMap.set(id, worker);
    await this.update({ id }, { startedAt: new Date() });
  }

  protected async handleWatcherResponse(
    response: ApiResponse,
    context: WatcherContext,
  ): Promise<void> {
    const { data: watcher } = context;
    const { id } = watcher;

    console.log(
      'on message',
      context.worker.threadId,
      JSON.stringify(response),
    );
    await this.update({ id }, { continue: response.continue });
  }

  protected async handleWatcherError(
    error: Error,
    context: WatcherContext,
  ): Promise<void> {
    console.error(error);
  }

  protected async handleWatcherExit(
    exitCode: number,
    context: WatcherContext,
  ): Promise<void> {
    const { data: watcher } = context;
    const { id } = watcher;

    console.log(`watcher ${id} has been interrupted with code ${exitCode}`);

    this.workerThreadMap.delete(id);
    await this.update({ id }, { interruptedAt: new Date(), exitCode });
  }
}
