import { Module, ModuleMetadata } from '@nestjs/common';
import { CrawlerService } from './service/crawler.service';
import { PagesModule } from '../pages/pages.module';
import { BotModule } from '../bot/bot.module';
import { CoreModule } from '../core/core.module';
import { BullModule } from '@nestjs/bull';
import { CrawlerConsumer } from './consumers/crawler.consumer';
import { isMainThread } from 'worker_threads';

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
  metadata.providers.push(CrawlerConsumer);
} else {
  metadata.imports.push(PagesModule);
  metadata.providers.push(CrawlerService);
}

@Module(metadata)
export class CrawlerModule {}
