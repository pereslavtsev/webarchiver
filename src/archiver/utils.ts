import {DateTime} from "luxon";

export function parseDate(value: string): Date {
  const jsDate = new Date(value);
  const text = DateTime.fromJSDate(jsDate).toISO({ includeOffset: false });
  const isoDate = DateTime.fromISO(text);
  return new Date(Date.UTC(isoDate.year, isoDate.month - 1, isoDate.day));
}
