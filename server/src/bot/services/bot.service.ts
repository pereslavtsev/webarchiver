import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from '../decorators/inject-bot.decorator';
import type { ApiParams as MwnApiParams, ApiResponse } from 'mwn';
import type { ApiParams } from 'types-mediawiki/api_params';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from 'mwn/build/log';
import { Bot } from '../classes/bot.class';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    @InjectBot()
    private readonly bot: Bot,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    log = this.log.bind(this);
    this.bot.httpClient.interceptors.request.use(
      this.handleHttpRequest.bind(this),
    );
  }

  protected handleHttpRequest(config: AxiosRequestConfig) {
    const { url, params, method } = config;

    const fullUrl = url + '?' + new URLSearchParams(params);

    switch (method) {
      case 'GET':
      case 'get': {
        this.logger.debug(`API request: ${fullUrl}`);
      }
    }

    return config;
  }

  protected log(obj: any): void {
    if (obj && obj instanceof Error) {
      this.logger.error(obj);
    } else if (obj && typeof obj === 'object') {
      this.logger.debug(obj);
    } else if (obj?.indexOf && obj?.startsWith('[W]')) {
      this.logger.warn(obj);
    } else {
      this.logger.log(obj);
    }
  }

  continuedQueryGen<T extends ApiParams, R = ApiResponse>(
    query?: T,
    limit?: number,
  ) {
    return this.bot.continuedQueryGen(
      query as unknown as MwnApiParams,
      limit,
    ) as AsyncGenerator<R>;
  }
}
