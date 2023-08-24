import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { BotConfigService } from './services/bot-config.service';
import { mwn } from 'mwn';
import { ConfigModule } from '@nestjs/config';
import botConfig from './config/bot.config';

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
        const options = await botConfigService.create();
        return new mwn(options);
      },
    },
  ],
  exports: ['MWN_INSTANCE'],
})
export class BotModule implements OnApplicationBootstrap {
  constructor(
    @Inject('MWN_INSTANCE')
    private readonly bot: mwn,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    await this.bot.login();
  }
}
