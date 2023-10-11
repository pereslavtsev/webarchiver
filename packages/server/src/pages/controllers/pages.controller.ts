import { webarchiver } from '../../__generated__';
import {
  BadRequestException,
  Body,
  Catch,
  Controller,
  RpcExceptionFilter,
  UseFilters,
} from '@nestjs/common';
import type { Metadata } from '@grpc/grpc-js';
import { PagesService } from '../services/pages.service';
import { ListPagesDto } from '../dto/list-pages.dto';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

const { PagesServiceControllerMethods } = webarchiver.v1;

@Catch(BadRequestException)
export class Filter implements RpcExceptionFilter<BadRequestException> {
  catch(exception: BadRequestException): Observable<any> {
    const response = exception.getResponse();
    const message =
      typeof response === 'object'
        ? String(response['message'])
        : response ?? exception.message;
    return throwError(
      () =>
        new RpcException({
          message,
          code: status.NOT_FOUND,
        }),
    );
  }
}

@UseFilters(Filter)
@Controller()
@PagesServiceControllerMethods()
export class PagesController implements webarchiver.v1.PagesServiceController {
  constructor(private readonly pagesService: PagesService) {}

  async listPages(
    @Body() listPagesDto: ListPagesDto,
  ): Promise<webarchiver.v1.ListPagesResponse> {
    const { limit, offset } = listPagesDto;
    const pages = await this.pagesService.find({ take: limit, skip: offset });
    return { data: pages };
  }

  async getPage(request: any, metadata?: Metadata): Promise<any> {}
}
