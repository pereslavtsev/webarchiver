import { webarchiver } from '../../__generated__';
import { IsInt, IsPositive } from 'class-validator';
import { Page } from '../entities/page.entity';

export class GetPageDto implements webarchiver.v1.GetPageRequest {
  @IsInt()
  @IsPositive()
  id: Page['id'];
}
