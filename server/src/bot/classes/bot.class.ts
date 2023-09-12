import { mwn as MwnBot } from 'mwn';
import { RawRequestParams } from 'mwn/build/core';
import { rejectWithError } from 'mwn/build/error';
import axios, { AxiosInstance } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { mergeDeep1 } from 'mwn/build/utils';

axiosCookieJarSupport(axios);

export class Bot extends MwnBot {
  readonly httpClient: AxiosInstance = axios.create();

  rawRequest(requestOptions: RawRequestParams): Promise<any> {
    if (!requestOptions.url) {
      return rejectWithError({
        code: 'mwn_nourl',
        info: 'No URL provided for API request!',
        disableRetry: true,
        request: requestOptions,
      });
    }
    return this.httpClient.request(
      mergeDeep1(
        {},
        Bot.requestDefaults,
        {
          method: 'get',
          headers: {
            'User-Agent': this.options.userAgent,
          },
        },
        requestOptions,
      ),
    );
  }
}
