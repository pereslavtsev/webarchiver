import { Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Page } from '../../pages/entities/page.entity';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';
import { ApiRevision, MwnWikitext } from 'mwn';
import { CiteWebTemplate } from '../../archiver/templates/cite-web.template';
import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import { BaseCitationTemplate } from '../../archiver/templates/base-citation-template';
import type { Source } from '../../pages/entities/source.entity';
import { escapeRegExp, formatObject, hrtimeToMs } from '../../utils';
import { MatcherProcessor } from '../matcher.decorators';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import prettyBytes from 'pretty-bytes';
import * as process from 'process';
import { Duration } from 'luxon';
import { NotFoundException } from '@nestjs/common';
import { parentPort } from 'worker_threads';
import { CitationTemplatesService } from '../../templates/services/citation-templates.service';
import { DeepPartial } from 'typeorm';

@MatcherProcessor()
export class MatcherBackgroundConsumer {
  constructor(
    @InjectBot()
    private readonly bot: Bot,
    @InjectPinoLogger(MatcherBackgroundConsumer.name)
    private readonly logger: PinoLogger,
    private readonly citationTemplatesService: CitationTemplatesService,
  ) {}

  @OnQueueFailed()
  handleJobFailed(job: Job<Page>, error: Error) {
    const { data: page, id: jobId } = job;
    const { id: pageId, title } = page;
    this.logger.error(
      { jobId, pageId },
      'Matcher job failed on page "%s":',
      title,
    );
    this.logger.error(error);
  }

  @Process()
  protected async process(job: Job<Page>) {
    const { id: jobId, data: page } = job;
    const { id: pageId } = page;

    const logger = this.logger.logger.child({
      context: MatcherBackgroundConsumer.name,
      jobId,
    });

    logger.debug(
      'Reading page: "%s" -- data: %s',
      page.title,
      formatObject(page),
    );
    // const apiPage = await this.bot.read(pageId, {
    //   rvprop: ['ids', 'timestamp', 'content'],
    // });
    // const wkt = new this.bot.wikitext(apiPage.revisions[0].content);
    // const templates = await this.parseTemplates(wkt);
    // const activeTemplates = templates.map((template) => {
    //   switch (String(template.name).toLowerCase()) {
    //     case 'cite web': {
    //       return new CiteWebTemplate(template);
    //     }
    //     default: {
    //       return new ActiveTemplate(template);
    //     }
    //   }
    // });
    // const unarchived = activeTemplates.filter((activeTemplate) => {
    //   if (!(activeTemplate instanceof BaseCitationTemplate)) {
    //     return false;
    //   }
    //   return !activeTemplate.isArchived;
    // });
    // const sources: Partial<Source>[] = unarchived.map(
    //   (citation: BaseCitationTemplate) => {
    //     return {
    //       url: citation.getParam('url').value.trim().toString().split('#')[0],
    //       accessDate: citation.accessDate,
    //       wikitextBefore: citation.wikitext,
    //     };
    //   },
    // );
    //
    // if (!sources.length) {
    //   return { page, response: apiPage, sources: [] };
    // }
    //
    // const tailRevisionId = apiPage.revisions[0].revid;
    // const regexp = new RegExp(
    //   sources.map((source) => escapeRegExp(source.url)).join('|'),
    //   'gi',
    // );

    // console.log('unarchived sources', sources.length);
    // console.log('regexp', regexp);

    logger.debug('Fetching revisions for page "%s" ...', page.title);

    for await (const json of this.bot.continuedQueryGen({
      action: 'query',
      prop: 'revisions',
      pageids: pageId,
      rvdir: 'newer',
      // rvendid: tailRevisionId,
      rvslots: 'main',
      rvlimit: 'max',
      rvprop: ['ids', 'content', 'comment', 'timestamp', 'size'],
    })) {
      const revisions = json.query.pages[0].revisions;

      logger.debug(
        'Revisions received for page "%s" : %d',
        page.title,
        revisions.length,
      );
      for (const revision of revisions as ApiRevision[]) {
        logger.debug(
          'Processing revision %d (%s) for page "%s" (%s) ...',
          revision.revid,
          revision.timestamp,
          page.title,
          prettyBytes(revision.size),
        );
        const start = process.hrtime();
        // START
        const { revid: revisionId, parentid: parentId, timestamp } = revision;

        if (revision.slots.main['texthidden']) {
          parentPort.postMessage({
            eventName: 'revision.received',
            payload: {
              page,
              revision: {
                id: revisionId,
                parentId,
                timestamp,
                pageId,
                textHidden: true,
              },
              sources: [],
            },
          });
          continue;
        }

        const citationTemplates = this.citationTemplatesService.extract(
          revision.slots.main.content,
        );

        const sources = citationTemplates.map<DeepPartial<Source>>(
          (citationTemplate) => ({
            archiveDate: citationTemplate.accessDate,
            archiveUrl: citationTemplate.archiveUrl?.toString(),
            preferredAt: citationTemplate.accessDate ?? timestamp,
            wikitextBefore: citationTemplate.wikitext,
            url: citationTemplate.url?.toString(),
            accessDate: citationTemplate.accessDate,
            revisionId: revisionId,
          }),
        );

        parentPort.postMessage({
          eventName: 'revision.received',
          payload: {
            page,
            revision: { id: revisionId, parentId, timestamp, pageId },
            sources,
          },
        });
        // END
        const end = process.hrtime(start);
        const duration = Duration.fromMillis(hrtimeToMs(end));
        logger.debug(
          'Processing DONE revision %d (%s) for page "%s" (%s)',
          revision.revid,
          revision.timestamp,
          page.title,
          duration.toHuman({ unitDisplay: 'short', listStyle: 'short' }),
        );
      }
    }

    return { sources: [] };
  }
}
