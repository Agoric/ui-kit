# Agoric React Components

React hooks and utilities that make writing an Agoric dapp as quick and painless as possible.

## Prequisites

See [Agoric/ui-kit#setup](https://github.com/Agoric/ui-kit?tab=readme-ov-file#setup) for setup instructions, as well as more pointers for using the `chainStorageWatcher` and `walletConnection`.

## Integrating

Getting set up is as easy as using the `AgoricProvider`. Under the hood, it uses [`cosmos-kit/react`](https://docs.cosmology.zone/cosmos-kit) to connect to your wallet provider of choice.

```tsx
import { AgoricProvider, ConnectWalletButton } from '@agoric/react-components';
import { wallets } from 'cosmos-kit';
import { ThemeProvider, useTheme } from '@interchain-ui/react';
import '@agoric/react-components/dist/style.css';

const localnet = {
  testChain: {
    chainId: 'agoriclocal',
    chainName: 'agoric-local',
  },
  apis: {
    rest: ['http://localhost:1317'],
    rpc: ['http://localhost:26657'],
    iconUrl: '/agoriclocal.svg', // Optional icon for Network Dropdown component
  },
};

// Omit "testChain" to specify the apis for Agoric Mainnet.
const mainnet = {
  apis: {
    rest: ['https://main.api.agoric.net'],
    rpc: ['https://main.rpc.agoric.net'],
  },
};

const App = () => {
  const { themeClass } = useTheme();
  return (
    <ThemeProvider>
      <div className={themeClass}>
        <AgoricProvider
          wallets={wallets.extension}
          agoricNetworkConfigs={[localnet, mainnet]}
          /**
           * If unspecified, connects to Agoric Mainnet by default.
           * See "Network Dropdown" below to see how to switch between Agoric testnets.
           */
          defaultChainName="agoric-local"
        >
          <ConnectWalletButton />
        </AgoricProvider>
      </div>
    </ThemeProvider>
  );
};
```

## Connecting without `ConnectWalletButton`

While the example above uses the premade `ConnectWalletButton`, the `useAgoric`
hook can also be used instead.

```tsx
import { useAgoric } from '@agoric/react-components';

const MyCustomConnectButton = () => {
  const agoric = useAgoric();

  return <button onClick={agoric.connect}>Connect</button>;
};
```

## Amount Inputs

The `AmountInput` provides a configurable component for handling different assets and denoms.

```tsx
import { useState } from 'React';
import { AmountInput, useAgoric } from '@agoric/react-components';

const MyIstInput = () => {
  const [value, setValue] = useState(0n);
  const { purses } = useAgoric();

  const istPurse = purses?.find(p => p.brandPetname === 'IST');

  return (
    <AmountInput
      className="my-input-class"
      value={value}
      onChange={setValue}
      decimalPlaces={istPurse?.displayInfo.decimalPlaces ?? 0}
      disabled={!istPurse}
    />
  );
};
```

If you wish to use your own custom component, the `useAmountInput` hook can be utilized
which helps convert between input strings and denominated `BigInt` values.

## Node Selector

To let a user choose their own API endpoints, separate from those provided in `agoricNetworkConfigs`, the `NodeSelectorModal` can be provided:

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

The modal will persist the user's chosen API endpoints in local storage, and override whichever endpoints are specified for the current network in `agoricNetworkConfigs`.

## Network Dropdown

To support multiple Agoric test networks, the `NetworkDropdown` component can
be used. It will let the user choose between the networks provided in `agoricNetworkConfigs`, save their choice to local storage, and override `defaultChainName` when choosing the network to connect to. It uses the `interchain-ui`
[`ChangeChainCombobox`](https://cosmology.zone/components?id=change-chain-combobox)
and requires the `ThemeProvider` (see [Integrating](#integrating) above):

```tsx
import { NetworkDropdown } from '@agoric/react-components';

const MyNetworkSelect = () => {
  return (
    <NetworkDropdown
      appearance="minimal"
      size="sm"
      label="Switch Agoric Networks"
    />
  );
};
```

## Leap Elements

The `OnboardIstModal` component provides an easy way for users to acquire IST through interchain swaps, bridging, IBC, and more with [Leap Elements](https://docs.leapwallet.io/cosmos/elements/introduction).

If you wish to use Leap Elements in another context, the `useElementsWalletClient` hook provides a wallet client to plug into your own instance of Elements.

```tsx
import { useElementsWalletClient, useAgoric } from '@agoric/react-components';
import { LiquidityModal } from '@leapwallet/elements';
import '@leapwallet/elements/styles.css';

const MyElementModal = () => {
  const { address } = useAgoric();
  const elementsWalletClient = useElementsWalletClient();

  return (
    <LiquidityModal
      walletClientConfig={{
        userAddress: address,
        walletClient: elementsWalletClient,
        connectWallet: (chainId?: string) => {
          return elementsWalletClient.enable(chainId ?? []);
        }
      }}
      ...
    >
    ...
  )
}
```

## Agoric Context

All Agoric-related state is accessible through the `useAgoric` hook. See [`AgoricContext`](https://github.com/Agoric/ui-kit/blob/585b47d158a983643659a2cfccd76f772933db7e/packages/react-components/src/lib/context/AgoricContext.ts#L28-L39) for the full interface.

For more details on making offers and reading chain data with `AgoricWalletConnection` and `ChainStorageWatcher`, see [Agoric/ui-kit](https://github.com/Agoric/ui-kit).

## Smart Wallet Provisioning

For users that don't have a smart wallet provisioned, the `makeOffer` function from the
`useAgoric` hook will automatically show a modal informing them of the provisioning fee, showing their IST balance, and providing
a [Leap Elements](#leap-elements) button to acquire IST if necessary before signing the transaction. The text content of this modal is configurable through the `provisionNoticeContent` prop in `AgoricProvider`. If this modal
is not desired, the `makeOfferWithoutModal` function can be used instead, and the provision status and fee can be accessed with `isSmartWalletProvisioned` and `smartWalletProvisionFee` from the `useAgoric` hook.

## Using a Custom `ChainProvider`

If you need to configure `ChainProvider` more, or have an existing `cosmos-kit` dapp that you want to add Agoric functionality to, the [`AgoricProviderLite`](https://github.com/Agoric/ui-kit/blob/585b47d158a983643659a2cfccd76f772933db7e/packages/react-components/src/lib/context/AgoricProviderLite.tsx) component can be used directly inside your own `ChainProvider`. [Under the hood](https://github.com/Agoric/ui-kit/blob/585b47d158a983643659a2cfccd76f772933db7e/packages/react-components/src/lib/context/AgoricProvider.tsx#L27-L61), `AgoricProvider` provides a default `ChainProvider` implementation and wraps `AgoricProviderLite`.
