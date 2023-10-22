import { webarchiver } from '../../__generated__';
import { Body, Controller } from '@nestjs/common';
import { SourcesService } from '../services/sources.service';
import { ListRevisionSourcesDto } from '../dto/list-revision-sources.dto';
import { GetSourceDto } from '../dto/get-source.dto';
import { RevisionsService } from '../services/revisions.service';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

const { SourcesServiceControllerMethods } = webarchiver.v1;

@Controller()
@SourcesServiceControllerMethods()
export class SourcesController
  implements webarchiver.v1.SourcesServiceController
{
  constructor(
    private readonly revisionsService: RevisionsService,
    private readonly sourcesService: SourcesService,
  ) {}

  async listRevisionSources(
    @Body() listRevisionSourcesDto: ListRevisionSourcesDto,
  ): Promise<webarchiver.v1.ListRevisionSourcesResponse> {
    const { limit, offset, revisionId } = listRevisionSourcesDto;

    const isRevisionExists = await this.revisionsService.exist({
      where: { id: revisionId },
    });

    if (!isRevisionExists) {
      throw new RpcException({
        message: `Revision ${revisionId} is not exists`,
        status: status.NOT_FOUND,
      });
    }

    const sources = await this.sourcesService.find({
      take: limit,
      skip: offset,
      where: {
        revisionId,
      },
    });
    return { data: sources };
  }

  async getSource(
    @Body() getSourceDto: GetSourceDto,
  ): Promise<webarchiver.v1.Source> {
    const { id } = getSourceDto;
    return this.sourcesService.findOneByOrFail({ id });
  }
}
