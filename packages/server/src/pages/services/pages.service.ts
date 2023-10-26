import {
  ConflictException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';
import type { ApiPage } from 'mwn';

@Injectable()
export class PagesService
  extends Repository<Page>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectBot()
    private readonly bot: Bot,
    @InjectRepository(Page)
    repository: Repository<Page>,
    @InjectMetric('pages_received_total')
    public readonly pagesReceivedTotal: Counter<string>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  private transformApiPage(apiPage: ApiPage): Page {
    return this.create({
      id: apiPage.pageid,
      namespace: apiPage.ns,
      title: apiPage['title'],
      redirect: false,
      priority: 0,
    });
  }

  async fetchById(pageId: Page['id']): Promise<Page> {
    const apiResponse = await this.bot.query({
      pageids: pageId,
      redirects: true,
    });
    const [page] = apiResponse.query?.['pages']?.map(
      this.transformApiPage.bind(this),
    );
    return page;
  }

  async fetchByTitle(pageTitle: Page['title']): Promise<Page> {
    const apiResponse = await this.bot.query({
      titles: pageTitle,
      redirects: true,
    });
    const [page] = apiResponse.query?.['pages']?.map(
      this.transformApiPage.bind(this),
    );
    return page;
  }

  async addById(pageId: Page['id']) {
    const page = await this.fetchById(pageId);

    const isPageAdded = await this.exist({ where: { id: page.id } });
    if (isPageAdded) {
      throw new ConflictException();
    }

    return this.save({
      ...page,
      status: Page.Status.PENDING,
    });
  }

  async addByTitle(pageTitle: Page['title']): Promise<Page> {
    const page = await this.fetchByTitle(pageTitle);
    return this.addById(page.id);
  }

  onApplicationBootstrap(): void {
    this.pagesReceivedTotal.reset();
    this.pagesReceivedTotal.reset();
  }
}
