import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Page } from '../entities/page.entity';
import { InsertEvent } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@EventSubscriber()
export class PageSubscriber implements EntitySubscriberInterface<Page> {
  constructor(
    dataSource: DataSource,
    @InjectMetric('pages_added_total') public counter: Counter<string>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Page;
  }

  async afterInsert(event: InsertEvent<Page>) {
    console.log(
      `AFTER PAGE INSERTED: `,
      event.entity.pageId,
      event.entity.title,
    );
    this.counter.inc();
    console.log(await this.counter.get())
  }
}
