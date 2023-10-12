import { Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';
import { ApiRevision, MwnWikitext } from 'mwn';
import { CiteWebTemplate } from '../../archiver/templates/cite-web.template';
import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import { BaseCitationTemplate } from '../../archiver/templates/base-citation-template';
import type { Source } from '../../sources/entities/source.entity';
import { escapeRegExp, formatObject } from '../../utils';
import { MatcherProcessor } from '../matcher.decorators';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@MatcherProcessor()
export class MatcherBackgroundConsumer {
  constructor(
    @InjectBot()
    private readonly bot: Bot,
    @InjectPinoLogger(MatcherBackgroundConsumer.name)
    private readonly logger: PinoLogger,
  ) {}

  @Process()
  protected async process(job: Job<Page>) {
    const logger = this.logger.logger.child({
      context: MatcherBackgroundConsumer.name,
      jobId: job.id,
    });

    const { data: page } = job;
    const { id: pageId } = page;

    logger.debug(
      'Reading page: "%s" -- data: %s',
      page.title,
      formatObject(page),
    );
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
    let sources: Partial<Source>[] = unarchived.map(
      (citation: BaseCitationTemplate) => {
        return {
          url: citation.getParam('url').value.trim().toString().split('#')[0],
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
      sources.map((source) => escapeRegExp(source.url)).join('|'),
      'gi',
    );

    console.log('unarchived sources', sources.length);
    console.log('regexp', regexp);

    const sourcesCount = new Set(sources.map((source) => source.url)).size;

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
        const matched = String(revision.slots.main.content).match(regexp);
        // console.log('matched', matched);
        if (!matched) {
          continue;
        }
        [...matched]
          .filter((match) => !sourcesMap.has(match))
          .forEach((match) => sourcesMap.set(match, revision));
      }
      const progress = Math.floor((sourcesMap.size / sources.length) * 100);
      if (progress !== job.progress()) {
        await job.progress(progress);
      }
      if (sourcesMap.size >= sourcesCount) {
        console.log(
          `all sources (${sources.length}) has been matched with revisions, breaking a continued query...`,
        );
        break;
      }
    }

    if (sourcesMap.size !== sourcesCount) {
      console.log(
        'not matched',
        sources
          .map((source) => source.url)
          .filter((url) => !sourcesMap.has(url)),
      );
      throw new Error('not matched');
    }

    sources = sources.map((source) => {
      const revision: ApiRevision = sourcesMap.get(source.url);
      source.preferredAt = new Date(revision.timestamp);
      source.revisionId = revision.revid;
      return source;
    });

    return { response: apiPage, sources };
  }

  protected async parseTemplates(wkt: MwnWikitext) {
    const templates = wkt.parseTemplates({
      namePredicate: (name) =>
        ['cite web'].includes(String(name).toLowerCase()),
    });
    return templates;
  }
}
