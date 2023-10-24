import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { MAX_ENTITY_LIMIT, MIN_ENTITY_LIMIT } from '../../consts';

export abstract class BaseListDto {
  /** Offset of the query for pagination */
  @IsInt()
  @Min(0)
  @IsOptional()
  offset: number;
  /** Limit per page of the query for pagination */
  @IsInt()
  @Min(MIN_ENTITY_LIMIT)
  @Max(MAX_ENTITY_LIMIT)
  limit: number;
}
