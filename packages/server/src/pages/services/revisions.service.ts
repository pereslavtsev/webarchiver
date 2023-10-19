import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Revision } from '../entities/revision.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RevisionsService extends Repository<Revision> {
  constructor(
    @InjectRepository(Revision)
    repository: Repository<Revision>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
