import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';
import { ApiRevision, MwnWikitext } from 'mwn';
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

    console.log('reading page', page);
    const apiPage = await this.bot.read(pageId, {
      rvprop: ['ids', 'timestamp', 'content'],
    });
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

    if (!sources.length) {
      return { page, response: apiPage, sources: [] };
    }

    const sourcesMap = new Map();

    const tailRevisionId = apiPage.revisions[0].revid;
    const regexp = new RegExp(
      sources.map((source) => source.url).join('|'),
      'gi',
    );

    // console.log('regexp', regexp);

    for await (const json of this.bot.continuedQueryGen({
      action: 'query',
      prop: 'revisions',
      pageids: pageId,
      rvdir: 'newer',
      rvendid: tailRevisionId,
      rvslots: 'main',
      rvlimit: 'max',
      rvprop: ['ids', 'content', 'comment', 'timestamp'],
    })) {
      for (const revision of json.query.pages[0].revisions as ApiRevision[]) {
        const matched = [
          ...String(revision.slots.main.content).matchAll(regexp),
        ];
        console.log('matched', matched);
        if (!matched) {
          continue;
        }
        [...matched].map((match) => sourcesMap.set(match[0], revision.timestamp));
        if (sourcesMap.size >= sources.length) {
          break;
        }
      }
    }

    console.log(333333, sourcesMap);
    console.log(4444, sources.length);

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
