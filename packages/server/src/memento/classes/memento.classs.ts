import { Type } from 'class-transformer';

export class Memento {
  @Type(() => Date)
  readonly datetime: Date;
  readonly uri: string[];
}
