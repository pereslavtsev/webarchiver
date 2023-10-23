import { Module } from '@nestjs/common';
import { WaybackCdxClientService } from './services/wayback-cdx-client.service';
import { HttpModule } from '@nestjs/axios';
import { WaybackCdxClientConfigService } from './services/wayback-cdx-client-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: WaybackCdxClientConfigService,
    }),
  ],
  providers: [WaybackCdxClientService],
})
export class WaybackCdxClientModule {}
