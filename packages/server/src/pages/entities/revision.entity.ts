import { BaseEntity } from '../../core/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { Page } from './page.entity';
import { ApiRevision } from 'mwn';
import { Source } from './source.entity';

@Entity('revisions')
export class Revision extends BaseEntity {
  @PrimaryColumn('int4')
  id: number;
  @Column('int4')
  pageId: Page['id'];
  @Column('int4')
  parentId: Revision['id'];
  @Column({ type: 'timestamptz', comment: 'The timestamp of the revision.' })
  timestamp: Date;
  @Column('timestamptz', { nullable: true })
  scannedAt: Date;
  @ManyToOne(() => Page, (page) => page.revisions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  page: Relation<Page>;

  @OneToMany(() => Source, (source) => source.revision, { cascade: true })
  sources: Source[];

  static makeFromApiResponse(apiRevision: ApiRevision): Revision {
    const revision = new Revision();
    revision.id = apiRevision.revid;
    revision.parentId = apiRevision.parentid;
    revision.timestamp = new Date(apiRevision.timestamp);
    return revision;
  }
}
