import { Logger, Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import {IpcModule, IpcService, NestIpcServer, OnIpcInit} from 'nest-ipc';

@Module({
  imports: [IpcModule.register({ id: 'webarchiver' })],
  controllers: [AppController],
})
export class ArchiverModule implements OnIpcInit {
  private readonly logger = new Logger();

  constructor(private readonly ipcService: IpcService) {}

  onIpcInit(server: NestIpcServer): any {
    // console.log('IPC server started');
    setTimeout(() => {
      server.broadcast('message', '3232323');
    }, 3000);

  }

  onModuleInit(): any {

    console.log('boor222')
    setTimeout(async () => {
      // while (true) {
      //   this.ipcService.emit('message', 'hello222');
      //   // await sleep(1);
      // }
      // this.logger.debug('send message from server');
      //
      // this.ipcService.emit('message', '333333');
    }, 1000);
  }
}
