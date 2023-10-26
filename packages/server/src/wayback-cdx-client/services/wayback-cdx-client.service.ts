import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { formatObject } from '../../utils';
import terminalLink from 'terminal-link';
import { plainToInstance } from 'class-transformer';
import { cfxToObj } from '../utils/cdx.utils';
import { SearchResult } from '../classes/search-result.class';
import { CdxQueryBuilder } from '../classes/cdx-query-builder.class';

@Injectable()
export class WaybackCdxClientService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WaybackCdxClientService.name);

  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(
      this.handleHttpRequest.bind(this),
    );
    this.httpService.axiosRef.interceptors.response.use(
      this.handleHttpResponse.bind(this),
    );
  }

  private handleHttpResponse(response: AxiosResponse) {
    if (response.headers['content-type'].includes('application/json')) {
      response.data = cfxToObj(response.data);
    }
    return response;
  }

  private handleHttpRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const { baseURL, url, params, method } = config;

    const fullUrl = new URL(url + '?' + new URLSearchParams(params), baseURL);

    switch (method) {
      case 'GET':
      case 'get': {
        this.logger.debug(
          `Wayback CDX API Request: %s %s`,
          params ? formatObject(params) : '{}',
          terminalLink('link', fullUrl.toString()),
        );
      }
    }

    return config;
  }

  createQueryBuilder() {
    return new CdxQueryBuilder(this.httpService.axiosRef);
  }

  async search(url: string, options: any) {
    const { fieldOrder } = options;

    const params = { url, output: 'json' };

    if (fieldOrder) {
      params['fl'] = fieldOrder;
    }

    const queryBuilder = this.createQueryBuilder().search(url);

    queryBuilder.where('statuscode', '200');

    return queryBuilder.getResults();
  }

  async onApplicationBootstrap(): Promise<any> {
    const response = await this.search('rutracker.org', {});
    console.log('response', response[0]);
  }
}
