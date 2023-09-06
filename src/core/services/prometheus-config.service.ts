import { Injectable } from '@nestjs/common';
import {
  PrometheusOptions,
  PrometheusOptionsFactory,
} from '@willsoto/nestjs-prometheus';

@Injectable()
export class PrometheusConfigService implements PrometheusOptionsFactory {
  createPrometheusOptions(): PrometheusOptions {
    return {
      pushgateway: {
        url: 'http://127.0.0.1:9091',
      },
    };
  }
}
