import { Module } from '@nestjs/common';
import { terminal } from 'terminal-kit';

@Module({
  providers: [
    {
      provide: 'TERMINAL_INSTANCE',
      useValue: terminal,
    },
  ],
  exports: ['TERMINAL_INSTANCE'],
})
export class TerminalModule {}
