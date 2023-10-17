import { BaseEntity } from './entities/base.entity';

export type EntityMap<T extends BaseEntity> = Map<T['id'], T>;
