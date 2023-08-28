import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { Page } from '../../pages/entities/page.entity';

@Entity('sources')
export class Source extends BaseEntity {
  @Index()
  @Column('varchar')
  url: string;
  @Column('date')
  accessDate: Date;
  @Column('varchar', { nullable: true })
  archiveUrl: string = null;
  @Column('date', { nullable: true })
  archiveDate: Date = null;
  @Column('varchar')
  wikitextBefore: ActiveTemplate['wikitext'];
  @Column('int4')
  pageId: Page['id'];
  @ManyToOne(() => Page, (page) => page.sources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page: Page;
}
