# UI Kit
Components and tools for building graphical UIs for Agoric dapps

## Setup

These packages require SES ([learn more](https://github.com/endojs/endo/tree/master/packages/ses)).
See this [example](https://github.com/Agoric/dapp-inter/blob/main/src/main.tsx#L1) for enabling SES in your application.
Setup may vary by environment.

## Reading Contract Data (vstorage)

`makeAgoricChainStorageWatcher` can be used to subscribe to updates to vstorage.
It polls the RPC periodically, automatically batching and de-duping requests for efficiency.

See https://github.com/p2p-org/p2p-agoric-vstorage-viewer to explore vstorage more.

*package.json:*
```
"@agoric/rpc": "^0.4.1-dev-7cf64bb.0"
```


*app.ts:*
```ts
import {
  makeAgoricChainStorageWatcher,
  AgoricChainStoragePathKind as Kind
} from '@agoric/rpc';

const watcher = makeAgoricChainStorageWatcher(rpc, chainName);

// Watch vstorage children at a given node.
const stopWatching = watcher.watchLatest<string[]>(
  [Kind.Children, 'published.vaultFactory.managers',
  managerIds => {
    console.log('Got vault manager IDs:', managerIds);
  }
)

// Stop watching.
stopWatching();

// Watch vstorage data at a given node.
watcher.watchLatest<Brands>(
  [Kind.Data, 'published.agoricNames.brand',
  brands => {
    console.log('Do something with the brands');
  }
)
```

## Connecting to User's Account (Keplr)

*package.json:*
```
"@agoric/notifier": "^0.6.2",
"@agoric/rpc": "^0.4.1-dev-7cf64bb.0",
"@agoric/web-components": "0.10.1-dev-7cf64bb.0"
```

*app.ts:*
```ts
import { subscribeLatest } from '@agoric/notifier';
import { makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { makeAgoricWalletConnection } from '@agoric/web-components';

const watcher = makeAgoricChainStorageWatcher(rpc, chainName);
const connection = await makeAgoricWalletConnection(watcher);
const [pursesNotifier, publicSubscribersNotifier] = chainConnection;

for await (const purses of subscribeLatest(pursesNotifier)) {
  console.log('Got purses:', purses);
}
```

## Executing Offers

*package.json:*
```
"@agoric/rpc": "^0.4.1-dev-7cf64bb.0",
"@agoric/web-components": "0.10.1-dev-7cf64bb.0"
```

*app.ts:*
```ts
import { makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { makeAgoricWalletConnection } from '@agoric/web-components';

const watcher = makeAgoricChainStorageWatcher(rpc, chainName);
const connection = await makeAgoricWalletConnection(watcher);

const amountToGive = {brand: someBrand, value: 123n};
const amountToWant = {brand: someOtherBrand, value: 456n};

connection.makeOffer(
  {
    source: 'agoricContract',
    instancePath: ['SimpleSwapExampleInstance'],
    callPipe: [
      ['getSwapManagerForBrand', [amountToGive.brand]],
      ['makeSwapOffer']
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
    if (status === 'refunded')
      console.log('Offer refunded');
    }
    if (status === 'accepted') {
      console.log('Offer accepted');
    }
  },
);
```



