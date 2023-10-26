import { Page } from '../entities/page.entity';
import { PageHistory } from '../entities/page-history.entity';

export class PageFailedEvent {
  page: Page;
  failure: PageHistory['failure'];
}
