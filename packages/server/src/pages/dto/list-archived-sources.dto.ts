import { webarchiver } from '../../__generated__';
import { IsUUID } from 'class-validator';
import { Source } from '../entities/source.entity';

export class ListArchivedSourcesDto
  implements webarchiver.v1.ListArchivedSourcesRequest
{
  @IsUUID()
  id: Source['id'];
}
