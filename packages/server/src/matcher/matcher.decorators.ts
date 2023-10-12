import { InjectQueue, Processor } from '@nestjs/bull';
import { MATCHER_QUEUE } from './matcher.consts';

export function InjectMatcherQueue() {
  return InjectQueue(MATCHER_QUEUE);
}

export function MatcherProcessor() {
  return Processor(MATCHER_QUEUE);
}
