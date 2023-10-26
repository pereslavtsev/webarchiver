import { webarchiver } from '../../__generated__';
import { IsInt, IsPositive } from 'class-validator';
import { Revision } from '../entities/revision.entity';

export class GetRevisionDto implements webarchiver.v1.GetPageRequest {
  @IsInt()
  @IsPositive()
  id: Revision['id'];
}
