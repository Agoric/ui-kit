import React, { type Ref, forwardRef } from 'react';
import type { NatValue } from '@agoric/ertp/src/types';
import { useAmountInput } from '../hooks/amountInput.js';

const noop = () => {
  /* no-op */
};

export type AmountInputProps = {
  value: NatValue | null;
  decimalPlaces: number;
  className?: React.HtmlHTMLAttributes<HTMLInputElement>['className'];
  onChange?: (value: NatValue) => void;
  disabled?: boolean;
};

const RenderAmountInput = (
  {
    value,
    decimalPlaces,
    className,
    onChange = noop,
    disabled = false,
  }: AmountInputProps,
  ref?: Ref<HTMLInputElement>,
) => {
  const { displayString, handleInputChange } = useAmountInput({
    value,
    decimalPlaces,
    onChange,
  });

  return (
    <input
      className={className}
      type="number"
      placeholder="0"
      min="0"
      disabled={disabled}
      value={displayString}
      onChange={handleInputChange}
      ref={ref}
    />
  );
};

export const AmountInput = forwardRef(RenderAmountInput);
