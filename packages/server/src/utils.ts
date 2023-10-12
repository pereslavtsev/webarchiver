import cj from 'color-json';

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function formatObject(obj: object): string {
  return cj(obj, undefined, undefined, 0);
}
