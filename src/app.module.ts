import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppCommand } from './app.command';
import { IpcModule, IpcService } from 'nest-ipc';
import { AppController } from './app.controller';
import { ArchiverModule } from './archiver/archiver.module';
import * as process from 'process';

@Module({
  imports: [IpcModule.register({ id: 'webarchiver' })],
  // controllers: [AppController],
  providers: [AppCommand],
})
export class AppModule {
  private readonly logger = new Logger();

  constructor(private readonly ipcService: IpcService) {}

  onModuleInit(): any {
    this.logger.verbose('boot');
    setTimeout(() => {
      this.logger.verbose('123');
      this.ipcService.emit('message', 'hello');
    }, 500);
  }
}
