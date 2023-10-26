import { ActiveTemplate } from '../classes/active-template.class';
import { escapeUrl } from '../../utils';

export abstract class BaseCitationTemplate extends ActiveTemplate {
  protected transformUrl(string: string) {
    const value = string.trim().replaceAll('<[^>]*>', '');

    try {
      return new URL(value);
    } catch (error) {
      // try to fix url
      return new URL(escapeUrl(value));
    }
  }

  get url(): URL | null {
    const getUrlParam = this.getParam('url');
    if (!getUrlParam?.value.length) {
      return null;
    }

    return this.transformUrl(getUrlParam.value);
  }

  get isArchived(): boolean {
    return !!this.archiveUrl;
  }
  /**
   * The full date when the original URL was accessed; do not wikilink
   */
  abstract get accessDate(): Date | null;
  /**
   * The URL of an archived copy of a web page, if or in case the URL becomes unavailable; requires 'archive-date'
   */
  abstract get archiveUrl(): URL | null;
  /**
   * Date when the original URL was archived; do not wikilink
   */
  abstract get archiveDate(): Date | null;
}
