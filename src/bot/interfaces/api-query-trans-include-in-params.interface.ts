import type {
  ApiQueryParams,
  limit,
  namespace,
  OneOrMore,
} from 'types-mediawiki/api_params';

export interface ApiQueryTransIncludeInParams extends ApiQueryParams {
  tiprop?: OneOrMore<'pageid' | 'title' | 'redirect'>;
  tinamespace?: namespace | namespace[];
  tishow?: OneOrMore<'!redirect' | 'redirect'>;
  tilimit?: limit;
  ticontinue?: string;
}
