import { Injectable } from '@nestjs/common';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { mwn } from 'mwn';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectBot()
    private readonly bot: mwn,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async crawl(title: string): Promise<void> {
    const page = await this.bot.read(title);
    await this.eventEmitter.emitAsync('page.received', page);
  }
}
