import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import cdxConfig from '../config/cdx.config';

@Injectable()
export class WaybackCdxClientConfigService implements HttpModuleOptionsFactory {
  constructor(
    @Inject(cdxConfig.KEY)
    private readonly config: ConfigType<typeof cdxConfig>,
  ) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: 'https://web.archive.org/cdx',
      headers: {
        Cookie: this.config.authToken
          ? `cdx-auth-token=${this.config.authToken}`
          : '',
      },
    };
  }
}
