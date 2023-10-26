import { DateTime } from 'luxon';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('any-date-parser');

export function parseDate(value: string): Date {
  const jsDate = parser.fromString(value);
  const date = DateTime.fromJSDate(jsDate);
  if (!date.isValid) {
    throw new Error(`${value} is invalid date`);
  }
  const text = date.toISO({ includeOffset: false });
  const isoDate = DateTime.fromISO(text);
  return new Date(Date.UTC(isoDate.year, isoDate.month - 1, isoDate.day));
}
