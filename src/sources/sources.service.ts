import { Injectable, OnModuleInit } from '@nestjs/common';
import { CiteWebTemplate } from '../archiver/templates/cite-web.template';
import { InjectBot } from '../bot/decorators/inject-bot.decorator';
import { mwn } from 'mwn';
import { ActiveTemplate } from '../archiver/classes/active-template.class';

@Injectable()
export class SourcesService implements OnModuleInit {
  constructor(
    @InjectBot()
    private readonly bot: mwn,
  ) {}

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
