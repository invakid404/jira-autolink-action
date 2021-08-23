import { trim } from 'lodash';

export const join = (...parts: string[]): string =>
  parts.map((part) => trim(part, '/')).join('/');
