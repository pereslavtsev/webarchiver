import { Injectable } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class WaybackMachineHttpConfigService
  implements HttpModuleOptionsFactory
{
  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: 'https://archive.org/wayback',
    };
  }
}
