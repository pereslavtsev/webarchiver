import { ArchivedSnapshots } from '../classes/archived-snapshots.class';
import { Type, Expose } from 'class-transformer';

export class GetSnapshotsResponseDto {
  readonly url: string;
  @Type(() => ArchivedSnapshots)
  @Expose({ name: 'archived_snapshots' })
  readonly archivedSnapshots: ArchivedSnapshots;
}
