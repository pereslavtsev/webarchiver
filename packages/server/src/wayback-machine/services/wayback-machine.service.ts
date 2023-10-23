import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GetSnapshotsResponseDto } from '../dto/get-snapshots-response.dto';
import type { AxiosRequestConfig } from 'axios';
import { formatObject } from '../../utils';
import terminalLink from 'terminal-link';
import { plainToInstance } from 'class-transformer';
import { Snapshot } from '../classes/snapshot.class';
import camelcaseKeys from 'camelcase-keys';

/**
 * This simple API for Wayback is a test to see if a given url is archived and currently accessible in the Wayback Machine.
 * This API is useful for providing a 404 or other error handler which checks Wayback to see if it has an archived copy ready to display.
 */
@Injectable()
export class WaybackMachineService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WaybackMachineService.name);

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
          `Wayback Machine API Request: %s %s`,
          params ? formatObject(params) : '{}',
          terminalLink('link', fullUrl.toString()),
        );
      }
    }

    return config;
  }

  async getSnapshots(
    url: string,
    timestamp?: Date | string | number,
  ): Promise<GetSnapshotsResponseDto> {
    const params = { url };

    if (timestamp) {
      params['timestamp'] = Snapshot.formatDate(timestamp);
    }

    const { data } = await this.httpService.axiosRef.get('available', {
      params,
    });
    return plainToInstance(GetSnapshotsResponseDto, camelcaseKeys(data));
  }

  async onApplicationBootstrap(): Promise<any> {
    // const {
    //   archivedSnapshots: { closest },
    // } = await this.getSnapshots(
    //   'example.com',
    //   new Date('2006-01-01').setUTCHours(0),
    // );
    // console.log('closest', closest);
  }
}
