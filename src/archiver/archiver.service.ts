import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { mwn } from 'mwn';
import botConfig from '../bot/config/bot.config';
import { ConfigType } from '@nestjs/config';
import PQueue from 'p-queue';
import { CiteWebTemplate } from './templates/cite-web.template';

@Injectable()
export class ArchiverService implements OnApplicationBootstrap {
  protected readonly queue = new PQueue({ concurrency: 1, autoStart: false });

  constructor(
    @Inject(botConfig.KEY)
    private config: ConfigType<typeof botConfig>,
  ) {
    this.queue.on('idle', () => console.log('idle'));
  }

  archive() {}

  async onApplicationBootstrap(): Promise<any> {
    return ;
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
        const archiveUrl =
          template.getParam('archive-url') ?? template.getParam('archiveurl');
        if (['cite web'].includes(String(name).toLowerCase()) && !archiveUrl) {
          return true;
        } else {
          return false;
        }
      },
    });
    const citeWeb = new CiteWebTemplate(templates[0]);
    citeWeb.accessDate = 'dsd';
    citeWeb.archiveUrl = 'http://test.test';
    // citeWeb.addParam('archive-url', 'test', 'test');
    console.log('templates', JSON.parse(JSON.stringify(citeWeb)));
    this.queue.start();
  }
}
