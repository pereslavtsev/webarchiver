import type { Axios } from 'axios';

export abstract class BaseCdxQueryBuilder {
  protected constructor(protected readonly httpClient: Axios) {}
}
