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
import { CiteWebTemplate } from '../../archiver/templates/cite-web.template';

@Entity('sources')
export class Source extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Index()
  @Column('varchar')
  url: URL;
  @Column('timestamptz')
  preferredAt: Date;
  @Column('date', { nullable: true })
  accessDate: Date;
  @Column('varchar', { nullable: true })
  archiveUrl: string = null;
  @Column('date', { nullable: true })
  archiveDate: Date = null;
  @Column('varchar')
  wikitextBefore: CiteWebTemplate['wikitext'];
  @Column('int4')
  revisionId: Revision['id'];
  @ManyToOne(() => Revision, (revision) => revision.sources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'revision_id' })
  revision: Relation<Revision>;
}
