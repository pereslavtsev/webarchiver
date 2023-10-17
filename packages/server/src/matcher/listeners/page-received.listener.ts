import { Injectable } from '@nestjs/common';
import { PagesService } from '../../pages/services/pages.service';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { ApiPage, mwn } from 'mwn';

@Injectable()
export class PageReceivedListener {
  constructor(
    private readonly pagesService: PagesService,
    @InjectBot()
    private readonly bot: mwn,
  ) {}

  handlePageReceivedEvent(page: ApiPage) {}
}
