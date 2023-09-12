import { Inject } from '@nestjs/common';

export function InjectBot() {
  return Inject('MWN_INSTANCE');
}
