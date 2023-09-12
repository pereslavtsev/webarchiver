import { Inject } from '@nestjs/common';

export function InjectTerminal() {
  return Inject('TERMINAL_INSTANCE');
}
