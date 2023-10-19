import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  Relation,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { Revision } from './revision.entity';

@Entity('sources')
export class Source extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Index()
  @Column('varchar')
  url: string;
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
  revisionId: Revision['id'];
  @ManyToOne(() => Revision, (revision) => revision.sources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'revision_id' })
  revision: Relation<Revision>;
}
