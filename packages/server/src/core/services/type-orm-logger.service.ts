import { Logger as ITypeOrmLogger } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { highlight } from 'sql-highlight';

@Injectable()
export class TypeOrmLoggerService implements ITypeOrmLogger {
  private readonly logger = new Logger('SQL');
  private readonly separator = ' -- ';

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[]): void {
    const message = [];

    if (query) {
      message.push('query: %s');
    }

    if (parameters) {
      message.push('parameters: %o');
    }

    this.logger.debug(
      message.join(this.separator),
      highlight(query),
      parameters,
    );
  }
  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
  ): void {
    this.logger.error(
      `failed: %s -- parameters: %o -- error: %s`,
      highlight(query),
      parameters,
      error,
    );
  }
  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[]): void {
    this.logger.error(
      `time: %d -- query: %s -- parameters: %o`,
      time,
      highlight(query),
      parameters,
    );
  }
  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string): void {
    this.logger.log(message);
  }
  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string): void {
    this.logger.log(message);
  }
  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any): void {
    switch (level) {
      case 'log': {
        this.logger.log(message);
        break;
      }
      case 'info': {
        this.logger.debug(message);
        break;
      }
      case 'warn': {
        this.logger.warn(message);
      }
    }
  }
}
