// @ts-check
import '../installSesLockdown.js';
import { expect, test } from 'vitest';
import { parseAsValue } from '../../src/display/display.js';

test(parseAsValue, () => {
  expect(parseAsValue('30')).toBe(30n);
});
