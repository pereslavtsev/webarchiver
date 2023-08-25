import { Controller } from '@nestjs/common';
import { NestIpcServer, OnIpcInit, SubscribeIpcMessage } from 'nest-ipc';
import { Payload } from '@nestjs/microservices';
import process from 'process';
import { WatchersService } from '../services/watchers.service';

@Controller()
export class WatchersController implements OnIpcInit {
  constructor(private readonly watchersService: WatchersService) {}

  protected server: NestIpcServer;

  @SubscribeIpcMessage('get_watchers')
  async handleGetWatchersMessage(@Payload() data: string) {
    console.log(545454, data, process.pid);
    const watchers = await this.watchersService.find({ take: 10 });
    this.server.broadcast('get_watchers', watchers);
  }

  onIpcInit(server: NestIpcServer): void {
    this.server = server;
  }
}
