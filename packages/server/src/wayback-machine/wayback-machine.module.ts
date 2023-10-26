import { Module } from '@nestjs/common';
import { WaybackMachineService } from './services/wayback-machine.service';
import { HttpModule } from '@nestjs/axios';
import { WaybackMachineHttpConfigService } from './services/wayback-machine-http-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: WaybackMachineHttpConfigService,
    }),
  ],
  providers: [WaybackMachineService],
})
export class WaybackMachineModule {}
