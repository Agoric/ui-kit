import { assert, details } from '@agoric/assert';
import { AssetKind } from '@agoric/ertp';
import { stringifyCopyBag } from './copyBagValue/stringifyCopyBag.js';
import { parseAsNat } from './natValue/parseAsNat.js';
import { stringifyNat } from './natValue/stringifyNat.js';
import { stringifySet } from './setValue/stringifySet.js';

import type {
  Amount,
  AmountValue,
  AssetKind as AssetKindUnion, // not a proper enum so can't reuse name for value and type
  Brand,
  NatValue,
} from '@agoric/ertp/src/types.js';

/**
 * @param str - string to parse as a value
 * @param [assetKind] - assetKind of the value
 * @param [decimalPlaces] - places to move the decimal to the left
 */
export const parseAsValue = (
  str: string,
  assetKind: AssetKindUnion = AssetKind.NAT,
  decimalPlaces = 0,
): AmountValue => {
  if (assetKind === AssetKind.NAT) {
    return parseAsNat(str, decimalPlaces);
  }

  throw assert.fail(details`AssetKind ${assetKind} must be NAT`);
};

/**
 * @param str - string to parse as a value
 * @param brand - brand to use in the amount
 * @param [assetKind] - assetKind of the value
 * @param [decimalPlaces] - places to move the decimal to the left
 */
export const parseAsAmount = (
  str: string,
  brand: Brand,
  assetKind = AssetKind.NAT,
  decimalPlaces = 0,
): Amount => {
  return { brand, value: parseAsValue(str, assetKind, decimalPlaces) };
};

/**
 * @param value - value to stringify
 * @param [assetKind] - assetKind of the value
 * @param [decimalPlaces] - places to move the decimal to the
 * right in the string
 * @param [placesToShow] - places after the decimal to show
 */
export const stringifyValue = (
  value: AmountValue,
  assetKind: AssetKindUnion = AssetKind.NAT,
  decimalPlaces = 0,
  placesToShow?: number,
): string => {
  if (assetKind === AssetKind.NAT) {
    return stringifyNat(value as NatValue, decimalPlaces, placesToShow);
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
 * @param purse
 */
export const stringifyPurseValue = (purse): string => {
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
 * @param amount
 * @param [assetKind] - assetKind of the value
 * @param [decimalPlaces] - places to move the decimal to the
 * right in the string
 * @param [placesToShow] - places after the decimal to show
 */
export function stringifyAmountValue(
  amount: Amount,
  assetKind: AssetKindUnion,
  decimalPlaces?: number,
  placesToShow?: number,
) {
  if (!amount) {
    return '0';
  }
  return stringifyValue(amount.value, assetKind, decimalPlaces, placesToShow);
}
