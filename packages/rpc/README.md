For more complete examples and setup see [Agoric/ui-kit](https://github.com/Agoric/ui-kit)

```ts
import {
  makeAgoricChainStorageWatcher,
  AgoricChainStoragePathKind as Kind,
} from '@agoric/rpc';

const watcher = makeAgoricChainStorageWatcher(rpc, chainName);

// Watch vstorage children at a given node.
const stopWatching = watcher.watchLatest<string[]>(
  [Kind.Children, 'published.vaultFactory.managers'],
  managerIds => {
    console.log('Got vault manager IDs:', managerIds);
  },
);

// Stop watching.
stopWatching();
```
