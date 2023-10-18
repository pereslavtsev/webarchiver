import { Injectable } from '@nestjs/common';
import { InjectBot } from '../decorators/inject-bot.decorator';
import { Bot } from '../classes/bot.class';
import { workerData } from 'worker_threads';
import { ActiveTemplate } from '../../archiver/classes/active-template.class';

@Injectable()
export class ActiveTemplatesService {
  constructor(
    @InjectBot()
    private readonly bot: Bot,
  ) {}

  protected extractNamePredicate(name: string) {
    return new RegExp(workerData['data']['regexp']).test(name);
  }

  extract(text: string) {
    const wkt = new this.bot.wikitext(text);
    const templates = wkt
      .parseTemplates({
        namePredicate: this.extractNamePredicate.bind(this),
      })
      .map((template) => new ActiveTemplate(template));
    return templates;
  }
}
