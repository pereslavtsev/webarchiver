import { Module, ModuleMetadata } from '@nestjs/common';
import { TemplatesService } from './services/templates.service';
import { isMainApp } from '../consts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { BotModule } from '../bot/bot.module';

const metadata: ModuleMetadata = {
  imports: [BotModule],
  providers: [],
  exports: [],
};

if (isMainApp) {
  metadata.imports.push(TypeOrmModule.forFeature([Template]));
  metadata.providers.push(TemplatesService);
  metadata.exports.push(TemplatesService);
}

@Module(metadata)
export class TemplatesModule {}
