import { webarchiver } from '../../__generated__';
import { BaseListDto } from '../../core/dto/base-list.dto';
import { Page } from '../entities/page.entity';
import { IsInt, IsPositive } from 'class-validator';

export class ListPageHistoryDto
  extends BaseListDto
  implements webarchiver.v1.ListRevisionsRequest
{
  @IsInt()
  @IsPositive()
  pageId: Page['id'];
}
