import { ConfigurableModuleOptionsFactory } from '@nestjs/common';
import type { IpcModuleOptions } from 'nest-ipc/lib/ipc.module-definition';

export class IpcConfigService
  implements ConfigurableModuleOptionsFactory<IpcModuleOptions, 'create'>
{
  create() {
    return {
      id: 'webarchiver',
    };
  }
}
