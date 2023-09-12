import { registerAs } from '@nestjs/config';

export default registerAs('watchers', () => ({
  autorun:
    process.env.AUTORUN_WATCHERS !== undefined
      ? !!JSON.parse(process.env.AUTORUN_WATCHERS)
      : false,
}));
