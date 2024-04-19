// @ts-check
import '../installSesLockdown.js';
import { expect, test } from 'vitest';
import { parseAsValue } from '../../src/display/display.ts';

test(parseAsValue, () => {
  expect(parseAsValue('30')).toBe(30n);
});
