import '../../installSesLockdown.js';
import { describe, expect, it } from 'vitest';
import { Fail } from '@agoric/assert';
import { Far } from '@endo/marshal';
import {
  stringifyRatio,
  stringifyRatioAsFraction,
  stringifyRatioAsPercent,
} from '../../../src/display/index.js';
import { makeRatio } from '../../../src/display/natValue/ratio.js';

describe('stringifyRatio', () => {
  const ethBrand = Far('eth brand', {});
  const dollarBrand = Far('dollar brand', {});
  const istBrand = Far('ist brand', {});

  const getDecimalPlaces = brand => {
    if (ethBrand === brand) {
      return 18;
    }
    if (istBrand === brand) {
      return 6;
    }
    if (dollarBrand === brand) {
      return 2;
    }
    throw Fail`brand ${brand} was not recognized`;
  };

  it('can show dollars for one eth', () => {
    const ethPrice = harden(
      makeRatio(
        158724n, // value of 1 eth in cents
        // @ts-expect-error fake brand
        dollarBrand,
        10n ** 18n,
        ethBrand,
      ),
    );

    expect(
      stringifyRatioAsFraction(ethPrice, getDecimalPlaces, undefined, 0),
    ).toBe('1587.24 / 1');

    expect(stringifyRatioAsFraction(ethPrice, getDecimalPlaces)).toBe(
      '1587.24 / 1.00',
    );
    expect(stringifyRatio(ethPrice, getDecimalPlaces)).toBe('1587.24');
  });

  it('can show marketPrice for ETH in IST', () => {
    // IST has 6 decimalPlaces
    // 1 eth is 10^18 wei, or 18 decimal points to the right

    // $1,587.24 for 1 ETH
    // denominator: {brand: Alleged: ETH brand, value: 1000000000000000000n}
    // numerator: {brand: Alleged: Scones brand, value: 1909113516n}

    const ethPrice = harden(
      makeRatio(
        1909113516n, // value of 1 eth in smallest IST denomination
        // @ts-expect-error fake brand
        istBrand,
        10n ** 18n,
        ethBrand,
      ),
    );

    expect(stringifyRatio(ethPrice, getDecimalPlaces)).toBe('1909.11');

    expect(stringifyRatio(ethPrice, getDecimalPlaces, 4)).toBe('1909.1135');

    expect(stringifyRatioAsPercent(ethPrice, getDecimalPlaces)).toBe('190911');

    expect(stringifyRatioAsPercent(ethPrice, getDecimalPlaces, 1)).toBe(
      '190911.3',
    );
  });
});
