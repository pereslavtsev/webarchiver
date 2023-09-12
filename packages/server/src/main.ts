import { AppModule } from './app.module';
import { fork } from 'child_process';
import process from 'process';
import { NestFactory } from '@nestjs/core';
import {
  GrpcOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { IpcServer } from 'nest-ipc';
import { ArchiverModule } from './archiver/archiver.module';
import { isMainThread, threadId, workerData } from 'worker_threads';
import { WatchersModule } from './watchers/watchers.module';
import { CrawlerModule } from './crawler/crawler.module';
import * as path from 'path';

async function bootstrap() {
  if (process.send === undefined) {
    console.log('started directly');
    if (isMainThread) {
      const childProcess = fork(__filename); // Создаем форкнутый процесс за пределами блока if
      process.once('exit', () => childProcess.kill());
      const app = await NestFactory.create(ArchiverModule);
      app.connectMicroservice<MicroserviceOptions>({
        strategy: app.get(IpcServer),
      });
      app.connectMicroservice<GrpcOptions>({
        options: {
          package: 'webarchiver',
          protoPath: path.join(__dirname, 'archiver/archiver.proto'),
        },
        transport: Transport.GRPC,
      });
      app.enableShutdownHooks();
      await app.startAllMicroservices();
      await app.listen(50051);
    } else {
      console.log('started thread', { workerData, threadId });
      const { type } = workerData;
      switch (type) {
        case 'watcher': {
          await NestFactory.createApplicationContext(WatchersModule);
          break;
        }
        case 'crawler': {
          await NestFactory.createApplicationContext(CrawlerModule);
          break;
        }
      }
    }
  } else {
    const app = await NestFactory.create(AppModule);
    await app.listen(5001);
    // await CommandFactory.run(AppModule, ['warn', 'error']);
  }
}

bootstrap();
