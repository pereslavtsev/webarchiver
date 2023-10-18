import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TEMPLATES_MOCK } from '../templates.mock';
import { InjectBot } from '../../bot/decorators/inject-bot.decorator';
import { Bot } from '../../bot/classes/bot.class';
import { EntityMap } from '../../core/types';
import type { ApiPage } from 'mwn';
import { isMainThread } from 'worker_threads';

@Injectable()
export class TemplatesService
  extends Repository<Template>
  implements OnApplicationBootstrap
{
  private readonly map: EntityMap<Template> = new Map();
  private readonly logger = new Logger(TemplatesService.name);

  private regexp: RegExp;

  constructor(
    @InjectBot()
    private readonly bot: Bot,
    @InjectRepository(Template)
    repository: Repository<Template>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async onApplicationBootstrap(): Promise<void> {
    if (isMainThread) {
      await this.upsert(TEMPLATES_MOCK, ['id']);
      await this.synchronise();
    }
  }

  async save(entities: Template[], options?: any): Promise<Template[]> {
    const templates = await super.save(entities, options);
    templates.forEach((template) => this.map.set(template.id, template));
    return templates;
  }

  async synchronise() {
    const templates = await this.find();
    const titles = templates.map((template) =>
      new this.bot.title(template.title, 10).toText(),
    );

    const apiPages: ApiPage[] = [];

    for await (const json of this.bot.continuedQueryGen({
      action: 'query',
      titles,
      prop: 'linkshere',
      lhshow: 'redirect',
      lhlimit: 'max',
      lhnamespace: 10,
    })) {
      apiPages.push(...json.query['pages']);
    }

    templates.forEach((template, index) => {
      const { title, pageid } = apiPages[index];

      if (!title.toLowerCase().includes(template.title.toLowerCase())) {
        throw new Error(); // TODO: error
      }

      template.pageId = pageid;
      template.aliases = apiPages[index]['linkshere'].map((link: ApiPage) =>
        link.title.split(':', 2)[1].toLowerCase(),
      );
    });

    await this.save(templates);

    const regexp = [...templates.values()]
      .map((template) => template.regexp.source)
      .join('|');

    this.regexp = new RegExp(regexp, 'i');
    this.logger.debug('Template regexp: %s', this.regexp);

    this.logger.log(
      '%d templates has been successfully synchronised',
      templates.length,
    );
  }

  getRegExp() {
    return this.regexp;
  }
}
