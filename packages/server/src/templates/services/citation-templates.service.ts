import { Injectable } from '@nestjs/common';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';
import { workerData } from 'worker_threads';
import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import { TemplateMap } from '../classes/template-map.class';
import { CiteWebTemplate } from '../../archiver/templates/cite-web.template';
import type { Template as MwnTemplate } from 'mwn';
import { UnknownCitationTemplateClassException } from '../exceptions/unknown-citation-template-class.exception';
import type { BaseCitationTemplate } from '../../archiver/templates/base-citation-template';

@Injectable()
export class CitationTemplatesService {
  private readonly map: TemplateMap;

  constructor(
    @InjectBot()
    private readonly bot: Bot,
  ) {
    this.map = TemplateMap.fromJSON(
      JSON.parse(workerData['data']['templates']),
    );
  }

  private transformMwnTemplate(mwnTemplate: MwnTemplate): BaseCitationTemplate {
    const name = mwnTemplate.name as string;
    const template = this.map.get(name);
    if (!template) {
      throw new UnknownCitationTemplateClassException();
    }
    switch (template.title.toLowerCase()) {
      case 'cite web': {
        return new CiteWebTemplate(mwnTemplate);
      }
      default: {
        throw new UnknownCitationTemplateClassException();
      }
    }
  }

  extract(text: string) {
    const wkt = new this.bot.wikitext(text);
    const templates = wkt
      .parseTemplates({})
      .filter((mwnTemplate) => typeof mwnTemplate.name === 'string')
      .map((mwnTemplate) => {
        try {
          return this.transformMwnTemplate(mwnTemplate);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    return templates;
  }
}
