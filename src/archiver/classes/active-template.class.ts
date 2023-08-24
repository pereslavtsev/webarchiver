import { Template as MwnTemplate } from 'mwn/build/wikitext';
import { ActiveParameter } from './active-parameter.class';

export class ActiveTemplate extends MwnTemplate {
  readonly wikitext: string;

  private transformParameters() {
    this.parameters = this.parameters.map(
      (parameter) => new ActiveParameter(parameter),
    );
  }

  constructor(wikitext: string);
  constructor(template: MwnTemplate);
  constructor(template: string | MwnTemplate) {
    switch (typeof template) {
      case 'string': {
        super(template);
        Object.assign(this, new MwnTemplate(template));
        this.transformParameters();
        return this.makeProxy();
      }
      case 'object': {
        if (template instanceof MwnTemplate) {
          super(template.wikitext);
          Object.assign(this, template);
          this.transformParameters();
          return this.makeProxy();
        }
      }
    }
  }

  private makeProxy(): ActiveTemplate {
    return new Proxy(this, {
      get(target: ActiveTemplate, property: keyof ActiveTemplate) {
        switch (property) {
          case 'wikitext': {
            return ['{{', target.name, target.parameters.join(''), '}}'].join(
              '',
            );
          }
          default: {
            return target[property];
          }
        }
      },
    });
  }

  addParam(name: string | number, val: string): void {
    // TODO: formatting wikitext
    this.parameters.push(new ActiveParameter(name, val, `${name}=${val}`));
  }

  getParam(paramName: string | number): ActiveParameter;
  getParam(paramAliases: string[]): ActiveParameter;
  getParam(paramName: string | number | string[]): ActiveParameter {
    if (!Array.isArray(paramName)) {
      return super.getParam(paramName) as ActiveParameter;
    }
    const resultParamName = Array.from(new Set(paramName)).find(
      (paramName) => super.getParam(paramName) !== undefined,
    );
    return super.getParam(resultParamName) as ActiveParameter;
  }

  setParam(paramName: string | number, value: string): void {
    const param = this.getParam(paramName);
    if (!param) {
      this.addParam(paramName, value);
      return;
    }
    param.value = value;
  }

  toJSON() {
    const { name, parameters, wikitext } = this;
    return {
      name,
      parameters: parameters.map((parameter) => ({ ...parameter })),
      wikitext,
    };
  }

  toString(): string {
    return this.wikitext;
  }
}
