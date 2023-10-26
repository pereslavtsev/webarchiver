import { webarchiver } from '../../__generated__';
import { BaseListDto } from '../../core/dto/base-list.dto';

export class ListPagesDto
  extends BaseListDto
  implements webarchiver.v1.ListPagesRequest {}
