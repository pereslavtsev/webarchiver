import * as process from 'process';
import { isMainThread, workerData } from 'worker_threads';
import { PrettyOptions } from 'pino-pretty';

export const MIN_ENTITY_LIMIT = 1;
export const MAX_ENTITY_LIMIT = 100;

export const isMainProcess = process.send === undefined;
export const isFork = !isMainProcess;
export const isMainApp = isMainProcess && isMainThread;

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const processName = `${
  isMainThread ? 'main' : workerData['name'] ?? 'worker'
}`;

export const prettyOptions: PrettyOptions = {
  colorizeObjects: true,
  singleLine: true,
  translateTime: 'SYS:HH:MM:ss',
};
