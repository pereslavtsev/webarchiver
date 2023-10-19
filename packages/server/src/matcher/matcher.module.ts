import { Module, ModuleMetadata } from '@nestjs/common';
import { MatcherService } from './service/matcher.service';
import { PagesModule } from '../pages/pages.module';
import { BotModule } from '../bot/bot.module';
import { CoreModule } from '../core/core.module';
import { BullModule } from '@nestjs/bull';
import { MatcherBackgroundConsumer } from './consumers/matcher-background.consumer';
import { isMainThread } from 'worker_threads';
import { MatcherMainConsumer } from './consumers/matcher-main.consumer';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import matcherConfig from './config/matcher.config';
import { TemplatesModule } from '../templates/templates.module';
import { MatcherQueueConfigService } from './service/matcher-queue-config.service';
import { MATCHER_QUEUE } from './matcher.consts';

const metadata: ModuleMetadata = {
  imports: [
    ConfigModule.forFeature(matcherConfig),
    BotModule,
    CoreModule,
    LoggerModule.forRoot(),
    BullModule.registerQueueAsync({
      useClass: MatcherQueueConfigService,
      name: MATCHER_QUEUE,
    }),
  ],
  providers: [],
};

if (!isMainThread) {
  metadata.providers.push(MatcherBackgroundConsumer);
} else {
  metadata.imports.push(PagesModule, TemplatesModule);
  metadata.providers.push(MatcherMainConsumer, MatcherService);
}

@Module(metadata)
export class MatcherModule {}
