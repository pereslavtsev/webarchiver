import { registerAs } from '@nestjs/config';

export default registerAs('matcher', () => ({
  enabled: false,
}));
