import { registerAs } from '@nestjs/config';

export default registerAs('bot', () => ({
  apiUrl: process.env.MW_API_URL,
  username: process.env.BOT_USERNAME,
  password: process.env.BOT_PASSWORD,
}));
