import { ActiveTemplate } from '../../archiver/classes/active-template.class';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('sources')
export class Source extends BaseEntity {
  @Column('varchar')
  url: string;
  @Column('varchar')
  templateBefore: ActiveTemplate['wikitext'];
}
