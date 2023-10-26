import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Source } from '../entities/source.entity';

@Injectable()
export class SourcesService extends Repository<Source> {
  constructor(
    @InjectRepository(Source)
    repository: Repository<Source>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findArchivedById(sourceId: Source['id']): Promise<Source[]> {
    const source = await this.findOneOrFail({ where: { id: sourceId } });
    return this.find({ where: { url: source.url, archiveUrl: Not(IsNull()) } });
  }
}
