import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { OnEvent } from '@nestjs/event-emitter';
import { Page } from '../entities/page.entity';
import { PageScannedEvent } from '../events/page-scanned.event';
import { PageHistoryService } from '../services/page-history.service';
import { PageFailedEvent } from '../events/page-failed.event';
import { DataSource } from 'typeorm';
import { PageHistory } from '../entities/page-history.entity';

@Injectable()
export class PageListener {
  constructor(
    private readonly pageHistoryService: PageHistoryService,
    private readonly dataSource: DataSource,
    @InjectPinoLogger(PageListener.name)
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent(Page.Event.FAILED, { async: true })
  async handlePageFailedEvent(payload: PageFailedEvent): Promise<void> {
    const { page, failure } = payload;
    const { id: pageId, title } = page;
    // Make a dedicated logger instance
    const logger = this.logger.logger.child({
      context: PageListener.name,
      pageId,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(Page)
        .update({ id: pageId }, { status: Page.Status.FAILED });
      await queryRunner.manager.getRepository(PageHistory).insert({
        scannedAt: new Date(),
        failure,
        pageId,
      });
    } catch (error) {
      logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      logger.error(
        'Page "%s" has NOT been processed -- failure: %s',
        title,
        failure,
      );
    }
  }

  @OnEvent(Page.Event.SCANNED, { async: true })
  async handlePageScannedEvent(payload: PageScannedEvent): Promise<void> {
    const { page, processedRevisionsCount } = payload;
    const { id: pageId, title } = page;
    // Make a dedicated logger instance
    const logger = this.logger.logger.child({
      context: PageListener.name,
      pageId,
    });
    await this.pageHistoryService.insert({ scannedAt: new Date(), pageId });
    logger.info(
      'Page "%s" has been processed, %d revisions scanned',
      title,
      processedRevisionsCount,
    );
  }
}
