import { Snapshot } from './snapshot.class';
import { Type } from 'class-transformer';

export class ArchivedSnapshots {
  @Type(() => Snapshot)
  readonly closest: Snapshot;
}
