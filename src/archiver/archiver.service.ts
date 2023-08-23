import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { mwn } from 'mwn';
import botConfig from '../core/config/bot.config';
import { ConfigType } from '@nestjs/config';
import PQueue from 'p-queue';

@Injectable()
export class ArchiverService implements OnApplicationBootstrap {
  protected readonly queue = new PQueue({ concurrency: 1, autoStart: false });

  constructor(
    @Inject(botConfig.KEY)
    private config: ConfigType<typeof botConfig>,
  ) {
    this.queue.on('idle', () => console.log('idle'));
  }

  async onApplicationBootstrap(): Promise<any> {
    const { username, password } = this.config;
    const bot = new mwn({
      apiUrl: 'https://ru.wikipedia.org/w/api.php',
      username,
      password,
    });
    await bot.login();
    const page = await bot.read('Геноцид в Камбодже');
    const wkt = new bot.wikitext(page.revisions[0].content);
    const templates = wkt.parseTemplates({
      templatePredicate: (template) => {
        const { name } = template;
        const archiveUrl = template.getParam('archive-url') ?? template.getParam('archiveurl');
        if (['cite web'].includes(String(name).toLowerCase()) && !archiveUrl) {
          return true;
        } else {
          return false;
        }
      },
    });
    console.log('templates', templates[0]);
    templates[0].addParam('archive-url', 'test', 'test')
    console.log('templates', templates[0]);
    this.queue.start();
  }
}
