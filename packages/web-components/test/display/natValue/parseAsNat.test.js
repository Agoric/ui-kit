// @ts-check
import '../../installSesLockdown.js';
import { describe, expect, it } from 'vitest';
import { parseAsNat } from '../../../src/display/natValue/parseAsNat.ts';

describe(parseAsNat, () => {
  it('can parse cents to dollars', () => {
    // 1 dollar is 100 cents, or 2 decimal points to the right.

    // cents in 200 dollars
    const cents200 = 20000n;
    expect(parseAsNat('200.00', 2)).toEqual(cents200);
    expect(parseAsNat('200.0', 2)).toEqual(cents200);

    // rounds to floor
    expect(parseAsNat('200.009', 2)).toEqual(cents200);
    expect(parseAsNat('200.002', 2)).toEqual(cents200);
    expect(parseAsNat('200.0023423342342343', 2)).toEqual(cents200);

    expect(parseAsNat('.0023423342342343', 2)).toEqual(0n);
    expect(parseAsNat('.01', 2)).toEqual(1n);
    expect(parseAsNat('0.01', 2)).toEqual(1n);
  });

  it('can parse wei to eth', () => {
    // 1 eth is 10^18 wei, or 18 decimal points to the right
    const wei = 10n ** 18n;

    // wei in 3 eth
    const wei3 = 3n * wei;

    expect(parseAsNat('03', 18)).toEqual(wei3);
    expect(parseAsNat('3', 18)).toEqual(wei3);
    expect(parseAsNat('03.0', 18)).toEqual(wei3);

    // rounds to floor
    expect(parseAsNat('03.00000000000000000003493023940239', 18)).toEqual(wei3);
    expect(
      parseAsNat('100000000000000.00000000000000000003493023940239', 18),
    ).toEqual(100000000000000n * wei);
  });

  it('throws on negative numbers', () => {
    expect(() => parseAsNat('-200', 2)).toThrowError(
      /.* must be a non-negative decimal number/,
    );
  });
});
