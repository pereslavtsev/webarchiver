import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import databaseConfig from '../config/database.config';
import { ConfigType } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly config: ConfigType<typeof databaseConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { url } = this.config;

    return {
      type: 'postgres',
      url,
      namingStrategy: new SnakeNamingStrategy(),
      // logging: true,
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
