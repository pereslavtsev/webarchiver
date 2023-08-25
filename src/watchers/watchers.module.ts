import { Module } from '@nestjs/common';
import { WatchersService } from './services/watchers.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule],
  providers: [WatchersService],
  exports: [WatchersService],
})
export class WatchersModule {}
