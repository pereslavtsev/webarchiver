import { Column, Entity, Generated, OneToMany } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { Source } from '../../sources/entities/source.entity';

@Entity('pages')
export class Page extends BaseEntity {
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
  @OneToMany(() => Source, (source) => source.page, { cascade: true })
  readonly sources: Source[];
}
