import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { fork } from 'child_process';
import process from 'process';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { IpcServer } from 'nest-ipc';
import { ArchiverModule } from './archiver/archiver.module';

async function bootstrap() {
  if (process.send === undefined) {
    console.log('started directly');
    const childProcess = fork(__filename); // Создаем форкнутый процесс за пределами блока if
    process.once('exit', () => childProcess.kill());
    const app = await NestFactory.create(ArchiverModule, {  });
    app.connectMicroservice<MicroserviceOptions>({
      strategy: app.get(IpcServer),
    });
    await app.startAllMicroservices();
    await app.listen(5000);
  } else {
    const app = await NestFactory.create(AppModule);
    await app.listen(5001);
    // await CommandFactory.run(AppModule, ['warn', 'error', 'log', 'verbose']);
  }
}

bootstrap();
