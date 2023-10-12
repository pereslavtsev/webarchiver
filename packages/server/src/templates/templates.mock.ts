import type { Template } from './entities/template.entity';
import type { DeepPartial } from 'typeorm';

export const TEMPLATES_MOCK: DeepPartial<Template>[] = [
  {
    id: 'cdf96b9b-d5c5-4dcf-9bf2-42bb81094e0e',
    title: 'cite-web',
  },
  {
    id: 'c057f842-fe20-4a0b-83a3-e52d6973107c',
    title: 'cite-news',
  },
];
