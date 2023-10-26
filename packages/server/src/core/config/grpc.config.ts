import { registerAs } from '@nestjs/config';

export default registerAs('grpc', () => ({
  enabled: true,
  port: 50051,
}));
