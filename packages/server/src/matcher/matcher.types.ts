import type { Job, Queue } from 'bull';
import type { Page } from '../pages/entities/page.entity';

export type MatcherJob = Job<{ page: Page }>;
export type MatcherQueue = Queue<{
  page: Page;
}>;
