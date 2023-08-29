import { Module, ModuleMetadata } from '@nestjs/common';
import { CrawlerService } from './service/crawler.service';
import { PagesModule } from '../pages/pages.module';
import { BotModule } from '../bot/bot.module';
import { CoreModule } from '../core/core.module';
import { BullModule } from '@nestjs/bull';
import { CrawlerBackgroundConsumer } from './consumers/crawler-background.consumer';
import { isMainThread } from 'worker_threads';
import { CrawlerMainConsumer } from './consumers/crawler-main.consumer';

const metadata: ModuleMetadata = {
  imports: [
    BotModule,
    CoreModule,
    BullModule.registerQueue({
      name: 'crawler',
    }),
  ],
  providers: [],
};

if (!isMainThread) {
  metadata.providers.push(CrawlerBackgroundConsumer);
} else {
  metadata.imports.push(PagesModule);
  metadata.providers.push(CrawlerMainConsumer, CrawlerService);
}

@Module(metadata)
export class CrawlerModule {}
