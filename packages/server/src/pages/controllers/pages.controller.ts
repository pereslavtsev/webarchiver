import { webarchiver } from '../../__generated__';
import { Controller } from '@nestjs/common';
import type { Metadata } from '@grpc/grpc-js';
import { PagesService } from '../services/pages.service';

const { PagesServiceControllerMethods } = webarchiver.v1;

@Controller()
@PagesServiceControllerMethods()
export class PagesController implements webarchiver.v1.PagesServiceController {
  constructor(private readonly pagesService: PagesService) {}

  async listPages(
    request: webarchiver.v1.ListPagesRequest,
    metadata: Metadata,
  ): Promise<webarchiver.v1.ListPagesResponse> {
    console.log('data', request);
    const { limit, offset } = request;
    const pages = await this.pagesService.find({ take: limit, skip: offset });
    return { data: pages };
  }

  async getPage(request: any, metadata?: Metadata): Promise<any> {}
}
