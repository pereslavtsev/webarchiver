import { Injectable } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import path from 'path';

@Injectable()
export class GrpcConfigService {
  createGrpcOptions(): GrpcOptions | Promise<GrpcOptions> {
    return {
      transport: Transport.GRPC,
      options: {
        package: 'webarchiver',
        protoPath: path.join(__dirname, '../../archiver/archiver.proto'),
      },
    };
  }
}
