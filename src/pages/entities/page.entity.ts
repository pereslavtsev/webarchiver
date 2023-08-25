import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('pages')
export class Page extends BaseEntity {
  @Column('bigint', { unique: true })
  pageId: number;
  @Column('int2')
  namespace: number;
  @Column('varchar')
  title: string;
  @Column('boolean')
  redirect: boolean;
}
