import { webarchiver } from '../../__generated__';
import { Body, Controller } from '@nestjs/common';
import { RevisionsService } from '../services/revisions.service';
import { ListRevisionsDto } from '../dto/list-revisions.dto';
import { GetRevisionDto } from '../dto/get-revision.dto';

const { RevisionsServiceControllerMethods } = webarchiver.v1;

@Controller()
@RevisionsServiceControllerMethods()
export class RevisionsController
  implements webarchiver.v1.RevisionsServiceController
{
  constructor(private readonly revisionsService: RevisionsService) {}

  async listRevisions(
    @Body() listRevisionsDto: ListRevisionsDto,
  ): Promise<webarchiver.v1.ListRevisionsResponse> {
    const { limit, offset, pageId } = listRevisionsDto;
    const pages = await this.revisionsService.find({
      take: limit,
      skip: offset,
      where: {
        pageId,
      },
    });
    return { data: pages };
  }

  async getRevision(
    @Body() getRevisionDto: GetRevisionDto,
  ): Promise<webarchiver.v1.Revision> {
    const { id } = getRevisionDto;
    return this.revisionsService.findOneByOrFail({ id });
  }
}
