import { Module } from '@nestjs/common';
import { IpcModule } from 'nest-ipc';
import { IpcConfigService } from './services/ipc-config.service';
import { ConfigModule } from '@nestjs/config';
import botConfig from '../bot/config/bot.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [botConfig],
    }),
    IpcModule.registerAsync({ useClass: IpcConfigService }),
  ],
  exports: [IpcModule],
})
export class CoreModule {}
