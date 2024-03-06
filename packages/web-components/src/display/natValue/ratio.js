// @ts-check
import { Fail, q } from '@agoric/assert';
import { AmountMath } from '@agoric/ertp';

const PERCENT = 100n;

/** @typedef {import('@agoric/ertp/src/types.js').Brand} Brand */

/**
 * @typedef {object} Ratio
 * @property {import('@agoric/ertp/src/types.js').Amount<'nat'>} numerator
 * @property {import('@agoric/ertp/src/types.js').Amount<'nat'>} denominator
 */

// Copied from zoe/contractSupport to avoid taking that dependency
/**
 * @param {bigint} numerator
 * @param {Brand} numeratorBrand
 * @param {bigint} [denominator] The default denominator is 100
 * @param {Brand} [denominatorBrand] The default is to reuse the numeratorBrand
 * @returns {Ratio}
 */
export const makeRatio = (
  numerator,
  numeratorBrand,
  denominator = PERCENT,
  denominatorBrand = numeratorBrand,
) => {
  denominator > 0n ||
    Fail`No infinite ratios! Denominator was 0 ${q(denominatorBrand)}`;

  return harden({
    numerator: AmountMath.make(numeratorBrand, numerator),
    denominator: AmountMath.make(denominatorBrand, denominator),
  });
};
