import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { IpcModule } from 'nest-ipc';

@Module({
  imports: [IpcModule.register({ id: 'webarchiver' })],
  controllers: [AppController],
})
export class ArchiverModule {}
