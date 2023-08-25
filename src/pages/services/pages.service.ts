import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagesService extends Repository<Page> {
  constructor(
    @InjectRepository(Page)
    repository: Repository<Page>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
