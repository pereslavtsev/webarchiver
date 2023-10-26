import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageHistory } from '../entities/page-history.entity';

@Injectable()
export class PageHistoryService extends Repository<PageHistory> {
  constructor(
    @InjectRepository(PageHistory)
    repository: Repository<PageHistory>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
