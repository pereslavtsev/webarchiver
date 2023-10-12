import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TEMPLATES_MOCK } from '../templates.mock';

@Injectable()
export class TemplatesService
  extends Repository<Template>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(Template)
    repository: Repository<Template>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.save(TEMPLATES_MOCK)
  }
}
