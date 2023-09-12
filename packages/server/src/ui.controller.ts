import { Controller } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';

@Controller()
export class UiController {
  @MessagePattern('*')
  echo(@Payload() data: object) {
    console.log(88888, data)
    return data;
  }
}
