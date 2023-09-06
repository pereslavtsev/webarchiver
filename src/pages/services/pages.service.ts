import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class PagesService
  extends Repository<Page>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(Page)
    repository: Repository<Page>,
    @InjectMetric('pages_received_total')
    public readonly pagesReceivedTotal: Counter<string>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  onApplicationBootstrap(): void {
    this.pagesReceivedTotal.reset();
    this.pagesReceivedTotal.reset();
  }
}
