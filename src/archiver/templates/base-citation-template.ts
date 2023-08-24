import { ActiveTemplate } from '../classes/active-template.class';

export abstract class BaseCitationTemplate extends ActiveTemplate {
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
