import { Page } from '../entities/page.entity';
import { Revision } from '../entities/revision.entity';
import { Source } from '../entities/source.entity';

export class RevisionReceivedEvent {
  page: Page;
  revision: Revision;
  sources: Source[];
}
