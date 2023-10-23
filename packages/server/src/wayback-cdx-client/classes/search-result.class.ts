import { Expose, Type } from 'class-transformer';
import { TransformWaybackDatetime } from '../../shared/decorators/transform-wayback-datetime.decorator';

export class SearchResult {
  @Expose({ name: 'urlkey' })
  readonly urlKey: string;
  @TransformWaybackDatetime()
  readonly timestamp: Date;
  readonly original: string;
  readonly mimetype: string;
  @Expose({ name: 'statuscode' })
  @Type(() => Number)
  readonly statusCode: number;
  readonly digest: string;
  @Type(() => Number)
  readonly length: number;
}
