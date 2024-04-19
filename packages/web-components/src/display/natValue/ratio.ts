/** @file Copied from zoe/contractSupport to avoid taking that dependency */
import { Fail, q } from '@agoric/assert';
import { AmountMath } from '@agoric/ertp';
import type { Amount, Brand } from '@agoric/ertp/exported';

const PERCENT = 100n;

export interface Ratio {
  numerator: Amount<'nat'>;
  denominator: Amount<'nat'>;
}

/**
 * @param numerator
 * @param numeratorBrand
 * @param [denominator] The default denominator is 100
 * @param [denominatorBrand] The default is to reuse the numeratorBrand
 */
export const makeRatio = (
  numerator: bigint,
  numeratorBrand: Brand<'nat'>,
  denominator = PERCENT,
  denominatorBrand = numeratorBrand,
): Ratio => {
  denominator > 0n ||
    Fail`No infinite ratios! Denominator was 0 ${q(denominatorBrand)}`;

  return harden({
    numerator: AmountMath.make(numeratorBrand, numerator),
    denominator: AmountMath.make(denominatorBrand, denominator),
  });
};
