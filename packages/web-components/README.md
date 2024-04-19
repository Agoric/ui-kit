For complete examples and setup see [Agoric/ui-kit](https://github.com/Agoric/ui-kit)

```ts
import { subscribeLatest } from '@agoric/notifier';
import { makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { makeAgoricWalletConnection } from '@agoric/web-components';

const watcher = makeAgoricChainStorageWatcher(rpc, chainName);
const connection = await makeAgoricWalletConnection(watcher);
const { pursesNotifier, publicSubscribersNotifier } = chainConnection;

// Sign an on-chain offer transaction.
connection.makeOffer(...offer);

// Read the user's token balances.
for await (const purses of subscribeLatest(pursesNotifier)) {
  console.log('Got user purses:', purses);
}
```
