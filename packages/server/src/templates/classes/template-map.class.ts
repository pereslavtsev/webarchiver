import { Template } from '../entities/template.entity';
import { plainToInstance } from 'class-transformer';

export class TemplateMap extends Map<
  Template['id'] | Template['title'] | Template['aliases'][0],
  Template
> {
  private readonly aliases = new Map();

  static fromJSON(json: string): TemplateMap {
    const map = new TemplateMap();
    const templates = plainToInstance(
      Template,
      JSON.parse(json),
    ) as unknown as Template[];
    map.push(...templates);
    return map;
  }

  push(...templates: Template[]) {
    templates.forEach((template) => {
      const { id, title } = template;
      this.aliases.set(title.toLowerCase(), id);
      template.aliases.forEach((alias) =>
        this.aliases.set(alias.toLowerCase(), id),
      );
      this.set(id, template);
    });
  }

  get(key: string) {
    return super.get(this.aliases.get(key.toLowerCase())) ?? super.get(key);
  }

  toJSON(): string {
    return JSON.stringify([...this.values()]);
  }
}
