import { webarchiver } from '../../__generated__';
import { IsInt, IsPositive } from 'class-validator';
import { Page } from '../entities/page.entity';

export class AddPageDto implements webarchiver.v1.AddPageRequest {
  @IsInt()
  @IsPositive()
  id: Page['id'];
}
