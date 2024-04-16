import { assert } from '@agoric/assert';
import { isNatValue } from '@agoric/ertp';

import { stringifyNat } from './stringifyNat.js';
import type { Ratio } from './ratio.js';
import type { Brand } from '@agoric/ertp/exported.js';

const PLACES_TO_SHOW = 2;

export const stringifyRatioAsFraction = (
  ratio: Ratio,
  getDecimalPlaces: (brand: Brand) => number | undefined,
  numPlacesToShow = PLACES_TO_SHOW,
  denomPlacesToShow = PLACES_TO_SHOW,
): string => {
  assert(isNatValue(ratio.numerator.value));
  assert(isNatValue(ratio.denominator.value));

  const numDecimalPlaces = getDecimalPlaces(ratio.numerator.brand);
  const denomDecimalPlaces = getDecimalPlaces(ratio.denominator.brand);

  assert(
    numDecimalPlaces,
    `decimalPlaces for numerator ${ratio.numerator} must be provided`,
  );
  assert(
    denomDecimalPlaces,
    `decimalPlaces for denominator ${ratio.denominator} must be provided`,
  );
  const numeratorString = stringifyNat(
    ratio.numerator.value,
    numDecimalPlaces,
    numPlacesToShow,
  );
  const denominatorString = stringifyNat(
    ratio.denominator.value,
    denomDecimalPlaces,
    denomPlacesToShow,
  );
  return `${numeratorString} / ${denominatorString}`;
};
