import { Logger, Module } from '@nestjs/common';
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

const metadata: ModuleMetadata = {
  imports: [ConfigModule.forRoot()],
  exports: [],
};

if (isMainThread) {
  metadata.imports.push(
    IpcModule.registerAsync({ useClass: IpcConfigService }),
  );
  metadata.exports.push(IpcModule);

  if (process.send === undefined) {
    metadata.imports.push(
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
