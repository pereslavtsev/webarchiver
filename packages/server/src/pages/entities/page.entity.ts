import { Column, Entity, Generated, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { Source } from '../../sources/entities/source.entity';
import { PageEvent } from '../enums/page-event.enum';
import { webarchiver } from '../../__generated__';

@Entity('pages')
export class Page extends BaseEntity implements webarchiver.v1.Page {
  static readonly Event = PageEvent;

  @Column('int4', { unique: true })
  pageId: number;
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
  @OneToMany(() => Source, (source) => source.page, { cascade: ['insert'] })
  readonly sources: Relation<Source>[];
}
