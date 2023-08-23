import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  IpcService,
  NestIpcServer,
  OnIpcDisconnect,
  OnIpcInit,
  SubscribeIpcMessage,
} from 'nest-ipc';
import { Socket } from 'net';
import * as process from "process";

@Controller()
export class AppController {
  private readonly logger = new Logger();

  constructor(private readonly ipcService: IpcService) {}

  @SubscribeIpcMessage('message')
  handleWorldMessage(@Payload() data: string) {
    console.log(11111, data, process.pid)
    this.logger.verbose('message', data);
    return 'heff';
  }

  onIpcDisconnect(socket: Socket): void {
    // console.log('IPC client disconnected');
  }

  onIpcInit(server: NestIpcServer): any {
    console.log('IPC client started');
    // server.broadcast('message', 'server started');
  }
}
