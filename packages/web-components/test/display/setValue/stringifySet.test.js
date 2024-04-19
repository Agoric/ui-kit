// @ts-check
import '../../installSesLockdown.js';
import { expect, test } from 'vitest';
import { stringifySet } from '../../../src/display/setValue/stringifySet.ts';

test(stringifySet, () => {
  expect(stringifySet(['foo', 'bar'])).toBe('2');
});
