# UI Kit

Components and tools for building graphical UIs for Agoric dapps

## Setup

These packages require SES ([learn more](https://github.com/endojs/endo/tree/master/packages/ses)).
See this [example](https://github.com/Agoric/dapp-inter/blob/main/src/main.tsx#L1) for enabling SES in your application.
Setup may vary by environment.

## React Apps

See [packages/react-components](https://github.com/Agoric/ui-kit/tree/main/packages/react-components) for convenient hooks and utilities that make setting up
a React app as quick and painless as possible.

## Reading Contract Data (vstorage)

`makeAgoricChainStorageWatcher` can be used to subscribe to updates to vstorage.
It polls the RPC periodically, automatically batching and de-duping requests for efficiency.

See https://github.com/p2p-org/p2p-agoric-vstorage-viewer to explore vstorage more.

```ts
import {
  makeAgoricChainStorageWatcher,
  AgoricChainStoragePathKind as Kind,
} from '@agoric/rpc';

const watcher = makeAgoricChainStorageWatcher(restApi, chainName);

// Watch vstorage children at a given node.
const stopWatching = watcher.watchLatest<string[]>(
  [Kind.Children, 'published.vaultFactory.managers'],
  managerIds => {
    console.log('Got vault manager IDs:', managerIds);
  },
);

// Stop watching.
stopWatching();

// Watch vstorage data at a given node.
watcher.watchLatest<Brands>(
  [Kind.Data, 'published.agoricNames.brand'],
  brands => {
    console.log('Do something with the brands');
  },
);
```

## Connecting to User's Account (Keplr)

```ts
import { subscribeLatest } from '@agoric/notifier';
import { makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { makeAgoricWalletConnection } from '@agoric/web-components';

const watcher = makeAgoricChainStorageWatcher(apiAddr, chainName);
const connection = await makeAgoricWalletConnection(watcher, rpcAddr);
const { pursesNotifier, publicSubscribersNotifier } = chainConnection;

for await (const purses of subscribeLatest(pursesNotifier)) {
  console.log('Got purses:', purses);
}
```

## Using a Custom Signer

While `makeAgoricChainStorageWatcher` connects to Keplr by default, clients
that use a custom signer can provide their own:

```ts
import {
  agoricRegistryTypes,
  agoricConverters,
  makeAgoricWalletConnection,
} from '@agoric/web-components';
import { Registry } from '@cosmjs/proto-signing';
import {
  AminoTypes,
  defaultRegistryTypes,
  createBankAminoConverters,
  createAuthzAminoConverters,
} from '@cosmjs/stargate';

...

const signingStargateClient = await SigningStargateClient.connectWithSigner(
  rpcEndpoint, // RPC endpoint to use
  customAminoSigner, // E.g. window.getOfflineSignerOnlyAmino(chainId)
  {
    aminoTypes: new AminoTypes({
      ...agoricConverters,
      ...createBankAminoConverters(),
      ...createAuthzAminoConverters(),
    }),
    registry: new Registry([...defaultRegistryTypes, ...agoricRegistryTypes]),
  },
);
const agoricWalletConnection = await makeAgoricWalletConnection(
  chainStorageWatcher,
  rpcEndpoint,
  (e: unknown) => {
    console.error('wallet connection error', e);
  },
  { address: myAddress, client: signingStargateClient },
);
```

## Executing Offers

```ts
import { makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { makeAgoricWalletConnection } from '@agoric/web-components';

const watcher = makeAgoricChainStorageWatcher(apiAddr, chainName);
const connection = await makeAgoricWalletConnection(watcher, rpcAddr);

const amountToGive = { brand: someBrand, value: 123n };
const amountToWant = { brand: someOtherBrand, value: 456n };

connection.makeOffer(
  {
    source: 'agoricContract',
    instancePath: ['SimpleSwapExampleInstance'],
    callPipe: [
      ['getSwapManagerForBrand', [amountToGive.brand]],
      ['makeSwapOffer'],
    ],
  },
  {
    give: { In: amountToGive },
    want: { Out: amountToWant },
  },
  { exampleArg: 'foo' },
  ({ status, data }) => {
    if (status === 'error') {
      console.error('Offer error', data);
    }
    if (status === 'seated') {
      console.log('Transaction submitted:', data.txn);
      console.log('Offer id:', data.offerId);
    }
    if (status === 'refunded') {
      console.log('Offer refunded');
    }
    if (status === 'accepted') {
      console.log('Offer accepted');
    }
  },
);
```

## Exiting Offers

To allow users to exit long-standing offers from your dapp UI:

```ts
import { makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { makeAgoricWalletConnection } from '@agoric/web-components';

const watcher = makeAgoricChainStorageWatcher(apiAddr, chainName);
const connection = await makeAgoricWalletConnection(watcher, rpcAddr);

// Exit an offer by its id
try {
  const txn = await connection.exitOffer(offerId);
  console.log('Offer exit transaction:', txn);
} catch (error) {
  console.error('Failed to exit offer:', error);
}
```
