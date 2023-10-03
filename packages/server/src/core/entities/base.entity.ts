import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  readonly createdAt: Date;
  @UpdateDateColumn()
  readonly updatedAt: Date;
  @DeleteDateColumn()
  readonly deletedAt: Date;
}
