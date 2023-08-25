import {
  BeforeApplicationShutdown,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { BotConfigService } from './services/bot-config.service';
import { mwn } from 'mwn';
import { ConfigModule } from '@nestjs/config';
import botConfig from './config/bot.config';
import { InjectBot } from './decorators/inject-bot.decorator';
import { BotService } from './services/bot.service';

@Module({
  imports: [ConfigModule.forFeature(botConfig)],
  providers: [
    BotService,
    BotConfigService,
    {
      provide: 'MWN_INSTANCE',
      inject: [BotConfigService],
      useFactory: async (botConfigService: BotConfigService) => {
        const options = await botConfigService.createMwnOptions();
        return new mwn(options);
      },
    },
  ],
  exports: ['MWN_INSTANCE', BotService],
})
export class BotModule implements OnModuleInit, BeforeApplicationShutdown {
  constructor(
    @InjectBot()
    private readonly bot: mwn,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.bot.login();
  }

  async beforeApplicationShutdown(): Promise<void> {
    await this.bot.logout();
  }
}
