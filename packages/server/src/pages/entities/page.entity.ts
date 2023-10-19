import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { PageEvent } from '../enums/page-event.enum';
import { webarchiver } from '../../__generated__';
import { Revision } from './revision.entity';

@Entity('pages')
export class Page extends BaseEntity implements webarchiver.v1.Page {
  static readonly Event = PageEvent;

  @PrimaryColumn('int4')
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
  @Column('timestamptz', { nullable: true })
  scannedAt: Date;
  @OneToMany(() => Revision, (revision) => revision.page, {
    cascade: ['insert'],
  })
  readonly revisions: Relation<Revision>[];
}
