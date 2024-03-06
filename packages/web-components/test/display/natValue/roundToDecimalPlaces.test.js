// @ts-check
import '../../installSesLockdown.js';
import { describe, expect, it } from 'vitest';
import { roundToDecimalPlaces as round } from '../../../src/display/natValue/helpers/roundToDecimalPlaces.js';

describe(round, () => {
  it('can round', () => {
    expect(round('00', 0)).toBe('');
    expect(round('00', 1)).toBe('0');
    expect(round('00', 2)).toBe('00');
    expect(round('00', 3)).toBe('000');
    expect(round('34', 0)).toBe('');
    expect(round('34', 1)).toBe('3');
    expect(round('34', 2)).toBe('34');
    expect(round('34', 3)).toBe('340');
  });

  it('defaults', () => {
    expect(round()).toBe('');
  });
});
