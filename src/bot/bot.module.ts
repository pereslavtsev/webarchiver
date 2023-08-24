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

@Module({
  imports: [ConfigModule.forFeature(botConfig)],
  providers: [
    {
      provide: BotConfigService,
      useClass: BotConfigService,
    },
    {
      provide: 'MWN_INSTANCE',
      inject: [BotConfigService],
      useFactory: async (botConfigService: BotConfigService) => {
        const options = await botConfigService.createMwnOptions();
        return new mwn(options);
      },
    },
  ],
  exports: ['MWN_INSTANCE'],
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
