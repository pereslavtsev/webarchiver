import { ApiParams, ApiQueryParams } from 'types-mediawiki/api_params';

export class Watcher {
  id: number;
  name: string;
  params: ApiQueryParams | ApiParams | object;
}
