import { Command, CommandRunner, Option } from 'nest-commander';
import * as process from 'process';
import { firstValueFrom } from 'rxjs';
import { IpcService } from 'nest-ipc';
import ipc from 'node-ipc';

@Command({ name: 'page' })
export class PageCommand extends CommandRunner {
  constructor(private readonly ipcService: IpcService) {
    super();
  }

  @Option({
    flags: '-t, --title [string]',
    description: 'Page title',
  })
  parseTitle(val: string): string {
    return val;
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    console.log(111);
    // const addedPage = await this.pagesService.addById();
    ipc.of[this.ipcService['id']].on('message', (x) => {
      console.log('data', x);
    });
    const watchers = await firstValueFrom(
      this.ipcService.send('add_page', { foo: 'bar' }),
    );
    console.log('watchers', watchers);
    process.exit(0);
  }
}
