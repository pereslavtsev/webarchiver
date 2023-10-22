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
import { webarchiver } from '../../__generated__';

@Entity('sources')
export class Source extends BaseEntity implements webarchiver.v1.Source {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'source_id_pkey',
  })
  id: number;
  @Index('source_url_idx')
  @Column('varchar')
  url: string;
  @Column('timestamptz')
  preferredAt: Date;
  @Column('date', { nullable: true })
  accessDate: Date;
  @Column('varchar', { nullable: true })
  @Index('source_archive_url_idx')
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
