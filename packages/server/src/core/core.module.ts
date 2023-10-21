import { Global, Module } from '@nestjs/common';
import { IpcModule } from 'nest-ipc';
import { IpcConfigService } from './services/ipc-config.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './services/type-orm-config.service';
import databaseConfig from './config/database.config';
import grpcConfig from './config/grpc.config';
import { ModuleMetadata } from '@nestjs/common';
import { isMainThread } from 'worker_threads';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { BullConfigService } from './services/bull-config.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusConfigService } from './services/prometheus-config.service';
import { GrpcConfigService } from './services/grpc-config.service';
import { LoggerModule } from 'nestjs-pino';
import {
  isMainProcess,
  isProduction,
  prettyOptions,
  processName,
} from '../consts';
import { TypeOrmLoggerService } from './services/type-orm-logger.service';

const metadata: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot({ envFilePath: '../../.env' }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: processName,
        level: !isProduction ? 'info' : 'info',
        transport: !isProduction
          ? { target: 'pino-pretty', options: prettyOptions }
          : undefined,
      },
    }),
  ],
  providers: [],
  exports: [LoggerModule],
};

if (isMainProcess) {
  metadata.imports.push(
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
  );
  metadata.providers.push(TypeOrmLoggerService);
}

if (isMainThread) {
  metadata.imports.push(
    IpcModule.registerAsync({ useClass: IpcConfigService }),
  );
  metadata.exports.push(IpcModule);

  if (isMainProcess) {
    metadata.imports.push(
      ConfigModule.forFeature(grpcConfig),
      PrometheusModule.registerAsync({
        useClass: PrometheusConfigService,
      }),
      EventEmitterModule.forRoot(),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule.forFeature(databaseConfig)],
        extraProviders: [TypeOrmLoggerService],
        useClass: TypeOrmConfigService,
      }),
    );
    metadata.providers.push(GrpcConfigService);
    metadata.exports.push(PrometheusModule, TypeOrmModule);
  }
}

@Global()
@Module(metadata)
export class CoreModule {}
