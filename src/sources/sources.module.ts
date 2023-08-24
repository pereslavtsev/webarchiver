import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule],
  providers: [SourcesService],
  exports: [SourcesService],
})
export class SourcesModule {}
