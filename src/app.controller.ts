import {Controller, OnModuleInit} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  NestIpcServer,
  OnIpcDisconnect,
  OnIpcInit,
  SubscribeIpcMessage,
} from 'nest-ipc';
import { Socket } from 'net';

@Controller()
export class AppController {

  @SubscribeIpcMessage('message')
  handleWorldMessage(@Payload() data: string) {
    console.log(55555, data);
  }

  onIpcDisconnect(socket: Socket): void {
    console.log('IPC client disconnected');
  }

  onIpcInit(server: NestIpcServer): any {
    console.log('IPC server started');
    server.broadcast('message', 'server started');
  }
}
