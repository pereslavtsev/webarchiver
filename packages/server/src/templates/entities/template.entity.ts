import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('templates')
export class Template extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar')
  title: string;
  @Column({ type: 'varchar', array: true, default: [] })
  aliases: string[];
}
