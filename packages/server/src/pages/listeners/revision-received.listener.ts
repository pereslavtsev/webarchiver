import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RevisionReceivedEvent } from '../events/revision-received.event';
import { Revision } from '../entities/revision.entity';
import { Source } from '../entities/source.entity';

@Injectable()
export class RevisionReceivedListener {
  constructor(
    private readonly dataSource: DataSource,
    @InjectPinoLogger(RevisionReceivedListener.name)
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('revision.received', { async: true })
  async handleRevisionReceivedEvent(payload: RevisionReceivedEvent) {
    const { page, sources, revision } = payload;
    const { id: pageId, title } = page;
    const { id: revisionId, timestamp } = revision;
    // Make a dedicated logger instance
    const logger = this.logger.logger.child({
      context: RevisionReceivedListener.name,
      pageId,
      revisionId,
    });

    logger.debug(
      'Revision %d (%s) for page "%s" received with %d sources',
      revisionId,
      timestamp,
      title,
      sources.length,
    );
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(Revision)
        .upsert(
          { ...revision, scannedAt: new Date() },
          { skipUpdateIfNoValuesChanged: true, conflictPaths: ['id'] },
        );
      await queryRunner.manager.getRepository(Source).delete({ revisionId });
      await queryRunner.manager.getRepository(Source).insert(sources);
      await queryRunner.commitTransaction();
    } catch (error) {
      logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
