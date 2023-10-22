import { webarchiver } from '../../__generated__';
import { BaseListDto } from '../../core/dto/base-list.dto';
import { IsInt, IsPositive } from 'class-validator';
import { Revision } from '../entities/revision.entity';

export class ListRevisionSourcesDto
  extends BaseListDto
  implements webarchiver.v1.ListRevisionSourcesRequest
{
  @IsInt()
  @IsPositive()
  revisionId: Revision['id'];
}
