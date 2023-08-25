import {
  Inject,
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
import { ConfigModule, ConfigType } from '@nestjs/config';
import { WatchersController } from './controllers/watchers.controller';
import watchersConfig from './config/watchers.config';

const metadata: ModuleMetadata = {
  imports: [ConfigModule.forFeature(watchersConfig), BotModule],
  controllers: [],
  providers: [],
  exports: [],
};

if (process.send === undefined && isMainThread) {
  metadata.imports.push(TypeOrmModule.forFeature([Watcher]));
  metadata.controllers.push(WatchersController);
  metadata.providers.push(WatchersService);
  metadata.exports.push(WatchersService);
}

@Module(metadata)
export class WatchersModule implements OnApplicationBootstrap {
  constructor(
    @Inject(watchersConfig.KEY)
    private readonly config: ConfigType<typeof watchersConfig>,
    private readonly botService: BotService,
    @Optional()
    private readonly watchersService: WatchersService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const { autorun } = this.config;

    if (isMainThread && autorun) {
      const watchers = await this.watchersService.find();
      watchers.forEach((watcher) => this.watchersService.run(watcher));
      // setTimeout(() => {
      //   this.watchersService.stop(2);
      // }, 5000);
      return;
    } else if (!isMainThread) {
      const { params }: Watcher = workerData['data'];

      for await (const json of this.botService.continuedQueryGen(params)) {
        parentPort.postMessage(json);
      }
    }
  }
}
