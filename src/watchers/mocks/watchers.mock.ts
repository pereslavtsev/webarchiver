import { Watcher } from '../entities/watcher.entity';

export const WATCHERS: Partial<Watcher>[] = [
  {
    id: 1,
    name: 'cite-web_watcher',
    params: {
      action: 'query',
      prop: 'transcludedin',
      titles: 'Template:cite web',
      // tiprop: ['pageid', ''],
      tinamespace: 0,
      // tishow: 'redirect',
      tilimit: 3,
    },
  },
  {
    id: 2,
    name: 'cite-news_watcher',
    params: {
      action: 'query',
      prop: 'transcludedin',
      titles: 'Template:cite news',
      // tiprop: ['pageid', ''],
      tinamespace: 0,
      // tishow: 'redirect',
      tilimit: 3,
    },
  },
];
