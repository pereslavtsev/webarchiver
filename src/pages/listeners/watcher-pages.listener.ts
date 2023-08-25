import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PagesService } from '../services/pages.service';
import type { ApiPage } from 'mwn';

@Injectable()
export class WatcherPagesListener {
  constructor(private readonly pagesService: PagesService) {}

  protected transformApiPage(apiPage: ApiPage) {
    return this.pagesService.create({
      pageId: apiPage.pageid,
      title: apiPage.title,
      namespace: apiPage.ns,
      redirect: apiPage['redirect'],
    });
  }

  @OnEvent('watcher.pages', { async: true })
  async handleWatcherResponseEvent(apiPages: ApiPage[]) {
    const pages = apiPages.map((apiPage) => this.transformApiPage(apiPage));
    await this.pagesService.upsert(pages, ['pageId']);
  }
}
