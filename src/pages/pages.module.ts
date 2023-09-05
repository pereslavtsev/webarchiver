import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { WatcherPagesListener } from './listeners/watcher-pages.listener';
import { PageSubscriber } from './subscribers/page.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  providers: [PagesService, WatcherPagesListener, PageSubscriber],
  exports: [PagesService],
})
export class PagesModule {}
