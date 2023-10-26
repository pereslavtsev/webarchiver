import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { plainToInstance } from 'class-transformer';
import { GetMementosResponseDto } from '../dto/get-mementos-response.dto';
import camelcaseKeys from 'camelcase-keys';
import type { AxiosRequestConfig } from 'axios';
import { formatObject } from '../../utils';
import terminalLink from 'terminal-link';

@Injectable()
export class MementoService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MementoService.name);

  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(
      this.handleHttpRequest.bind(this),
    );
  }

  private handleHttpRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const { baseURL, url, params, method } = config;

    const fullUrl = new URL(url + '?' + new URLSearchParams(params), baseURL);

    switch (method) {
      case 'GET':
      case 'get': {
        this.logger.debug(
          `Memento API Request: %s %s`,
          params ? formatObject(params) : '{}',
          terminalLink('link', fullUrl.toString()),
        );
      }
    }

    return config;
  }

  async getMementos(
    uri: string,
    date: Date | string,
  ): Promise<GetMementosResponseDto> {
    const desired = '2013';
    const { data } = await this.httpService.axiosRef.get(
      `api/json/${desired}/${uri}`,
    );

    return plainToInstance(GetMementosResponseDto, camelcaseKeys(data));
  }

  async onApplicationBootstrap(): Promise<any> {
    // const response = await this.getMementos('https://cnn.com', '2013');
    // console.log('response', response);
  }
}
