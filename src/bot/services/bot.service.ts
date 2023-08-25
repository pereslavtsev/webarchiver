import { Injectable } from '@nestjs/common';
import { InjectBot } from '../decorators/inject-bot.decorator';
import type { ApiParams as MwnApiParams, mwn, ApiResponse } from 'mwn';
import type { ApiParams } from 'types-mediawiki/api_params';

@Injectable()
export class BotService {
  constructor(
    @InjectBot()
    private readonly bot: mwn,
  ) {}

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
