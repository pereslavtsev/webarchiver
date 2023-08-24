import { Inject, Injectable } from '@nestjs/common';
import botConfig from '../bot/config/bot.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class SourcesService {
  // constructor(
  //   @Inject(botConfig.KEY)
  //   private config: ConfigType<typeof botConfig>,
  // ) {}

  find() {}
}
