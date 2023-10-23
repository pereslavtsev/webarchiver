import { Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { DateTimeJSOptions } from 'luxon/src/datetime';
import { WAYBACK_DATE_FORMAT } from '../../shared/utils/date-time.utils';
import { TransformWaybackDatetime } from '../../shared/decorators/transform-wayback-datetime.decorator';

const REGEXP = /(?<hours>\d{2})(?<minutes>\d{2})(?<seconds>\d{2})$/;

export class Snapshot {
  private static DateTimeOptions: DateTimeJSOptions = {
    zone: 'utc',
  };

  private static replacer(substring: string, ...args: any[]) {
    const { hours, minutes, seconds } = args.at(-1);

    if (hours === '00' && minutes === '00' && seconds === '00') {
      return substring.substring(0, substring.length - 6);
    }
    if (minutes === '00' && seconds === '00') {
      return substring.substring(0, substring.length - 4);
    }
    if (seconds === '00') {
      return substring.substring(0, substring.length - 2);
    }
    return substring;
  }

  static formatDate(timestamp: Date | string | number) {
    switch (typeof timestamp) {
      case 'string': {
        return timestamp;
      }
      case 'number': {
        return DateTime.fromMillis(timestamp, this.DateTimeOptions)
          .toFormat(WAYBACK_DATE_FORMAT)
          .replace(REGEXP, this.replacer.bind(this));
      }
      case 'object': {
        return DateTime.fromJSDate(timestamp, this.DateTimeOptions)
          .toFormat(WAYBACK_DATE_FORMAT)
          .replace(REGEXP, this.replacer.bind(this));
      }
    }
  }

  readonly available: boolean;
  readonly url: string;
  @TransformWaybackDatetime()
  readonly timestamp: Date;
  @Type(() => Number)
  readonly status: number;
}
