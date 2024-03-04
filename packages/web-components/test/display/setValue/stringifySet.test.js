// @ts-check
import '../../installSesLockdown.js';
import { expect, test } from 'vitest';
import { stringifySet } from '../../../src/display/setValue/stringifySet.js';

test(stringifySet, () => {
  expect(stringifySet(['foo', 'bar'])).toBe('2');
});
