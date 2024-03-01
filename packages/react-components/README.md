# Agoric React Components

React hooks and utilities that make writing an Agoric dapp as quick and painless as possible.

## Prequisites

See [Agoric/ui-kit#setup](https://github.com/Agoric/ui-kit?tab=readme-ov-file#setup) for setup instructions, as well as more pointers for using the `chainStorageWatcher` and `walletConnection`.

## Integrating

Getting set up is as easy as using the `AgoricProvider`. Under the hood, it uses [`cosmos-kit/react`](https://docs.cosmology.zone/cosmos-kit) to connect to your wallet provider of choice.

```tsx
import { AgoricProvider, ConnectWalletButton } from '@agoric/react-components';
import { wallets } from 'cosmos-kit';
import '@agoric/react-components/dist/style.css';

const App = () => {
  return (
    <AgoricProvider
      wallets={wallets.extension}
      defaultNetworkConfig={{
        // testChain is optional, defaulting to Agoric mainnet otherwise.
        testChain: {
          chainId: 'agoriclocal',
          chainName: 'agoric-local',
        },
        apis: {
          rest: ['http://localhost:1317'],
          rpc: ['http://localhost:26657'],
        },
      }}
    >
      <ConnectWalletButton />
    </AgoricProvider>
  );
};
```

## Connecting without `ConnectWalletButton`

```tsx
import { useAgoric } from '@agoric/react-components';

const MyCustomConnectButton = () => {
  const agoric = useAgoric();

  return <button onClick={agoric.connect}>Connect</button>;
};
```

## Node Selector

To let a user choose their own API endpoints, separate from those provided in `defaultNetworkConfig`, the `NodeSelectorModal` can be provided:

```tsx
import { useState } from 'react';
import { NodeSelectorModal } from '@agoric/react-components';

const NodeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Configure Endpoints
      </button>
      <NodeSelectorModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    </>
  );
};
```

The modal will persist the user's chosen API endpoints in local storage, and override whichever endpoints are in `defaultNetworkConfig`.

## Agoric Context

All Agoric-related state is accessible through the `useAgoric` hook. See [`AgoricContext`](https://github.com/Agoric/ui-kit/blob/585b47d158a983643659a2cfccd76f772933db7e/packages/react-components/src/lib/context/AgoricContext.ts#L28-L39) for the full interface.

For more details on making offers and reading chain data with `AgoricWalletConnection` and `ChainStorageWatcher`, see [Agoric/ui-kit](https://github.com/Agoric/ui-kit).

## Using a Custom `ChainProvider`

If you need to configure `ChainProvider` more, or have an existing `cosmos-kit` dapp that you want to add Agoric functionality to, the [`AgoricProviderLite`](https://github.com/Agoric/ui-kit/blob/585b47d158a983643659a2cfccd76f772933db7e/packages/react-components/src/lib/context/AgoricProviderLite.tsx) component can be used directly inside your own `ChainProvider`. [Under the hood](https://github.com/Agoric/ui-kit/blob/585b47d158a983643659a2cfccd76f772933db7e/packages/react-components/src/lib/context/AgoricProvider.tsx#L27-L61), `AgoricProvider` provides a default `ChainProvider` implementation and wraps `AgoricProviderLite`.
