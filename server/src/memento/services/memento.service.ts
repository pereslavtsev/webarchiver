import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MementoService {
  constructor(private readonly httpService: HttpService) {}

  find(uri: string, date: Date) {
    const desired = '';
    this.httpService.get(`api/json/${desired}/${uri}`);
  }
}
