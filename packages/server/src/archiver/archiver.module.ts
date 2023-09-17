import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from '../app.controller';
import { IpcService, NestIpcServer, OnIpcInit } from 'nest-ipc';
import { CoreModule } from '../core/core.module';
import { ArchiverService } from './archiver.service';
import { SourcesModule } from '../sources/sources.module';
import { MementoModule } from '../memento/memento.module';
import { WatchersModule } from '../watchers/watchers.module';
import { PagesModule } from '../pages/pages.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { LoggerMiddleware } from '../core/middlewares/logger.middleware';

@Module({
  imports: [
    CoreModule,
    SourcesModule,
    MementoModule,
    WatchersModule,
    PagesModule,
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [ArchiverService],
})
export class ArchiverModule implements OnIpcInit, NestModule {
  private readonly logger = new Logger();

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  constructor(private readonly ipcService: IpcService) {}

  onIpcInit(server: NestIpcServer): any {
    // console.log('IPC server started');
    // setTimeout(() => {
    //   server.broadcast('message', '3232323');
    // }, 3000);
  }

  onModuleInit(): any {
    // console.log('boor222');
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
