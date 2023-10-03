import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
  Relation,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { Page } from '../../pages/entities/page.entity';

@Entity('sources')
@Unique(['url', 'pageId'])
export class Source extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Index()
  @Column('varchar')
  url: string;
  @Column('int4')
  revisionId: number;
  @Column('timestamptz')
  preferredAt: Date;
  @Column('date', { nullable: true })
  accessDate: Date;
  @Column('varchar', { nullable: true })
  archiveUrl: string = null;
  @Column('date', { nullable: true })
  archiveDate: Date = null;
  @Column('varchar')
  wikitextBefore: ActiveTemplate['wikitext'];
  @Column('int4')
  pageId: Page['id'];
  @ManyToOne(() => Page, (page) => page.sources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  page: Relation<Page>;
}
