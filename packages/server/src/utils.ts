import cj from 'color-json';

const URL_REGEX = /(https?:\/\/[^ ]*)/;

export function escapeUrl(string: string) {
  return string.match(URL_REGEX)[1];
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function formatObject(obj: object): string {
  return cj(obj, undefined, undefined, 0);
}

export function hrtimeToMs(hrtime: [number, number]) {
  return (hrtime[0] * 1000000000 + hrtime[1]) / 1000000;
}
