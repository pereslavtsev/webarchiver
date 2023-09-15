/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";

export interface ListWatchersRequest {
  /** Offset of the query for pagination */
  offset: number;
  /** Limit per page of the query for pagination */
  limit: number;
}

export interface ListWatchersResponse {
  data: Watcher[];
}

export interface GetWatcherRequest {
  id: number;
}

export interface Watcher {
  id: number;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  deletedAt: Date | undefined;
}

wrappers[".google.protobuf.Timestamp"] = {
  fromObject(value: Date) {
    return { seconds: value.getTime() / 1000, nanos: (value.getTime() % 1000) * 1e6 };
  },
  toObject(message: { seconds: number; nanos: number }) {
    return new Date(message.seconds * 1000 + message.nanos / 1e6);
  },
} as any;

export interface WatchersServiceClient {
  listWatchers(request: ListWatchersRequest, metadata?: Metadata): Observable<ListWatchersResponse>;

  getWatcher(request: GetWatcherRequest, metadata?: Metadata): Observable<Watcher>;
}

export interface WatchersServiceController {
  listWatchers(
    request: ListWatchersRequest,
    metadata?: Metadata,
  ): Promise<ListWatchersResponse> | Observable<ListWatchersResponse> | ListWatchersResponse;

  getWatcher(request: GetWatcherRequest, metadata?: Metadata): Promise<Watcher> | Observable<Watcher> | Watcher;
}

export function WatchersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["listWatchers", "getWatcher"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("WatchersService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("WatchersService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const WATCHERS_SERVICE_NAME = "WatchersService";
