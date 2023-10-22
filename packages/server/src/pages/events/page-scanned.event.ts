import { Page } from '../entities/page.entity';

export class PageScannedEvent {
  page: Page;
  processedRevisionsCount: number;
}
