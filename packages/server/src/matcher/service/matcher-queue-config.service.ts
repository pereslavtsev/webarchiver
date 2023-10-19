import {
  BullModuleOptions,
  BullOptionsFactory,
} from '@nestjs/bull/dist/interfaces/bull-module-options.interface';
import { Injectable } from '@nestjs/common';
import { MATCHER_QUEUE } from '../matcher.consts';

@Injectable()
export class MatcherQueueConfigService implements BullOptionsFactory {
  createBullOptions(): BullModuleOptions {
    return {
      name: MATCHER_QUEUE,
      settings: {
        maxStalledCount: 10 * 60 * 1000,
      },
    };
  }
}
