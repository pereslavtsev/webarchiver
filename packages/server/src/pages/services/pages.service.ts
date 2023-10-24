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

  async add(pageId: Page['id']) {
    const isPageAdded = await this.exist({ where: { id: pageId } });
    if (isPageAdded) {
      throw new ConflictException();
    }
    const apiResponse = await this.bot.query({
      pageids: pageId,
      redirects: true,
    });
    const apiPage = apiResponse.query?.['pages']?.[0];
    return this.save({
      id: apiPage.pageid,
      namespace: apiPage.ns,
      title: apiPage['title'],
      redirect: false,
      priority: 0,
      status: Page.Status.PENDING,
    });
  }

  onApplicationBootstrap(): void {
    this.pagesReceivedTotal.reset();
    this.pagesReceivedTotal.reset();
  }
}
