import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { WatcherPagesListener } from './listeners/watcher-pages.listener';
import { PageSubscriber } from './subscribers/page.subscriber';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { PagesController } from './controllers/pages.controller';
import { Revision } from './entities/revision.entity';
import { Source } from './entities/source.entity';
import { SourcesService } from './services/sources.service';
import { RevisionsService } from './services/revisions.service';
import { RevisionReceivedListener } from './listeners/revision-received.listener';
import { PageListener } from './listeners/page.listener';
import { PageHistory } from './entities/page-history.entity';
import { PageHistoryService } from './services/page-history.service';
import { RevisionsController } from './controllers/revisions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Page, PageHistory, Revision, Source])],
  controllers: [PagesController, RevisionsController],
  providers: [
    PagesService,
    PageHistoryService,
    RevisionsService,
    SourcesService,
    WatcherPagesListener,
    PageListener,
    RevisionReceivedListener,
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
  exports: [PagesService, RevisionsService, SourcesService],
})
export class PagesModule {}
