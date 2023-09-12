import { ApiParams, ApiQueryParams } from 'types-mediawiki/api_params';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('watchers')
export class Watcher extends BaseEntity {
  @Column({ unique: true })
  name: string;
  @Column('jsonb')
  params: ApiQueryParams | ApiParams | object;
  @Column('jsonb', { nullable: true })
  continue: object;
  @Column('timestamptz', { nullable: true })
  startedAt: Date;
  @Column('timestamptz', { nullable: true })
  interruptedAt: Date;
  @Column('int2', { nullable: true })
  exitCode: number;
}
