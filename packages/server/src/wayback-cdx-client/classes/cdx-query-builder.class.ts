import { CdxSearchQueryBuilder } from './cdx-search-query-builder.class';
import { BaseCdxQueryBuilder } from './base-cdx-query-builder.class';
import type { Axios } from 'axios';

export class CdxQueryBuilder extends BaseCdxQueryBuilder {
  constructor(httpClient: Axios) {
    super(httpClient);
  }

  search(url: string) {
    return new CdxSearchQueryBuilder(this.httpClient, url);
  }
}
