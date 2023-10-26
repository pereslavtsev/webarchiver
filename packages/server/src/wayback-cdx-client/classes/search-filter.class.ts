import { FieldType } from '../types';

export class SearchFilter {
  constructor(
    readonly field: FieldType,
    readonly value: string,
  ) {}

  toString() {
    return `${this.field}:${this.value}`;
  }
}
