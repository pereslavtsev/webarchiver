import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class PagesController {
  @GrpcMethod('ArchiverService', 'ListPages')
  listPage(data: any, metadata: any, call: any) {
    console.log('data', data);
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];
    return items.find(({ id }) => id === data.id);
  }
}
