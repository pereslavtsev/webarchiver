import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WaybackCdxClientConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: 'https://web.archive.org/cdx',
    };
  }
}
