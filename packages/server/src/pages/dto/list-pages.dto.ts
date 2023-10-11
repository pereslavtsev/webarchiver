import { webarchiver } from '../../__generated__';
import { IsInt, Max, Min } from 'class-validator';

export class ListPagesDto implements webarchiver.v1.ListPagesRequest {
  /** Offset of the query for pagination */
  @IsInt()
  @Min(0)
  offset: number;
  /** Limit per page of the query for pagination */
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;
}
