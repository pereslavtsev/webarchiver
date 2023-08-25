import { Watcher } from '../entities/watcher.entity';
import { Worker } from 'worker_threads';

export interface WatcherContext {
  data: Watcher;
  worker: Worker;
}
