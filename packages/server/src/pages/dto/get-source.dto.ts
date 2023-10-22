import { webarchiver } from '../../__generated__';
import { IsUUID } from 'class-validator';
import { Source } from '../entities/source.entity';

export class GetSourceDto implements webarchiver.v1.GetPageRequest {
  @IsUUID()
  id: Source['id'];
}
