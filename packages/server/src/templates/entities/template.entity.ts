import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import type { ApiPage } from 'mwn';

@Entity('templates')
export class Template extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar')
  title: string;
  // Sync
  @Column({ type: 'int4', nullable: true })
  pageId: ApiPage['pageid'];
  @Column({ type: 'varchar', array: true, default: [] })
  aliases: Array<ApiPage['title']>;
}
