import { Inject, Injectable } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import path from 'path';
import grpcConfig from '../config/grpc.config';
import { ConfigType } from '@nestjs/config';
import fg from 'fast-glob';

@Injectable()
export class GrpcConfigService {
  constructor(
    @Inject(grpcConfig.KEY)
    private readonly config: ConfigType<typeof grpcConfig>,
  ) {}

  async createGrpcOptions(): Promise<GrpcOptions> {
    const { port } = this.config;

    const files = await fg('**/*.proto', {
      cwd: path.join(__dirname, '..', '..'),
    });
    const protoPaths = files.map((file) =>
      path.join(__dirname, '..', '..', file),
    );

    return {
      transport: Transport.GRPC,
      options: {
        package: 'webarchiver.v1',
        protoPath: protoPaths,
        url: `0.0.0.0:${port}`,
      },
    };
  }
}
