import { GrpcWebImpl, PagesServiceClientImpl } from "../__generated__/pages/pages_service";

const rpc = new GrpcWebImpl('http://0.0.0.0:8081', {
  debug: process.env.NODE_ENV === "development"
});
const client = new PagesServiceClientImpl(rpc);

export default class PagesService {
  list() {
    return client.ListPages({ limit: 10 })
  }
}
