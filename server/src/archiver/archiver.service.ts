import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import PQueue from 'p-queue';
import { SourcesService } from '../sources/sources.service';

@Injectable()
export class ArchiverService implements OnApplicationBootstrap {
  protected readonly queue = new PQueue({ concurrency: 1, autoStart: false });

  constructor(private readonly sourcesService: SourcesService) {
    // this.queue.on('idle', () => console.log('idle'));
  }

  archive() {}

  async onApplicationBootstrap(): Promise<any> {
    this.queue.start();
    const sources = await this.sourcesService.findByPage('Геноцид в Камбодже');
  }
}
