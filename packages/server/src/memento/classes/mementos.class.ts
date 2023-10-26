import { Memento } from './memento.classs';
import { Type } from 'class-transformer';

export class Mementos {
  @Type(() => Memento)
  last: Memento;
  @Type(() => Memento)
  next: Memento;
  @Type(() => Memento)
  closest: Memento;
  @Type(() => Memento)
  first: Memento;
  @Type(() => Memento)
  prev: Memento;
}
