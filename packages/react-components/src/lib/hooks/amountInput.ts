import type { NatValue } from '@agoric/ertp/src/types';
import { AssetKind } from '@agoric/ertp';
import { parseAsValue, stringifyValue } from '@agoric/web-components';
import { useState } from 'react';

type Args = {
  value: NatValue | null;
  decimalPlaces: number;
  onChange: (value: NatValue) => void;
};

export const useAmountInput = ({ value, decimalPlaces, onChange }: Args) => {
  const amountString = stringifyValue(value, AssetKind.NAT, decimalPlaces);

  const [fieldString, setFieldString] = useState(
    value === null ? '' : amountString,
  );

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
    // Inputs with type "number" allow these characters which don't apply to
    // Amounts, just strip them.
    const str = ev.target?.value
      ?.replace('-', '')
      .replace('e', '')
      .replace('E', '');
    setFieldString(str);

    try {
      const parsed = parseAsValue(str, AssetKind.NAT, decimalPlaces);
      onChange(parsed);
    } catch {
      console.debug('Invalid input', str);
    }
  };

  // Use the `fieldString` as an input buffer so the user can type values that
  // would be overwritten by `stringifyValue`. For example, if the current
  // input is "1.05", and you tried to change it to "1.25", on hitting
  // backspace, `stringifyValue` would change it from "1.0" to "1.00",
  // preventing you from ever editing it. Only let `amountString` override
  // `fieldString` if the controlled input is trying to change it to a truly
  // different value.
  const displayString =
    value === parseAsValue(fieldString, AssetKind.NAT, decimalPlaces)
      ? fieldString
      : amountString;

  return { displayString, handleInputChange };
};
