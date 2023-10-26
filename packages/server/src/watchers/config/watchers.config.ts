import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('watchers', () => ({
  autorun:
    process.env.AUTORUN_WATCHERS !== undefined
      ? !!JSON.parse(process.env.AUTORUN_WATCHERS)
      : false,
}));
