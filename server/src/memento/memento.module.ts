import { Module } from '@nestjs/common';
import { MementoService } from './services/memento.service';
import { HttpModule } from '@nestjs/axios';
import { MementoConfigService } from './services/memento-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: MementoConfigService,
    }),
  ],
  providers: [MementoService],
  exports: [MementoService],
})
export class MementoModule {}
