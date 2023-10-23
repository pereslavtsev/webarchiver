import { Module } from '@nestjs/common';
import { WaybackCdxClientService } from './services/wayback-cdx-client.service';
import { HttpModule } from '@nestjs/axios';
import { WaybackCdxClientConfigService } from './services/wayback-cdx-client-config.service';
import { ConfigModule } from '@nestjs/config';
import cdxConfig from './config/cdx.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule.forFeature(cdxConfig)],
      useClass: WaybackCdxClientConfigService,
    }),
  ],
  providers: [WaybackCdxClientService],
})
export class WaybackCdxClientModule {}
