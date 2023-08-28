import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';
import { MwnWikitext } from 'mwn';
import { CiteWebTemplate } from '../../archiver/templates/cite-web.template';
import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import { BaseCitationTemplate } from '../../archiver/templates/base-citation-template';
import type { Source } from '../../sources/entities/source.entity';
import { parentPort } from 'worker_threads';

@Processor('crawler')
export class CrawlerConsumer {
  constructor(
    @InjectBot()
    private readonly bot: Bot,
  ) {}

  @OnQueueCompleted()
  onCompleted(_: Job, result: any) {
    parentPort.postMessage(result);
  }

  @Process()
  protected async process(job: Job<Page>) {
    const { data: page } = job;
    const { pageId } = page;

    const apiPage = await this.bot.read(pageId);
    const wkt = new this.bot.wikitext(apiPage.revisions[0].content);
    const templates = await this.parseTemplates(wkt);
    const activeTemplates = templates.map((template) => {
      switch (String(template.name).toLowerCase()) {
        case 'cite web': {
          return new CiteWebTemplate(template);
        }
        default: {
          return new ActiveTemplate(template);
        }
      }
    });
    const unarchived = activeTemplates.filter((activeTemplate) => {
      if (!(activeTemplate instanceof BaseCitationTemplate)) {
        return false;
      }
      return !activeTemplate.isArchived;
    });
    const sources: Partial<Source>[] = unarchived.map(
      (citation: BaseCitationTemplate) => {
        return {
          url: citation.getParam('url').value.trim().toString(),
          accessDate: citation.accessDate,
          wikitextBefore: citation.wikitext,
        };
      },
    );
    return { page, response: apiPage, sources };
  }

  protected async parseTemplates(wkt: MwnWikitext) {
    const templates = wkt.parseTemplates({
      namePredicate: (name) =>
        ['cite web'].includes(String(name).toLowerCase()),
    });
    return templates;
  }
}
