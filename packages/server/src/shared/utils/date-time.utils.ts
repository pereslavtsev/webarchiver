import { DateTime } from 'luxon';

export const WAYBACK_DATE_FORMAT = 'yyyyMMddHHmmss';

export function parseWaybackDate(datetimeStr: string): Date {
  return DateTime.fromFormat(datetimeStr, WAYBACK_DATE_FORMAT, {
    zone: null,
  }).toJSDate();
}
