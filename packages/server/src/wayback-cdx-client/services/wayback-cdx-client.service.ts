import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { formatObject } from '../../utils';
import terminalLink from 'terminal-link';
import { plainToInstance } from 'class-transformer';
import { cfxToObj } from '../cdx.utils';
import { SearchResult } from '../classes/search-result.class';

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
          params ? formatObject(params) : {},
          terminalLink('link', fullUrl.toString()),
        );
      }
    }

    return config;
  }

  async search() {
    const { data } = await this.httpService.axiosRef.get('search/cdx', {
      params: {
        url: 'rutracker.org',
        output: 'json',
      },
    });
    return plainToInstance(SearchResult, data);
  }

  async onApplicationBootstrap(): Promise<any> {
    const response = await this.search();
    console.log('response', response);
  }
}
