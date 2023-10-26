import { Transform } from 'class-transformer';
import { parseWaybackDate } from '../utils/date-time.utils';

export function TransformWaybackDatetime() {
  return Transform(({ value }) => parseWaybackDate(value));
}
