import { ActiveTemplate } from '../classes/active-template.class';
import { parseDate } from '../utils';
import { ActiveParameter } from '../classes/active-parameter.class';

export class CiteWebTemplate extends ActiveTemplate {
  protected get accessDateParam() {
    return this.getParam('access-date');
  }
  protected get archiveUrlParam() {
    return this.getParam('archive-url');
  }

  get accessDate(): Date {
    const getAccessDateParam = this.accessDateParam;
    if (!getAccessDateParam) {
      return null;
    }
    return parseDate(getAccessDateParam.value);
  }

  set accessDate(value: string) {
    this.setParam(this.accessDateParam?.name ?? 'access-date', value);
  }

  get archiveUrl(): URL | null {
    const getArchiveUrlParam = this.getParam('archive-url');
    if (!getArchiveUrlParam) {
      return null;
    }
    return new URL(getArchiveUrlParam.value);
  }

  set archiveUrl(value: string) {
    this.setParam(this.archiveUrlParam?.name ?? 'archive-url', value);
  }

  get archiveDate(): Date {
    const getArchiveDateParam = this.getParam('archive-date');
    if (!getArchiveDateParam) {
      return null;
    }
    return parseDate(getArchiveDateParam.value);
  }

  protected static transformParamName(paramName: string): string {
    return paramName.replace('-', '');
  }

  getParam(paramName: string | number | string[]): ActiveParameter {
    switch (typeof paramName) {
      case 'number': {
        return super.getParam(paramName);
      }
      case 'string': {
        return this.getParam([paramName]);
      }
      case 'object': {
        const paramAliases = paramName.map((paramName) =>
          CiteWebTemplate.transformParamName(paramName),
        );
        return super.getParam([...paramName, ...paramAliases]);
      }
    }
  }
}
