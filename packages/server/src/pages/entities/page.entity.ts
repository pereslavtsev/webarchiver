import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
  VirtualColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { PageEvent } from '../enums/page-event.enum';
import { webarchiver } from '../../__generated__';
import { Revision } from './revision.entity';
import { PageHistory } from './page-history.entity';

@Entity('pages')
export class Page extends BaseEntity implements webarchiver.v1.Page {
  static readonly Event = PageEvent;
  static readonly Status = webarchiver.v1.PageStatus;

  @PrimaryColumn('int4', { primaryKeyConstraintName: 'page_id_pkey' })
  id: number;
  @Column('int2')
  namespace: number;
  @Column('varchar')
  title: string;
  @Column('boolean')
  redirect: boolean;
  @Column('int4')
  @Generated('increment')
  priority: number;
  @Column('enum', {
    enum: Page.Status,
    default: Page.Status.PENDING,
  })
  status: webarchiver.v1.PageStatus;
  @OneToMany(() => PageHistory, (pageHistory) => pageHistory.page, {
    cascade: ['insert', 'update'],
  })
  readonly history: Relation<PageHistory>[];
  @OneToMany(() => Revision, (revision) => revision.page)
  readonly revisions: Relation<Revision>[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT id FROM "revisions" WHERE "page_id" = ${alias}.id ORDER BY "timestamp" DESC LIMIT 1`,
  })
  latestRevisionId: Revision['id'];
}
