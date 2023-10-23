import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('cdx', () => ({
  authToken: process.env.CDX_AUTH_TOKEN,
}));
