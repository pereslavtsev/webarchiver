import {
  BeforeApplicationShutdown,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { BotConfigService } from './services/bot-config.service';
import { ConfigModule } from '@nestjs/config';
import botConfig from './config/bot.config';
import { InjectBot } from './decorators/inject-bot.decorator';
import { BotService } from './services/bot.service';
import { Bot } from './classes/bot.class';
import { ActiveTemplatesService } from './services/active-templates.service';

@Module({
  imports: [ConfigModule.forFeature(botConfig)],
  providers: [
    BotService,
    BotConfigService,
    ActiveTemplatesService,
    {
      provide: 'MWN_INSTANCE',
      inject: [BotConfigService],
      useFactory: async (botConfigService: BotConfigService) => {
        const options = await botConfigService.createMwnOptions();
        return new Bot(options);
      },
    },
  ],
  exports: ['MWN_INSTANCE', BotService, ActiveTemplatesService],
})
export class BotModule implements OnModuleInit, BeforeApplicationShutdown {
  constructor(
    @InjectBot()
    private readonly bot: Bot,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.bot.login();
  }

  async beforeApplicationShutdown(): Promise<void> {
    await this.bot.logout();
  }
}
