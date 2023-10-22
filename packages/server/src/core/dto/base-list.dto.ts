import { IsInt, Max, Min } from 'class-validator';

export abstract class BaseListDto {
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
