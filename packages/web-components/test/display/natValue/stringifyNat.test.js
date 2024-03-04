// @ts-check
import '../../installSesLockdown.js';
import { describe, expect, it } from 'vitest';
import { stringifyNat } from '../../../src/display/natValue/stringifyNat.js';

describe(stringifyNat, () => {
  it('can stringify cents to dollars', () => {
    // 1 dollar is 100 cents, or 2 decimal points to the right.

    // cents in 200 dollars
    const cents200 = 20000n;

    expect(stringifyNat(cents200, 2, 2)).toEqual('200.00');
    expect(stringifyNat(cents200, 2, 1)).toEqual('200.0');
    expect(stringifyNat(cents200, 2, 3)).toEqual('200.000');
    expect(stringifyNat(cents200, 2, 10)).toEqual('200.0000000000');
    expect(stringifyNat(1n, 2, 2)).toEqual('0.01');
    expect(stringifyNat(1n, 2, 1)).toEqual('0.0');
    expect(stringifyNat(1n, 2, 0)).toEqual('0');
  });

  it('can stringify wei to eth', () => {
    // 1 eth is 10^18 wei, or 18 decimal points to the right
    const wei = 10n ** 18n;

    // wei in 3 eth
    const wei3 = 3n * wei;

    expect(stringifyNat(wei3, 18, 2)).toEqual('3.00');
    expect(stringifyNat(wei3, 18, 0)).toEqual('3');
    expect(stringifyNat(wei3, 18, 1)).toEqual('3.0');
    expect(stringifyNat(wei3, 18, 10)).toEqual('3.0000000000');
    expect(stringifyNat(100000000000000n * wei, 18, 2)).toEqual(
      '100000000000000.00',
    );
  });

  it('limits decimal places to 100', () => {
    const tinyCoin = 123456789n;

    expect(stringifyNat(tinyCoin, 105, 120)).toBe(
      `0.${'1234'.padStart(100, '0')}`,
    );
  });

  it('shows correct number of places by default', () => {
    // If number has no decimal places, don't show any.
    expect(stringifyNat(123n)).toBe('123');

    // Show two decimal places by default.
    expect(stringifyNat(1230000n, 4)).toBe('123.00');

    // Show all significant decimal places if greater than 2 by default.
    expect(stringifyNat(123456700n, 6)).toBe('123.4567');
  });

  it('handles empty values', () => {
    expect(stringifyNat(undefined)).toBe('');
    expect(stringifyNat(null)).toBe('');
    expect(stringifyNat(0n)).toBe('0');
    expect(stringifyNat(0n, 1)).toBe('0.0');
    expect(stringifyNat(0n, 4)).toBe('0.00');
  });
});
