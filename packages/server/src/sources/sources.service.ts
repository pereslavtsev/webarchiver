import { Injectable, OnModuleInit } from '@nestjs/common';
import { CiteWebTemplate } from '../archiver/templates/cite-web.template';
import { InjectBot } from '../bot/decorators/inject-bot.decorator';
import { ActiveTemplate } from '../archiver/classes/active-template.class';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from '../bot/classes/bot.class';
import { Source } from './entities/source.entity';

@Injectable()
export class SourcesService extends Repository<Source> implements OnModuleInit {
  constructor(
    @InjectBot()
    private readonly bot: Bot,
    @InjectRepository(Source)
    repository: Repository<Source>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  protected templateNamespace: string;

  async onModuleInit(): Promise<any> {
    const { query } = await this.bot.query({
      meta: 'siteinfo',
      siprop: 'namespaces',
      format: 'json',
      formatversion: 2,
    });
    this.templateNamespace = Object.values(query['namespaces']).find(
      (namespace) => namespace['canonical'] === 'Template',
    )['name'];
  }

  async findRedirects() {
    const c = await this.bot.query({
      prop: ['redirects'],
      titles: [`${this.templateNamespace}:cite web`],
    });
  }

  async findByPage(title: string) {
    const page = await this.bot.read(title);
    const wkt = new this.bot.wikitext(page.revisions[0].content);
    const templates = wkt
      .parseTemplates({
        namePredicate: (name) =>
          ['cite web'].includes(String(name).toLowerCase()),
      })
      .map((template) => {
        switch (String(template.name).toLowerCase()) {
          case 'cite web': {
            return new CiteWebTemplate(template);
          }
          default: {
            return new ActiveTemplate(template);
          }
        }
      });
  }
}
