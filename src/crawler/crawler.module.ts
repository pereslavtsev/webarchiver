import { Module } from '@nestjs/common';
import { CrawlerService } from './service/crawler.service';
import { PagesModule } from '../pages/pages.module';
import { BotModule } from '../bot/bot.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [BotModule, CoreModule, PagesModule],
  providers: [CrawlerService],
})
export class CrawlerModule {}
