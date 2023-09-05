import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Page } from '../entities/page.entity';
import { InsertEvent } from 'typeorm';

@EventSubscriber()
export class PageSubscriber implements EntitySubscriberInterface<Page> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Page;
  }

  afterInsert(event: InsertEvent<Page>) {
    console.log(
      `AFTER PAGE INSERTED: `,
      event.entity.pageId,
      event.entity.title,
    );
  }
}
