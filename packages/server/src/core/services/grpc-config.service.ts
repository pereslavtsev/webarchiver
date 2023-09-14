import { Inject, Injectable } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import path from 'path';
import grpcConfig from '../config/grpc.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class GrpcConfigService {
  constructor(
    @Inject(grpcConfig.KEY)
    private readonly config: ConfigType<typeof grpcConfig>,
  ) {}

  createGrpcOptions(): GrpcOptions | Promise<GrpcOptions> {
    const { port } = this.config;
    return {
      transport: Transport.GRPC,
      options: {
        package: 'webarchiver',
        // protoPath: [],
        protoPath: path.join(__dirname, '../../archiver/archiver.proto'),
        url: `0.0.0.0:${port}`,
      },
    };
  }
}
