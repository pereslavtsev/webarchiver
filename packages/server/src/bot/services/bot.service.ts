import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from '../decorators/inject-bot.decorator';
import type { ApiParams as MwnApiParams, ApiResponse } from 'mwn';
import type { ApiParams } from 'types-mediawiki/api_params';
import * as logUtils from 'mwn/build/log';
import { Bot } from '../classes/bot.class';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import cj from 'color-json';
import terminalLink from 'terminal-link';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    @InjectBot()
    private readonly bot: Bot,
  ) {
    Object.defineProperty(logUtils, 'log', { value: this.log.bind(this) });
    this.bot.httpClient.interceptors.request.use(
      this.handleHttpRequest.bind(this),
      this.handleError.bind(this),
    );
    this.bot.httpClient.interceptors.response.use(
      this.handleHttpResponse.bind(this),
      this.handleError.bind(this),
    );
  }

  protected handleError(error: unknown) {
    this.logger.error(error);
  }

  protected handleHttpResponse(response: AxiosResponse): AxiosResponse {
    const { status, statusText } = response;
    this.logger.debug(`MediaWiki API Response: %d %s`, status, statusText);
    return response;
  }

  protected handleHttpRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const { url, params, method } = config;

    const fullUrl = url + '?' + new URLSearchParams(params);

    switch (method) {
      case 'GET':
      case 'get': {
        this.logger.debug(
          `MediaWiki API Request: %s %s`,
          cj(params, undefined, undefined, 0),
          terminalLink('link', fullUrl),
        );
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
