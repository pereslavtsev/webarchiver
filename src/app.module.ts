import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppService } from './app.service';
import { AppCommand } from './app.command';
import { IpcModule, IpcService } from 'nest-ipc';
import { AppController } from './app.controller';
import { ArchiverModule } from './archiver/archiver.module';
import * as process from 'process';
import { firstValueFrom } from 'rxjs';
import ipc from 'node-ipc';
import { ClientsModule, MessagePattern } from '@nestjs/microservices';
import { UiController } from './ui.controller';
import { CoreModule } from './core/core.module';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Module({
  imports: [CoreModule],
  controllers: [UiController],
  providers: [AppCommand],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger();

  constructor(private readonly ipcService: IpcService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.ipcService.connect();
    ipc.of[this.ipcService['id']].on('message', (x) => { console.log('data', x) });
  }

  async onModuleInit(): Promise<any> {
    // this.logger.verbose('boot');

    setTimeout(async () => {
      // while (true) {
      //   this.ipcService.emit('message', 'hello222');
      //   // await sleep(1);
      // }
      this.ipcService
        .send('message', 'hello222')
        .subscribe((response) => console.log('u', response));
    }, 500);
  }
}
