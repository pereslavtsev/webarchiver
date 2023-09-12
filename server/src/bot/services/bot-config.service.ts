import { Inject, Injectable } from '@nestjs/common';
import type { MwnOptions } from 'mwn';
import botConfig from '../config/bot.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class BotConfigService {
  constructor(
    @Inject(botConfig.KEY)
    private readonly config: ConfigType<typeof botConfig>,
  ) {}

  async createMwnOptions(): Promise<MwnOptions> {
    const { apiUrl, username, password } = this.config;
    return {
      apiUrl,
      username,
      password,
      silent: true,
    };
  }
}
