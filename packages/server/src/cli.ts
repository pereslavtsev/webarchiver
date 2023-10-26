import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrapCli() {
  await CommandFactory.run(AppModule, ['warn', 'error']);
}

bootstrapCli();
