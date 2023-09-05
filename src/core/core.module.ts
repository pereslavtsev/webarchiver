import { Module } from '@nestjs/common';
import { IpcModule } from 'nest-ipc';
import { IpcConfigService } from './services/ipc-config.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './services/type-orm-config.service';
import databaseConfig from './config/database.config';
import { ModuleMetadata } from '@nestjs/common';
import process from 'process';
import { isMainThread } from 'worker_threads';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { BullConfigService } from './services/bull-config.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusConfigService } from './services/prometheus-config.service';

const metadata: ModuleMetadata = {
  imports: [ConfigModule.forRoot()],
  exports: [],
};

if (process.send === undefined) {
  metadata.imports.push(
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
  );
}

if (isMainThread) {
  metadata.imports.push(
    IpcModule.registerAsync({ useClass: IpcConfigService }),
  );
  metadata.exports.push(IpcModule);

  if (process.send === undefined) {
    metadata.imports.push(
      PrometheusModule.registerAsync({
        useClass: PrometheusConfigService,
      }),
      EventEmitterModule.forRoot(),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule.forFeature(databaseConfig)],
        useClass: TypeOrmConfigService,
      }),
    );
    metadata.exports.push(TypeOrmModule);
  }
}

@Module(metadata)
export class CoreModule {}
