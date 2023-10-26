import type { Axios } from 'axios';
import { SearchResult } from './search-result.class';
import {
  Expose,
  instanceToPlain,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { BaseCdxQueryBuilder } from './base-cdx-query-builder.class';
import type { FieldType } from '../types';
import { SearchFilter } from './search-filter.class';

export class CdxSearchQueryBuilder extends BaseCdxQueryBuilder {
  @Expose()
  readonly url: string;

  constructor(httpClient: Axios, url: string) {
    super(httpClient);
    this.url = url;
  }

  /**
   * Output: output=json can be added to return results as JSON array.
   * The JSON output currently also includes a first line which indicates the cdx format.
   * @See https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server#output-format-json for more details.
   */
  @Expose()
  readonly output = 'json';
  /**
   * It is possible to customize the fields returned from the cdx server using the fl= param.
   * Simply pass in a comma separated list of fields and only those fields will be returned
   * @See https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server#field-order for more details.
   */
  @Expose({ name: 'fl' })
  fieldOrder?: FieldType[];

  // Date Range
  @Expose({ name: 'from' })
  private _from?: Date;
  @Expose({ name: 'to' })
  private _to?: Date;

  // private readonly options = new SearchOptionsDto(this.url);

  setFieldOrder(fieldTypes: FieldType[]) {
    this.fieldOrder = fieldTypes;
    return this;
  }

  from(timestamp: Date | number | string) {
    this._from = new Date(timestamp);
    return this;
  }

  to(timestamp: Date | number | string) {
    this._to = new Date(timestamp);
    return this;
  }

  @Transform(({ value }) => String(value), { toPlainOnly: true })
  @Expose({ name: 'filter' })
  private filters = [];

  where(field: FieldType, expression: string) {
    this.filters = [];
    return this.andWhere(field, expression);
  }

  andWhere(field: FieldType, expression: string) {
    this.filters.push(new SearchFilter(field, expression));
    return this;
  }

  take(limit: number, { fastLatest }: { fastLatest: boolean }) {
    this._limit = limit;
    if (fastLatest !== undefined) {
      this._fastLatest = fastLatest;
    }
    return this;
  }

  private _limit?: number;
  private _offset?: number;

  skip(offset: number) {
    this._offset = offset;
    return this;
  }

  private _fastLatest?: boolean;

  async getResults(): Promise<SearchResult[]> {
    const params = instanceToPlain(this, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    });
    const { data } = await this.httpClient.get('search/cdx', {
      params,
    });
    return plainToInstance(SearchResult, data) as unknown as SearchResult[];
  }
}
