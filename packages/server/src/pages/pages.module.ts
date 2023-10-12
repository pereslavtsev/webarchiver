import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { WatcherPagesListener } from './listeners/watcher-pages.listener';
import { PageSubscriber } from './subscribers/page.subscriber';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { PagesController } from './controllers/pages.controller';
import { Revision } from './entities/revision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page, Revision])],
  controllers: [PagesController],
  providers: [
    PagesService,
    WatcherPagesListener,
    PageSubscriber,
    makeCounterProvider({
      name: 'pages_added_total',
      help: 'Total pages added',
    }),
    makeCounterProvider({
      name: 'pages_received_total',
      help: 'Total pages received',
    }),
  ],
  exports: [PagesService],
})
export class PagesModule {}
