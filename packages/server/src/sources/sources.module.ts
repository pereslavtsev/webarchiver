import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { BotModule } from '../bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';

@Module({
  imports: [BotModule, TypeOrmModule.forFeature([Source])],
  providers: [SourcesService],
  exports: [SourcesService],
})
export class SourcesModule {}
