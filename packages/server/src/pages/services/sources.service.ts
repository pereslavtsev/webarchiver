import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Source } from '../entities/source.entity';

@Injectable()
export class SourcesService extends Repository<Source> {
  constructor(
    @InjectRepository(Source)
    repository: Repository<Source>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // async findByPage(title: string) {
  //   const page = await this.bot.read(title);
  //   const wkt = new this.bot.wikitext(page.revisions[0].content);
  //   const templates = wkt
  //     .parseTemplates({
  //       namePredicate: (name) =>
  //         ['cite web'].includes(String(name).toLowerCase()),
  //     })
  //     .map((template) => {
  //       switch (String(template.name).toLowerCase()) {
  //         case 'cite web': {
  //           return new CiteWebTemplate(template);
  //         }
  //         default: {
  //           return new ActiveTemplate(template);
  //         }
  //       }
  //     });
  // }
}
