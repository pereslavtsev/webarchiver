import {
  Module,
  ModuleMetadata,
  OnApplicationBootstrap,
  Optional,
} from '@nestjs/common';
import { WatchersService } from './services/watchers.service';
import { BotModule } from '../bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watcher } from './entities/watcher.entity';
import { isMainThread, parentPort, workerData } from 'worker_threads';
import { BotService } from '../bot/services/bot.service';
import process from 'process';

const metadata: ModuleMetadata = {
  imports: [BotModule],
  providers: [],
  exports: [],
};

if (process.send === undefined && isMainThread) {
  metadata.imports.push(TypeOrmModule.forFeature([Watcher]));
  metadata.providers.push(WatchersService);
  metadata.exports.push(WatchersService);
}

@Module(metadata)
export class WatchersModule implements OnApplicationBootstrap {
  constructor(
    private readonly botService: BotService,
    @Optional()
    private readonly watchersService: WatchersService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (isMainThread) {
      const watchers = await this.watchersService.find();
      console.log('watchers', watchers);
      watchers.forEach((watcher) => this.watchersService.run(watcher));
      // setTimeout(() => {
      //   this.watchersService.stop(2);
      // }, 5000);
      return;
    }

    const { params }: Watcher = workerData['data'];

    for await (const json of this.botService.continuedQueryGen(params)) {
      parentPort.postMessage(json);
    }
  }
}
