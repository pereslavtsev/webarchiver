import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PagesService } from '../services/pages.service';
import type { ApiPage } from 'mwn';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class WatcherPagesListener {
  constructor(
    private readonly pagesService: PagesService,
    @InjectMetric('pages_received_total')
    public readonly pagesReceivedTotal: Counter<string>,
  ) {}

  protected transformApiPage(apiPage: ApiPage) {
    return this.pagesService.create({
      id: apiPage.pageid,
      title: apiPage.title,
      namespace: apiPage.ns,
      redirect: apiPage['redirect'],
    });
  }

  @OnEvent('watcher.pages', { async: true })
  async handleWatcherResponseEvent(apiPages: ApiPage[]) {
    this.pagesReceivedTotal.inc(apiPages.length);
    const pages = apiPages.map((apiPage) => this.transformApiPage(apiPage));
    await this.pagesService.upsert(pages, ['id']);
  }
}
