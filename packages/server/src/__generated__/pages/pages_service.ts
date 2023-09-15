/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";

export interface ListPagesRequest {
  /** Offset of the query for pagination */
  offset: number;
  /** Limit per page of the query for pagination */
  limit: number;
}

export interface ListPagesResponse {
  data: Page[];
}

export interface GetPageRequest {
  id: number;
}

export interface Page {
  id: number;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  deletedAt: Date | undefined;
  pageId: number;
  title: string;
  redirect: boolean;
  priority: number;
  scannedAt: Date | undefined;
}

wrappers[".google.protobuf.Timestamp"] = {
  fromObject(value: Date) {
    return { seconds: value.getTime() / 1000, nanos: (value.getTime() % 1000) * 1e6 };
  },
  toObject(message: { seconds: number; nanos: number }) {
    return new Date(message.seconds * 1000 + message.nanos / 1e6);
  },
} as any;

export interface PagesServiceClient {
  listPages(request: ListPagesRequest, metadata?: Metadata): Observable<ListPagesResponse>;

  getPage(request: GetPageRequest, metadata?: Metadata): Observable<Page>;
}

export interface PagesServiceController {
  listPages(
    request: ListPagesRequest,
    metadata?: Metadata,
  ): Promise<ListPagesResponse> | Observable<ListPagesResponse> | ListPagesResponse;

  getPage(request: GetPageRequest, metadata?: Metadata): Promise<Page> | Observable<Page> | Page;
}

export function PagesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["listPages", "getPage"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PagesService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PagesService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PAGES_SERVICE_NAME = "PagesService";
