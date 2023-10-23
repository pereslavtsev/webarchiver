import { Module } from '@nestjs/common';
import { MementoService } from './services/memento.service';
import { HttpModule } from '@nestjs/axios';
import { MementoHttpConfigService } from './services/memento-http-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: MementoHttpConfigService,
    }),
  ],
  providers: [MementoService],
  exports: [MementoService],
})
export class MementoModule {}
