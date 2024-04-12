// @ts-check
import { assert, details } from '@agoric/assert';
import { AssetKind } from '@agoric/ertp';
import '@agoric/ertp/exported.js';
import { parseAsNat } from './natValue/parseAsNat.js';
import { stringifyNat } from './natValue/stringifyNat.js';
import { stringifySet } from './setValue/stringifySet.js';
import { stringifyCopyBag } from './copyBagValue/stringifyCopyBag.js';

/** @import { Amount, AmountValue, Brand } from '@agoric/ertp/src/types.js'; */
/** @import { AssetKind as AssetKindT } from '@agoric/ertp/src/types.js'; */

/**
 * @param {string} str - string to parse as a value
 * @param {AssetKindT} [assetKind] - assetKind of the value
 * @param {number} [decimalPlaces] - places to move the decimal to the left
 * @returns {AmountValue}
 */
export const parseAsValue = (
  str,
  assetKind = AssetKind.NAT,
  decimalPlaces = 0,
) => {
  if (assetKind === AssetKind.NAT) {
    return parseAsNat(str, decimalPlaces);
  }

  throw assert.fail(details`AssetKind ${assetKind} must be NAT`);
};

/**
 * @param {string} str - string to parse as a value
 * @param {Brand} brand - brand to use in the amount
 * @param {AssetKindT} [assetKind] - assetKind of the value
 * @param {number} [decimalPlaces] - places to move the decimal to the left
 * @returns {Amount}
 */
export const parseAsAmount = (
  str,
  brand,
  assetKind = AssetKind.NAT,
  decimalPlaces = 0,
) => {
  return { brand, value: parseAsValue(str, assetKind, decimalPlaces) };
};

/**
 * @param {AmountValue} value - value to stringify
 * @param {AssetKindT} [assetKind] - assetKind of the value
 * @param {number} [decimalPlaces] - places to move the decimal to the
 * right in the string
 * @param {number} [placesToShow] - places after the decimal to show
 * @returns {string}
 */
export const stringifyValue = (
  value,
  assetKind = AssetKind.NAT,
  decimalPlaces = 0,
  placesToShow,
) => {
  if (assetKind === AssetKind.NAT) {
    return stringifyNat(value, decimalPlaces, placesToShow);
  }
  if (assetKind === AssetKind.SET) {
    return stringifySet(value);
  }
  if (assetKind === AssetKind.COPY_BAG) {
    return stringifyCopyBag(value);
  }
  throw assert.fail(
    details`AssetKind ${assetKind} must be NAT or SET or COPY_BAG`,
  );
};

/**
 * Stringify the value of a purse
 * @param {any} purse
 * @returns {string}
 */
export const stringifyPurseValue = purse => {
  if (!purse) {
    return '0';
  }
  return stringifyValue(
    purse.value,
    purse.displayInfo.assetKind,
    purse.displayInfo.decimalPlaces,
  );
};

/**
 * Stringify the value in an amount
 * @param {Amount} amount
 * @param {AssetKindT} [assetKind] - assetKind of the value
 * @param {number} [decimalPlaces] - places to move the decimal to the
 * right in the string
 * @param {number} [placesToShow] - places after the decimal to show
 * @returns {string}
 */
export function stringifyAmountValue(
  amount,
  assetKind,
  decimalPlaces,
  placesToShow,
) {
  if (!amount) {
    return '0';
  }
  return stringifyValue(amount.value, assetKind, decimalPlaces, placesToShow);
}
