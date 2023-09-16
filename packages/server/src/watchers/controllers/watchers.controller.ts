import { Controller } from '@nestjs/common';
import { NestIpcServer, OnIpcInit, SubscribeIpcMessage } from 'nest-ipc';
import { Payload } from '@nestjs/microservices';
import process from 'process';
import { WatchersService } from '../services/watchers.service';
import { webarchiver } from '../../__generated__';
import { Metadata } from '@grpc/grpc-js';

const { WatchersServiceControllerMethods } = webarchiver.v1;

@Controller()
@WatchersServiceControllerMethods()
export class WatchersController
  implements OnIpcInit, webarchiver.v1.WatchersServiceController
{
  constructor(private readonly watchersService: WatchersService) {}

  protected server: NestIpcServer;

  @SubscribeIpcMessage('get_watchers')
  async handleGetWatchersMessage(@Payload() data: string) {
    console.log(545454, data, process.pid);
    const watchers = await this.watchersService.find({ take: 10 });
    this.server.broadcast('get_watchers', watchers);
  }

  async listWatchers(
    request: webarchiver.v1.ListWatchersRequest,
    metadata?: Metadata,
  ): Promise<webarchiver.v1.ListWatchersResponse> {
    const { offset, limit } = request;
    const [watchers, totalWatchersCount] =
      await this.watchersService.findAndCount({
        take: limit,
        skip: offset,
      });
    return { data: watchers };
  }

  getWatcher(
    request: webarchiver.v1.GetWatcherRequest,
    metadata?: Metadata,
  ): Promise<webarchiver.v1.Watcher> {
    const { id } = request;
    return this.watchersService.findOneOrFail({ where: { id } });
  }

  onIpcInit(server: NestIpcServer): void {
    this.server = server;
  }
}
