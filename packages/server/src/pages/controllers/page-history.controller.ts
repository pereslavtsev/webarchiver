import { webarchiver } from '../../__generated__';
import { Body, Controller } from '@nestjs/common';
import { PageHistoryService } from '../services/page-history.service';
import { ListPageHistoryDto } from '../dto/list-page-history.dto';

const { PageHistoryServiceControllerMethods } = webarchiver.v1;

@Controller()
@PageHistoryServiceControllerMethods()
export class PageHistoryController
  implements webarchiver.v1.PageHistoryServiceController
{
  constructor(private readonly pageHistoryService: PageHistoryService) {}

  async listPageHistory(
    @Body() listPageHistoryDto: ListPageHistoryDto,
  ): Promise<webarchiver.v1.ListPageHistoryResponse> {
    const { limit, offset, pageId } = listPageHistoryDto;
    const pageHistory = await this.pageHistoryService.find({
      take: limit,
      skip: offset,
      where: {
        pageId,
      },
    });
    return { data: pageHistory };
  }
}
