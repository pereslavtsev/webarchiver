import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { webarchiver } from '../../__generated__';
import { Page } from './page.entity';

@Entity('page-history')
export class PageHistory
  extends BaseEntity
  implements webarchiver.v1.PageHistory
{
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('timestamptz', { nullable: true })
  scannedAt: Date;
  @Column('varchar', { nullable: true })
  failure: string;

  @Column('int4')
  pageId: Page['id'];
  @ManyToOne(() => Page, (page) => page.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  page: Relation<Page>;
}
