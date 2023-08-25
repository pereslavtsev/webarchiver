import { Module } from '@nestjs/common';
import { IpcModule } from 'nest-ipc';
import { IpcConfigService } from './services/ipc-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    IpcModule.registerAsync({ useClass: IpcConfigService }),
  ],
  exports: [IpcModule],
})
export class CoreModule {}
