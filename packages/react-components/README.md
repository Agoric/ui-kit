# Agoric React Components

React hooks and utilities that make writing an Agoric dapp as quick and painless as possible.

## Prequisites

See [Agoric/ui-kit#setup](https://github.com/Agoric/ui-kit?tab=readme-ov-file#setup) for setup instructions, as well as more pointers for using the `chainStorageWatcher` and `walletConnection`.

## Integrating

See [packages/example](../example/README.md) for a complete working example of how to integrate the Agoric React Components.

## Amount Inputs

The `AmountInput` provides a configurable component for handling different assets and denoms.

```tsx
import { useState } from 'React';
import { AmountInput, useAgoric } from '@agoric/react-components';

const MyBldInput = () => {
  const [value, setValue] = useState(0n);
  const { purses } = useAgoric();

  const bldPurse = purses?.find(p => p.brandPetname === 'BLD');

  return (
    <AmountInput
      className="my-input-class"
      value={value}
      onChange={setValue}
      decimalPlaces={bldPurse?.displayInfo.decimalPlaces ?? 0}
      disabled={!bldPurse}
    />
  );
};
```

If you wish to use your own custom component, the `useAmountInput` hook can be utilized
which helps convert between input strings and denominated `BigInt` values.

## Agoric Context

All Agoric-related state is accessible through the `useAgoric` hook. See [`AgoricContext`](https://github.com/Agoric/ui-kit/blob/585b47d158a983643659a2cfccd76f772933db7e/packages/react-components/src/lib/context/AgoricContext.ts#L28-L39) for the full interface.

For more details on making offers and reading chain data with `AgoricWalletConnection` and `ChainStorageWatcher`, see [Agoric/ui-kit](https://github.com/Agoric/ui-kit).
