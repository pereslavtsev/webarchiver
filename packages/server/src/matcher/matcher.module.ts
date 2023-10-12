import { Module, ModuleMetadata } from '@nestjs/common';
import { MatcherService } from './service/matcher.service';
import { PagesModule } from '../pages/pages.module';
import { BotModule } from '../bot/bot.module';
import { CoreModule } from '../core/core.module';
import { BullModule } from '@nestjs/bull';
import { MatcherBackgroundConsumer } from './consumers/matcher-background.consumer';
import { isMainThread } from 'worker_threads';
import { MatcherMainConsumer } from './consumers/matcher-main.consumer';
import { SourcesModule } from '../sources/sources.module';
import { MATCHER_QUEUE } from './matcher.consts';
import { LoggerModule } from 'nestjs-pino';

const metadata: ModuleMetadata = {
  imports: [
    BotModule,
    CoreModule,
    LoggerModule.forRoot(),
    BullModule.registerQueue({
      name: MATCHER_QUEUE,
      settings: {
        maxStalledCount: 10 * 60 * 1000,
      },
    }),
  ],
  providers: [],
};

if (!isMainThread) {
  metadata.providers.push(MatcherBackgroundConsumer);
} else {
  metadata.imports.push(PagesModule, SourcesModule);
  metadata.providers.push(MatcherMainConsumer, MatcherService);
}

@Module(metadata)
export class MatcherModule {}
