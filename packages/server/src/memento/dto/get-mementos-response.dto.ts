import { Mementos } from '../classes/mementos.class';
import { Type } from 'class-transformer';
import { TimemapUri } from '../classes/timemap-uri.class';

export class GetMementosResponseDto {
  readonly originalUri: string;
  @Type(() => Mementos)
  readonly mementos: Mementos;
  timegateUri: string;
  @Type(() => TimemapUri)
  timemapUri: TimemapUri;
}
