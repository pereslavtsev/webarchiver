import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { fork } from 'child_process';
import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { IpcServer } from 'nest-ipc';
import { ArchiverModule } from './archiver/archiver.module';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function bootstrap() {
  if (process.send === undefined) {
    console.log('started directly');
    const childProcess = fork(__filename); // Создаем форкнутый процесс за пределами блока if
    process.on('exit', () => {
      childProcess.kill();
    });
    const app = await NestFactory.create(ArchiverModule);
    app.connectMicroservice<MicroserviceOptions>({
      strategy: app.get(IpcServer),
    });
    await app.startAllMicroservices();
    await app.listen(5000);
  } else {
    console.log('started from fork()', process.pid);
    await CommandFactory.run(AppModule, ['warn', 'error', 'log', 'verbose']);
  }
}

bootstrap();
