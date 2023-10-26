import { Parameter as MwnParameter } from 'mwn/build/wikitext';

export class ActiveParameter extends MwnParameter {
  constructor(name: string | number, val: string, wikitext: string);
  constructor(parameter: MwnParameter);
  constructor(
    parameter: string | number | MwnParameter,
    val?: string,
    wikitext?: string,
  ) {
    switch (typeof parameter) {
      case 'object': {
        super(parameter.name, parameter.value, parameter.wikitext);
        Object.assign(this, parameter);
        return this.makeProxy();
      }
      case 'string':
      default: {
        super(parameter, val, wikitext);
        return this.makeProxy();
      }
    }
  }

  private makeProxy(): ActiveParameter {
    return new Proxy<ActiveParameter>(this, {
      set(target, property: keyof ActiveParameter, newValue: any): boolean {
        switch (property) {
          case 'value': {
            target.value = newValue;
            target.wikitext = target.wikitext.replace(
              /^(.*=).*$/,
              `$1${newValue}`,
            );
            break;
          }
        }
        return true;
      },
    });
  }

  toString(): string {
    return this.wikitext;
  }
}
