import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TEMPLATES_MOCK } from '../templates.mock';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';

@Injectable()
export class TemplatesService
  extends Repository<Template>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectBot()
    private readonly bot: Bot,
    @InjectRepository(Template)
    repository: Repository<Template>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.upsert(TEMPLATES_MOCK, ['id']);
  }

  async synchronise() {
    // this.bot.n
  }
}
