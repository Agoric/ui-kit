# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.14.0 (2023-12-15)

### ⚠ BREAKING CHANGES

- dont batch queries
- make wallet work without rpc from watcher

### Features

- dont batch queries ([ebfc261](https://github.com/Agoric/ui-kit/commit/ebfc261fb7e7595c29190f41b705708038a8a347))
- make wallet work without rpc from watcher ([96d00f0](https://github.com/Agoric/ui-kit/commit/96d00f0d84ae65f80d7d2d6b14f078dc86a33575))
- surface wallet connection errors ([#66](https://github.com/Agoric/ui-kit/issues/66)) ([6a4c62e](https://github.com/Agoric/ui-kit/commit/6a4c62e2608e4b32fe9ced17745a7ce4e064d2d0))

### Bug Fixes

- handle failed offer status updates better ([#63](https://github.com/Agoric/ui-kit/issues/63)) ([42625b2](https://github.com/Agoric/ui-kit/commit/42625b2ec7336fbbb6340bc0d52e6ce150cc46c5))

## [0.13.2](https://github.com/Agoric/ui-kit/compare/@agoric/web-components@0.13.0...@agoric/web-components@0.13.2) (2023-11-16)

### Bug Fixes

- dont throw on missing smart wallet ([7efe070](https://github.com/Agoric/ui-kit/commit/7efe0701e04148c7d6af3c2218cf4b655bc86c57))

## 0.13.0 (2023-09-26)

### ⚠ BREAKING CHANGES

- remove web dev server
- remove obsolete web components

### Features

- batch rpc wallet connection ([933b31c](https://github.com/Agoric/ui-kit/commit/933b31c388b9908c1a6ca569dc3974effb7ddab6))
- show default wallet url in connection component ([58ce9e0](https://github.com/Agoric/ui-kit/commit/58ce9e02af89b798674347926c00b37090115889))
- suggest chain ([8e1d7e9](https://github.com/Agoric/ui-kit/commit/8e1d7e9dfc2704f0fd2aebac732ba53384da99b6))
- support non-vbank purses ([#37](https://github.com/Agoric/ui-kit/issues/37)) ([e2665de](https://github.com/Agoric/ui-kit/commit/e2665deeb83c335fd672dba8b17a453ea1498250))
- support offer signing with keplr ([8ccda1d](https://github.com/Agoric/ui-kit/commit/8ccda1d1019201ba00691237fa594b91b73de92c))
- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/ui-kit/issues/5750)) ([7b3dfee](https://github.com/Agoric/ui-kit/commit/7b3dfeef17c779f1604499f2d86ef1b161c86fa5))
- **WalletConnection:** reset connection after connect timeout ([f9360d4](https://github.com/Agoric/ui-kit/commit/f9360d4dcb51239d76a51d5483b09806844791be))
- **WalletConnection:** reset connection if bridge is closed ([4787fde](https://github.com/Agoric/ui-kit/commit/4787fde6075db1c380148aa16f3b883b1ee49332))
- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/ui-kit/issues/6452)) ([68e3539](https://github.com/Agoric/ui-kit/commit/68e35394f4db2ce03283a9cef1b1194bc51ce979))
- **web-components:** add petimage component ([5b3d097](https://github.com/Agoric/ui-kit/commit/5b3d0978ee57433fe0521c3f59db0f202cc49481))
- **web-components:** Add Powerbox-compatible petname component ([20796d1](https://github.com/Agoric/ui-kit/commit/20796d125b3b4a489a19202f87405031370eea34))
- **web-components:** allow custom import context ([f764e8c](https://github.com/Agoric/ui-kit/commit/f764e8c8569664766144042475686bcad8514694))
- **web-components:** provide `makeDefaultLeader` for Casting ([5a4f4f4](https://github.com/Agoric/ui-kit/commit/5a4f4f4bd4ae9e7103305cba359b68fe46f56d0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/ui-kit/issues/6861)) ([63ad6bc](https://github.com/Agoric/ui-kit/commit/63ad6bc5eb7c5e785c253d7a2568cb8dbbc7d978))
- **web-components:** read wallet offer public subscribers ([b1aeafc](https://github.com/Agoric/ui-kit/commit/b1aeafcfa83b1038f34dfe63cc50d10a80838749))
- **web-components:** reset after connection problem ([01d84cb](https://github.com/Agoric/ui-kit/commit/01d84cb9fff5d0d6792235be88f1e3d216931b91))
- **web-components:** send a cache function in the events ([514fc04](https://github.com/Agoric/ui-kit/commit/514fc04fa3d8a77b3a57fa37ff388f9240051dff))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/ui-kit/issues/6079)) ([872af6f](https://github.com/Agoric/ui-kit/commit/872af6fb5d68970b570086847532a0ff931330c2))
- Enhance TypeScript node_modules traversal depth ([4407822](https://github.com/Agoric/ui-kit/commit/440782258b8f849c851d403ca2e38e781a52c5a3))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/ui-kit/issues/5922)) ([57a5eb0](https://github.com/Agoric/ui-kit/commit/57a5eb0736d3d6582dbfc9a15bf9cd1a496dbcf4))
- log warning instead of throwing ([6247311](https://github.com/Agoric/ui-kit/commit/6247311e55d4dd10b67d7357ba4ad8b557614d51))
- makePublishKit ([#5435](https://github.com/Agoric/ui-kit/issues/5435)) ([ba1365f](https://github.com/Agoric/ui-kit/commit/ba1365fbafb8e71bd3221fe593dc13c49167d5cb))
- publish notifier not notifierKit ([74299fa](https://github.com/Agoric/ui-kit/commit/74299fa620f2c374e0c393e936ba055fb7a026a7))
- Remove lockdown unsafe monkey-patching hack ([18eaeb5](https://github.com/Agoric/ui-kit/commit/18eaeb5c7c7df5278dc3bf99aa47c3e83724927f))
- resolve wallet connection for empty wallet data ([#11](https://github.com/Agoric/ui-kit/issues/11)) ([ebf5d0a](https://github.com/Agoric/ui-kit/commit/ebf5d0afa1d832ef5f99b1d7a83da82debd1f9de))
- update for `[@jessie](https://github.com/jessie).js/safe-await-separator` ([6d7e287](https://github.com/Agoric/ui-kit/commit/6d7e287fccf77d8a5a7a33812c0b935734d7c611))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/ui-kit/issues/5485)) ([d199f4a](https://github.com/Agoric/ui-kit/commit/d199f4ad1378cf037fe337b1cbca307096a39e61))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/ui-kit/issues/5984)) ([134a7eb](https://github.com/Agoric/ui-kit/commit/134a7eb4938623ac8f322cc6883b27a22b62568b))
- **web-components:** add 100ms delay to deflake test ([3d3853c](https://github.com/Agoric/ui-kit/commit/3d3853cd18390057824536c454e052e0a67e6052))
- **web-components:** attempt to de-flake test ([c38c572](https://github.com/Agoric/ui-kit/commit/c38c572d4fe50719933ca29e4367e1337d786208))
- **web-components:** fix change in update warning ([80971a1](https://github.com/Agoric/ui-kit/commit/80971a13b741022bba3febf023fa3a00dd3d07df))

### Miscellaneous Chores

- remove obsolete web components ([ac00c0d](https://github.com/Agoric/ui-kit/commit/ac00c0d8d044eeec97f672b3bb6415342f1e2a87))
- remove web dev server ([368bc1f](https://github.com/Agoric/ui-kit/commit/368bc1f33dcee146790db8c3aca7db4aa067a416))

## 0.12.0 (2023-08-31)

### ⚠ BREAKING CHANGES

- remove web dev server
- remove obsolete web components

### Features

- batch rpc wallet connection ([933b31c](https://github.com/Agoric/ui-kit/commit/933b31c388b9908c1a6ca569dc3974effb7ddab6))
- show default wallet url in connection component ([58ce9e0](https://github.com/Agoric/ui-kit/commit/58ce9e02af89b798674347926c00b37090115889))
- suggest chain ([8e1d7e9](https://github.com/Agoric/ui-kit/commit/8e1d7e9dfc2704f0fd2aebac732ba53384da99b6))
- support non-vbank purses ([#37](https://github.com/Agoric/ui-kit/issues/37)) ([e2665de](https://github.com/Agoric/ui-kit/commit/e2665deeb83c335fd672dba8b17a453ea1498250))
- support offer signing with keplr ([8ccda1d](https://github.com/Agoric/ui-kit/commit/8ccda1d1019201ba00691237fa594b91b73de92c))
- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/ui-kit/issues/5750)) ([7b3dfee](https://github.com/Agoric/ui-kit/commit/7b3dfeef17c779f1604499f2d86ef1b161c86fa5))
- **WalletConnection:** reset connection after connect timeout ([f9360d4](https://github.com/Agoric/ui-kit/commit/f9360d4dcb51239d76a51d5483b09806844791be))
- **WalletConnection:** reset connection if bridge is closed ([4787fde](https://github.com/Agoric/ui-kit/commit/4787fde6075db1c380148aa16f3b883b1ee49332))
- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/ui-kit/issues/6452)) ([68e3539](https://github.com/Agoric/ui-kit/commit/68e35394f4db2ce03283a9cef1b1194bc51ce979))
- **web-components:** add petimage component ([5b3d097](https://github.com/Agoric/ui-kit/commit/5b3d0978ee57433fe0521c3f59db0f202cc49481))
- **web-components:** Add Powerbox-compatible petname component ([20796d1](https://github.com/Agoric/ui-kit/commit/20796d125b3b4a489a19202f87405031370eea34))
- **web-components:** allow custom import context ([f764e8c](https://github.com/Agoric/ui-kit/commit/f764e8c8569664766144042475686bcad8514694))
- **web-components:** provide `makeDefaultLeader` for Casting ([5a4f4f4](https://github.com/Agoric/ui-kit/commit/5a4f4f4bd4ae9e7103305cba359b68fe46f56d0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/ui-kit/issues/6861)) ([63ad6bc](https://github.com/Agoric/ui-kit/commit/63ad6bc5eb7c5e785c253d7a2568cb8dbbc7d978))
- **web-components:** read wallet offer public subscribers ([b1aeafc](https://github.com/Agoric/ui-kit/commit/b1aeafcfa83b1038f34dfe63cc50d10a80838749))
- **web-components:** reset after connection problem ([01d84cb](https://github.com/Agoric/ui-kit/commit/01d84cb9fff5d0d6792235be88f1e3d216931b91))
- **web-components:** send a cache function in the events ([514fc04](https://github.com/Agoric/ui-kit/commit/514fc04fa3d8a77b3a57fa37ff388f9240051dff))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/ui-kit/issues/6079)) ([872af6f](https://github.com/Agoric/ui-kit/commit/872af6fb5d68970b570086847532a0ff931330c2))
- Enhance TypeScript node_modules traversal depth ([4407822](https://github.com/Agoric/ui-kit/commit/440782258b8f849c851d403ca2e38e781a52c5a3))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/ui-kit/issues/5922)) ([57a5eb0](https://github.com/Agoric/ui-kit/commit/57a5eb0736d3d6582dbfc9a15bf9cd1a496dbcf4))
- log warning instead of throwing ([6247311](https://github.com/Agoric/ui-kit/commit/6247311e55d4dd10b67d7357ba4ad8b557614d51))
- makePublishKit ([#5435](https://github.com/Agoric/ui-kit/issues/5435)) ([ba1365f](https://github.com/Agoric/ui-kit/commit/ba1365fbafb8e71bd3221fe593dc13c49167d5cb))
- Remove lockdown unsafe monkey-patching hack ([18eaeb5](https://github.com/Agoric/ui-kit/commit/18eaeb5c7c7df5278dc3bf99aa47c3e83724927f))
- resolve wallet connection for empty wallet data ([#11](https://github.com/Agoric/ui-kit/issues/11)) ([ebf5d0a](https://github.com/Agoric/ui-kit/commit/ebf5d0afa1d832ef5f99b1d7a83da82debd1f9de))
- update for `[@jessie](https://github.com/jessie).js/safe-await-separator` ([6d7e287](https://github.com/Agoric/ui-kit/commit/6d7e287fccf77d8a5a7a33812c0b935734d7c611))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/ui-kit/issues/5485)) ([d199f4a](https://github.com/Agoric/ui-kit/commit/d199f4ad1378cf037fe337b1cbca307096a39e61))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/ui-kit/issues/5984)) ([134a7eb](https://github.com/Agoric/ui-kit/commit/134a7eb4938623ac8f322cc6883b27a22b62568b))
- **web-components:** add 100ms delay to deflake test ([3d3853c](https://github.com/Agoric/ui-kit/commit/3d3853cd18390057824536c454e052e0a67e6052))
- **web-components:** attempt to de-flake test ([c38c572](https://github.com/Agoric/ui-kit/commit/c38c572d4fe50719933ca29e4367e1337d786208))
- **web-components:** fix change in update warning ([80971a1](https://github.com/Agoric/ui-kit/commit/80971a13b741022bba3febf023fa3a00dd3d07df))

### Miscellaneous Chores

- remove obsolete web components ([ac00c0d](https://github.com/Agoric/ui-kit/commit/ac00c0d8d044eeec97f672b3bb6415342f1e2a87))
- remove web dev server ([368bc1f](https://github.com/Agoric/ui-kit/commit/368bc1f33dcee146790db8c3aca7db4aa067a416))

## 0.11.0 (2023-08-19)

### ⚠ BREAKING CHANGES

- remove web dev server
- remove obsolete web components

### Features

- suggest chain ([8e1d7e9](https://github.com/Agoric/ui-kit/commit/8e1d7e9dfc2704f0fd2aebac732ba53384da99b6))
- batch rpc wallet connection ([933b31c](https://github.com/Agoric/ui-kit/commit/933b31c388b9908c1a6ca569dc3974effb7ddab6))
- show default wallet url in connection component ([58ce9e0](https://github.com/Agoric/ui-kit/commit/58ce9e02af89b798674347926c00b37090115889))
- support offer signing with keplr ([8ccda1d](https://github.com/Agoric/ui-kit/commit/8ccda1d1019201ba00691237fa594b91b73de92c))
- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/ui-kit/issues/5750)) ([7b3dfee](https://github.com/Agoric/ui-kit/commit/7b3dfeef17c779f1604499f2d86ef1b161c86fa5))
- **WalletConnection:** reset connection after connect timeout ([f9360d4](https://github.com/Agoric/ui-kit/commit/f9360d4dcb51239d76a51d5483b09806844791be))
- **WalletConnection:** reset connection if bridge is closed ([4787fde](https://github.com/Agoric/ui-kit/commit/4787fde6075db1c380148aa16f3b883b1ee49332))
- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/ui-kit/issues/6452)) ([68e3539](https://github.com/Agoric/ui-kit/commit/68e35394f4db2ce03283a9cef1b1194bc51ce979))
- **web-components:** add petimage component ([5b3d097](https://github.com/Agoric/ui-kit/commit/5b3d0978ee57433fe0521c3f59db0f202cc49481))
- **web-components:** Add Powerbox-compatible petname component ([20796d1](https://github.com/Agoric/ui-kit/commit/20796d125b3b4a489a19202f87405031370eea34))
- **web-components:** allow custom import context ([f764e8c](https://github.com/Agoric/ui-kit/commit/f764e8c8569664766144042475686bcad8514694))
- **web-components:** provide `makeDefaultLeader` for Casting ([5a4f4f4](https://github.com/Agoric/ui-kit/commit/5a4f4f4bd4ae9e7103305cba359b68fe46f56d0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/ui-kit/issues/6861)) ([63ad6bc](https://github.com/Agoric/ui-kit/commit/63ad6bc5eb7c5e785c253d7a2568cb8dbbc7d978))
- **web-components:** read wallet offer public subscribers ([b1aeafc](https://github.com/Agoric/ui-kit/commit/b1aeafcfa83b1038f34dfe63cc50d10a80838749))
- **web-components:** reset after connection problem ([01d84cb](https://github.com/Agoric/ui-kit/commit/01d84cb9fff5d0d6792235be88f1e3d216931b91))
- **web-components:** send a cache function in the events ([514fc04](https://github.com/Agoric/ui-kit/commit/514fc04fa3d8a77b3a57fa37ff388f9240051dff))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/ui-kit/issues/6079)) ([872af6f](https://github.com/Agoric/ui-kit/commit/872af6fb5d68970b570086847532a0ff931330c2))
- Enhance TypeScript node_modules traversal depth ([4407822](https://github.com/Agoric/ui-kit/commit/440782258b8f849c851d403ca2e38e781a52c5a3))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/ui-kit/issues/5922)) ([57a5eb0](https://github.com/Agoric/ui-kit/commit/57a5eb0736d3d6582dbfc9a15bf9cd1a496dbcf4))
- log warning instead of throwing ([6247311](https://github.com/Agoric/ui-kit/commit/6247311e55d4dd10b67d7357ba4ad8b557614d51))
- makePublishKit ([#5435](https://github.com/Agoric/ui-kit/issues/5435)) ([ba1365f](https://github.com/Agoric/ui-kit/commit/ba1365fbafb8e71bd3221fe593dc13c49167d5cb))
- Remove lockdown unsafe monkey-patching hack ([18eaeb5](https://github.com/Agoric/ui-kit/commit/18eaeb5c7c7df5278dc3bf99aa47c3e83724927f))
- resolve wallet connection for empty wallet data ([#11](https://github.com/Agoric/ui-kit/issues/11)) ([ebf5d0a](https://github.com/Agoric/ui-kit/commit/ebf5d0afa1d832ef5f99b1d7a83da82debd1f9de))
- update for `[@jessie](https://github.com/jessie).js/safe-await-separator` ([6d7e287](https://github.com/Agoric/ui-kit/commit/6d7e287fccf77d8a5a7a33812c0b935734d7c611))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/ui-kit/issues/5485)) ([d199f4a](https://github.com/Agoric/ui-kit/commit/d199f4ad1378cf037fe337b1cbca307096a39e61))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/ui-kit/issues/5984)) ([134a7eb](https://github.com/Agoric/ui-kit/commit/134a7eb4938623ac8f322cc6883b27a22b62568b))
- **web-components:** add 100ms delay to deflake test ([3d3853c](https://github.com/Agoric/ui-kit/commit/3d3853cd18390057824536c454e052e0a67e6052))
- **web-components:** attempt to de-flake test ([c38c572](https://github.com/Agoric/ui-kit/commit/c38c572d4fe50719933ca29e4367e1337d786208))
- **web-components:** fix change in update warning ([80971a1](https://github.com/Agoric/ui-kit/commit/80971a13b741022bba3febf023fa3a00dd3d07df))

### Miscellaneous Chores

- remove obsolete web components ([ac00c0d](https://github.com/Agoric/ui-kit/commit/ac00c0d8d044eeec97f672b3bb6415342f1e2a87))
- remove web dev server ([368bc1f](https://github.com/Agoric/ui-kit/commit/368bc1f33dcee146790db8c3aca7db4aa067a416))

## 0.10.0 (2023-07-10)

### ⚠ BREAKING CHANGES

- remove web dev server
- remove obsolete web components

### Features

- batch rpc wallet connection ([933b31c](https://github.com/Agoric/ui-kit/commit/933b31c388b9908c1a6ca569dc3974effb7ddab6))
- show default wallet url in connection component ([58ce9e0](https://github.com/Agoric/ui-kit/commit/58ce9e02af89b798674347926c00b37090115889))
- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/ui-kit/issues/5750)) ([7b3dfee](https://github.com/Agoric/ui-kit/commit/7b3dfeef17c779f1604499f2d86ef1b161c86fa5))
- **WalletConnection:** reset connection after connect timeout ([f9360d4](https://github.com/Agoric/ui-kit/commit/f9360d4dcb51239d76a51d5483b09806844791be))
- **WalletConnection:** reset connection if bridge is closed ([4787fde](https://github.com/Agoric/ui-kit/commit/4787fde6075db1c380148aa16f3b883b1ee49332))
- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/ui-kit/issues/6452)) ([68e3539](https://github.com/Agoric/ui-kit/commit/68e35394f4db2ce03283a9cef1b1194bc51ce979))
- **web-components:** add petimage component ([5b3d097](https://github.com/Agoric/ui-kit/commit/5b3d0978ee57433fe0521c3f59db0f202cc49481))
- **web-components:** Add Powerbox-compatible petname component ([20796d1](https://github.com/Agoric/ui-kit/commit/20796d125b3b4a489a19202f87405031370eea34))
- **web-components:** allow custom import context ([f764e8c](https://github.com/Agoric/ui-kit/commit/f764e8c8569664766144042475686bcad8514694))
- **web-components:** provide `makeDefaultLeader` for Casting ([5a4f4f4](https://github.com/Agoric/ui-kit/commit/5a4f4f4bd4ae9e7103305cba359b68fe46f56d0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/ui-kit/issues/6861)) ([63ad6bc](https://github.com/Agoric/ui-kit/commit/63ad6bc5eb7c5e785c253d7a2568cb8dbbc7d978))
- **web-components:** read wallet offer public subscribers ([b1aeafc](https://github.com/Agoric/ui-kit/commit/b1aeafcfa83b1038f34dfe63cc50d10a80838749))
- **web-components:** reset after connection problem ([01d84cb](https://github.com/Agoric/ui-kit/commit/01d84cb9fff5d0d6792235be88f1e3d216931b91))
- **web-components:** send a cache function in the events ([514fc04](https://github.com/Agoric/ui-kit/commit/514fc04fa3d8a77b3a57fa37ff388f9240051dff))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/ui-kit/issues/6079)) ([872af6f](https://github.com/Agoric/ui-kit/commit/872af6fb5d68970b570086847532a0ff931330c2))
- Enhance TypeScript node_modules traversal depth ([4407822](https://github.com/Agoric/ui-kit/commit/440782258b8f849c851d403ca2e38e781a52c5a3))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/ui-kit/issues/5922)) ([57a5eb0](https://github.com/Agoric/ui-kit/commit/57a5eb0736d3d6582dbfc9a15bf9cd1a496dbcf4))
- log warning instead of throwing ([6247311](https://github.com/Agoric/ui-kit/commit/6247311e55d4dd10b67d7357ba4ad8b557614d51))
- makePublishKit ([#5435](https://github.com/Agoric/ui-kit/issues/5435)) ([ba1365f](https://github.com/Agoric/ui-kit/commit/ba1365fbafb8e71bd3221fe593dc13c49167d5cb))
- Remove lockdown unsafe monkey-patching hack ([18eaeb5](https://github.com/Agoric/ui-kit/commit/18eaeb5c7c7df5278dc3bf99aa47c3e83724927f))
- resolve wallet connection for empty wallet data ([#11](https://github.com/Agoric/ui-kit/issues/11)) ([ebf5d0a](https://github.com/Agoric/ui-kit/commit/ebf5d0afa1d832ef5f99b1d7a83da82debd1f9de))
- update for `[@jessie](https://github.com/jessie).js/safe-await-separator` ([6d7e287](https://github.com/Agoric/ui-kit/commit/6d7e287fccf77d8a5a7a33812c0b935734d7c611))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/ui-kit/issues/5485)) ([d199f4a](https://github.com/Agoric/ui-kit/commit/d199f4ad1378cf037fe337b1cbca307096a39e61))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/ui-kit/issues/5984)) ([134a7eb](https://github.com/Agoric/ui-kit/commit/134a7eb4938623ac8f322cc6883b27a22b62568b))
- **web-components:** add 100ms delay to deflake test ([3d3853c](https://github.com/Agoric/ui-kit/commit/3d3853cd18390057824536c454e052e0a67e6052))
- **web-components:** attempt to de-flake test ([c38c572](https://github.com/Agoric/ui-kit/commit/c38c572d4fe50719933ca29e4367e1337d786208))
- **web-components:** fix change in update warning ([80971a1](https://github.com/Agoric/ui-kit/commit/80971a13b741022bba3febf023fa3a00dd3d07df))

### Miscellaneous Chores

- remove obsolete web components ([ac00c0d](https://github.com/Agoric/ui-kit/commit/ac00c0d8d044eeec97f672b3bb6415342f1e2a87))
- remove web dev server ([368bc1f](https://github.com/Agoric/ui-kit/commit/368bc1f33dcee146790db8c3aca7db4aa067a416))

## 0.9.0 (2023-06-29)

### ⚠ BREAKING CHANGES

- remove web dev server
- remove obsolete web components

### Features

- batch rpc wallet connection ([933b31c](https://github.com/Agoric/ui-kit/commit/933b31c388b9908c1a6ca569dc3974effb7ddab6))
- show default wallet url in connection component ([58ce9e0](https://github.com/Agoric/ui-kit/commit/58ce9e02af89b798674347926c00b37090115889))
- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/ui-kit/issues/5750)) ([7b3dfee](https://github.com/Agoric/ui-kit/commit/7b3dfeef17c779f1604499f2d86ef1b161c86fa5))
- **WalletConnection:** reset connection after connect timeout ([f9360d4](https://github.com/Agoric/ui-kit/commit/f9360d4dcb51239d76a51d5483b09806844791be))
- **WalletConnection:** reset connection if bridge is closed ([4787fde](https://github.com/Agoric/ui-kit/commit/4787fde6075db1c380148aa16f3b883b1ee49332))
- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/ui-kit/issues/6452)) ([68e3539](https://github.com/Agoric/ui-kit/commit/68e35394f4db2ce03283a9cef1b1194bc51ce979))
- **web-components:** add petimage component ([5b3d097](https://github.com/Agoric/ui-kit/commit/5b3d0978ee57433fe0521c3f59db0f202cc49481))
- **web-components:** Add Powerbox-compatible petname component ([20796d1](https://github.com/Agoric/ui-kit/commit/20796d125b3b4a489a19202f87405031370eea34))
- **web-components:** allow custom import context ([f764e8c](https://github.com/Agoric/ui-kit/commit/f764e8c8569664766144042475686bcad8514694))
- **web-components:** provide `makeDefaultLeader` for Casting ([5a4f4f4](https://github.com/Agoric/ui-kit/commit/5a4f4f4bd4ae9e7103305cba359b68fe46f56d0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/ui-kit/issues/6861)) ([63ad6bc](https://github.com/Agoric/ui-kit/commit/63ad6bc5eb7c5e785c253d7a2568cb8dbbc7d978))
- **web-components:** read wallet offer public subscribers ([b1aeafc](https://github.com/Agoric/ui-kit/commit/b1aeafcfa83b1038f34dfe63cc50d10a80838749))
- **web-components:** reset after connection problem ([01d84cb](https://github.com/Agoric/ui-kit/commit/01d84cb9fff5d0d6792235be88f1e3d216931b91))
- **web-components:** send a cache function in the events ([514fc04](https://github.com/Agoric/ui-kit/commit/514fc04fa3d8a77b3a57fa37ff388f9240051dff))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/ui-kit/issues/6079)) ([872af6f](https://github.com/Agoric/ui-kit/commit/872af6fb5d68970b570086847532a0ff931330c2))
- Enhance TypeScript node_modules traversal depth ([4407822](https://github.com/Agoric/ui-kit/commit/440782258b8f849c851d403ca2e38e781a52c5a3))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/ui-kit/issues/5922)) ([57a5eb0](https://github.com/Agoric/ui-kit/commit/57a5eb0736d3d6582dbfc9a15bf9cd1a496dbcf4))
- log warning instead of throwing ([6247311](https://github.com/Agoric/ui-kit/commit/6247311e55d4dd10b67d7357ba4ad8b557614d51))
- makePublishKit ([#5435](https://github.com/Agoric/ui-kit/issues/5435)) ([ba1365f](https://github.com/Agoric/ui-kit/commit/ba1365fbafb8e71bd3221fe593dc13c49167d5cb))
- Remove lockdown unsafe monkey-patching hack ([18eaeb5](https://github.com/Agoric/ui-kit/commit/18eaeb5c7c7df5278dc3bf99aa47c3e83724927f))
- resolve wallet connection for empty wallet data ([#11](https://github.com/Agoric/ui-kit/issues/11)) ([ebf5d0a](https://github.com/Agoric/ui-kit/commit/ebf5d0afa1d832ef5f99b1d7a83da82debd1f9de))
- update for `[@jessie](https://github.com/jessie).js/safe-await-separator` ([6d7e287](https://github.com/Agoric/ui-kit/commit/6d7e287fccf77d8a5a7a33812c0b935734d7c611))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/ui-kit/issues/5485)) ([d199f4a](https://github.com/Agoric/ui-kit/commit/d199f4ad1378cf037fe337b1cbca307096a39e61))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/ui-kit/issues/5984)) ([134a7eb](https://github.com/Agoric/ui-kit/commit/134a7eb4938623ac8f322cc6883b27a22b62568b))
- **web-components:** add 100ms delay to deflake test ([3d3853c](https://github.com/Agoric/ui-kit/commit/3d3853cd18390057824536c454e052e0a67e6052))
- **web-components:** attempt to de-flake test ([c38c572](https://github.com/Agoric/ui-kit/commit/c38c572d4fe50719933ca29e4367e1337d786208))
- **web-components:** fix change in update warning ([80971a1](https://github.com/Agoric/ui-kit/commit/80971a13b741022bba3febf023fa3a00dd3d07df))

### Miscellaneous Chores

- remove obsolete web components ([ac00c0d](https://github.com/Agoric/ui-kit/commit/ac00c0d8d044eeec97f672b3bb6415342f1e2a87))
- remove web dev server ([368bc1f](https://github.com/Agoric/ui-kit/commit/368bc1f33dcee146790db8c3aca7db4aa067a416))

## 0.8.0 (2023-06-29)

### ⚠ BREAKING CHANGES

- remove web dev server
- remove obsolete web components

### Features

- batch rpc wallet connection ([933b31c](https://github.com/Agoric/ui-kit/commit/933b31c388b9908c1a6ca569dc3974effb7ddab6))
- show default wallet url in connection component ([58ce9e0](https://github.com/Agoric/ui-kit/commit/58ce9e02af89b798674347926c00b37090115889))
- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/ui-kit/issues/5750)) ([7b3dfee](https://github.com/Agoric/ui-kit/commit/7b3dfeef17c779f1604499f2d86ef1b161c86fa5))
- **WalletConnection:** reset connection after connect timeout ([f9360d4](https://github.com/Agoric/ui-kit/commit/f9360d4dcb51239d76a51d5483b09806844791be))
- **WalletConnection:** reset connection if bridge is closed ([4787fde](https://github.com/Agoric/ui-kit/commit/4787fde6075db1c380148aa16f3b883b1ee49332))
- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/ui-kit/issues/6452)) ([68e3539](https://github.com/Agoric/ui-kit/commit/68e35394f4db2ce03283a9cef1b1194bc51ce979))
- **web-components:** add petimage component ([5b3d097](https://github.com/Agoric/ui-kit/commit/5b3d0978ee57433fe0521c3f59db0f202cc49481))
- **web-components:** Add Powerbox-compatible petname component ([20796d1](https://github.com/Agoric/ui-kit/commit/20796d125b3b4a489a19202f87405031370eea34))
- **web-components:** allow custom import context ([f764e8c](https://github.com/Agoric/ui-kit/commit/f764e8c8569664766144042475686bcad8514694))
- **web-components:** provide `makeDefaultLeader` for Casting ([5a4f4f4](https://github.com/Agoric/ui-kit/commit/5a4f4f4bd4ae9e7103305cba359b68fe46f56d0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/ui-kit/issues/6861)) ([63ad6bc](https://github.com/Agoric/ui-kit/commit/63ad6bc5eb7c5e785c253d7a2568cb8dbbc7d978))
- **web-components:** read wallet offer public subscribers ([b1aeafc](https://github.com/Agoric/ui-kit/commit/b1aeafcfa83b1038f34dfe63cc50d10a80838749))
- **web-components:** reset after connection problem ([01d84cb](https://github.com/Agoric/ui-kit/commit/01d84cb9fff5d0d6792235be88f1e3d216931b91))
- **web-components:** send a cache function in the events ([514fc04](https://github.com/Agoric/ui-kit/commit/514fc04fa3d8a77b3a57fa37ff388f9240051dff))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/ui-kit/issues/6079)) ([872af6f](https://github.com/Agoric/ui-kit/commit/872af6fb5d68970b570086847532a0ff931330c2))
- Enhance TypeScript node_modules traversal depth ([4407822](https://github.com/Agoric/ui-kit/commit/440782258b8f849c851d403ca2e38e781a52c5a3))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/ui-kit/issues/5922)) ([57a5eb0](https://github.com/Agoric/ui-kit/commit/57a5eb0736d3d6582dbfc9a15bf9cd1a496dbcf4))
- log warning instead of throwing ([6247311](https://github.com/Agoric/ui-kit/commit/6247311e55d4dd10b67d7357ba4ad8b557614d51))
- makePublishKit ([#5435](https://github.com/Agoric/ui-kit/issues/5435)) ([ba1365f](https://github.com/Agoric/ui-kit/commit/ba1365fbafb8e71bd3221fe593dc13c49167d5cb))
- Remove lockdown unsafe monkey-patching hack ([18eaeb5](https://github.com/Agoric/ui-kit/commit/18eaeb5c7c7df5278dc3bf99aa47c3e83724927f))
- resolve wallet connection for empty wallet data ([#11](https://github.com/Agoric/ui-kit/issues/11)) ([ebf5d0a](https://github.com/Agoric/ui-kit/commit/ebf5d0afa1d832ef5f99b1d7a83da82debd1f9de))
- update for `[@jessie](https://github.com/jessie).js/safe-await-separator` ([6d7e287](https://github.com/Agoric/ui-kit/commit/6d7e287fccf77d8a5a7a33812c0b935734d7c611))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/ui-kit/issues/5485)) ([d199f4a](https://github.com/Agoric/ui-kit/commit/d199f4ad1378cf037fe337b1cbca307096a39e61))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/ui-kit/issues/5984)) ([134a7eb](https://github.com/Agoric/ui-kit/commit/134a7eb4938623ac8f322cc6883b27a22b62568b))
- **web-components:** add 100ms delay to deflake test ([3d3853c](https://github.com/Agoric/ui-kit/commit/3d3853cd18390057824536c454e052e0a67e6052))
- **web-components:** attempt to de-flake test ([c38c572](https://github.com/Agoric/ui-kit/commit/c38c572d4fe50719933ca29e4367e1337d786208))
- **web-components:** fix change in update warning ([80971a1](https://github.com/Agoric/ui-kit/commit/80971a13b741022bba3febf023fa3a00dd3d07df))

### Miscellaneous Chores

- remove obsolete web components ([ac00c0d](https://github.com/Agoric/ui-kit/commit/ac00c0d8d044eeec97f672b3bb6415342f1e2a87))
- remove web dev server ([368bc1f](https://github.com/Agoric/ui-kit/commit/368bc1f33dcee146790db8c3aca7db4aa067a416))

## 0.7.0 (2023-06-29)

### ⚠ BREAKING CHANGES

- remove web dev server
- remove obsolete web components

### Features

- batch rpc wallet connection ([933b31c](https://github.com/Agoric/ui-kit/commit/933b31c388b9908c1a6ca569dc3974effb7ddab6))
- show default wallet url in connection component ([58ce9e0](https://github.com/Agoric/ui-kit/commit/58ce9e02af89b798674347926c00b37090115889))
- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/ui-kit/issues/5750)) ([7b3dfee](https://github.com/Agoric/ui-kit/commit/7b3dfeef17c779f1604499f2d86ef1b161c86fa5))
- **WalletConnection:** reset connection after connect timeout ([f9360d4](https://github.com/Agoric/ui-kit/commit/f9360d4dcb51239d76a51d5483b09806844791be))
- **WalletConnection:** reset connection if bridge is closed ([4787fde](https://github.com/Agoric/ui-kit/commit/4787fde6075db1c380148aa16f3b883b1ee49332))
- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/ui-kit/issues/6452)) ([68e3539](https://github.com/Agoric/ui-kit/commit/68e35394f4db2ce03283a9cef1b1194bc51ce979))
- **web-components:** add petimage component ([5b3d097](https://github.com/Agoric/ui-kit/commit/5b3d0978ee57433fe0521c3f59db0f202cc49481))
- **web-components:** Add Powerbox-compatible petname component ([20796d1](https://github.com/Agoric/ui-kit/commit/20796d125b3b4a489a19202f87405031370eea34))
- **web-components:** allow custom import context ([f764e8c](https://github.com/Agoric/ui-kit/commit/f764e8c8569664766144042475686bcad8514694))
- **web-components:** provide `makeDefaultLeader` for Casting ([5a4f4f4](https://github.com/Agoric/ui-kit/commit/5a4f4f4bd4ae9e7103305cba359b68fe46f56d0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/ui-kit/issues/6861)) ([63ad6bc](https://github.com/Agoric/ui-kit/commit/63ad6bc5eb7c5e785c253d7a2568cb8dbbc7d978))
- **web-components:** read wallet offer public subscribers ([b1aeafc](https://github.com/Agoric/ui-kit/commit/b1aeafcfa83b1038f34dfe63cc50d10a80838749))
- **web-components:** reset after connection problem ([01d84cb](https://github.com/Agoric/ui-kit/commit/01d84cb9fff5d0d6792235be88f1e3d216931b91))
- **web-components:** send a cache function in the events ([514fc04](https://github.com/Agoric/ui-kit/commit/514fc04fa3d8a77b3a57fa37ff388f9240051dff))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/ui-kit/issues/6079)) ([872af6f](https://github.com/Agoric/ui-kit/commit/872af6fb5d68970b570086847532a0ff931330c2))
- Enhance TypeScript node_modules traversal depth ([4407822](https://github.com/Agoric/ui-kit/commit/440782258b8f849c851d403ca2e38e781a52c5a3))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/ui-kit/issues/5922)) ([57a5eb0](https://github.com/Agoric/ui-kit/commit/57a5eb0736d3d6582dbfc9a15bf9cd1a496dbcf4))
- log warning instead of throwing ([6247311](https://github.com/Agoric/ui-kit/commit/6247311e55d4dd10b67d7357ba4ad8b557614d51))
- makePublishKit ([#5435](https://github.com/Agoric/ui-kit/issues/5435)) ([ba1365f](https://github.com/Agoric/ui-kit/commit/ba1365fbafb8e71bd3221fe593dc13c49167d5cb))
- Remove lockdown unsafe monkey-patching hack ([18eaeb5](https://github.com/Agoric/ui-kit/commit/18eaeb5c7c7df5278dc3bf99aa47c3e83724927f))
- resolve wallet connection for empty wallet data ([#11](https://github.com/Agoric/ui-kit/issues/11)) ([ebf5d0a](https://github.com/Agoric/ui-kit/commit/ebf5d0afa1d832ef5f99b1d7a83da82debd1f9de))
- update for `[@jessie](https://github.com/jessie).js/safe-await-separator` ([6d7e287](https://github.com/Agoric/ui-kit/commit/6d7e287fccf77d8a5a7a33812c0b935734d7c611))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/ui-kit/issues/5485)) ([d199f4a](https://github.com/Agoric/ui-kit/commit/d199f4ad1378cf037fe337b1cbca307096a39e61))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/ui-kit/issues/5984)) ([134a7eb](https://github.com/Agoric/ui-kit/commit/134a7eb4938623ac8f322cc6883b27a22b62568b))
- **web-components:** add 100ms delay to deflake test ([3d3853c](https://github.com/Agoric/ui-kit/commit/3d3853cd18390057824536c454e052e0a67e6052))
- **web-components:** attempt to de-flake test ([c38c572](https://github.com/Agoric/ui-kit/commit/c38c572d4fe50719933ca29e4367e1337d786208))
- **web-components:** fix change in update warning ([80971a1](https://github.com/Agoric/ui-kit/commit/80971a13b741022bba3febf023fa3a00dd3d07df))

### Miscellaneous Chores

- remove obsolete web components ([ac00c0d](https://github.com/Agoric/ui-kit/commit/ac00c0d8d044eeec97f672b3bb6415342f1e2a87))
- remove web dev server ([368bc1f](https://github.com/Agoric/ui-kit/commit/368bc1f33dcee146790db8c3aca7db4aa067a416))

### [0.6.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.6.2...@agoric/web-components@0.6.3) (2023-06-09)

**Note:** Version bump only for package @agoric/web-components

### [0.6.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.6.1...@agoric/web-components@0.6.2) (2023-06-02)

**Note:** Version bump only for package @agoric/web-components

### [0.6.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.6.0...@agoric/web-components@0.6.1) (2023-05-24)

**Note:** Version bump only for package @agoric/web-components

## [0.6.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.5.0...@agoric/web-components@0.6.0) (2023-05-19)

### Features

- **web-components:** allow custom import context ([2f4ba3a](https://github.com/Agoric/agoric-sdk/commit/2f4ba3ac143e690a479b103f2585d6598ade0f0e))
- **web-components:** read purses from bank instead of smart wallet ([#6861](https://github.com/Agoric/agoric-sdk/issues/6861)) ([f9a3126](https://github.com/Agoric/agoric-sdk/commit/f9a31269026855fcbf4e464840e9316e0e179adc))
- **web-components:** read wallet offer public subscribers ([7b76238](https://github.com/Agoric/agoric-sdk/commit/7b76238b16134649cd5312ed0cdc2353a6901dc7))

### [0.5.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.5.1...@agoric/web-components@0.5.2) (2023-02-17)

**Note:** Version bump only for package @agoric/web-components

### [0.5.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.5.0...@agoric/web-components@0.5.1) (2022-12-14)

**Note:** Version bump only for package @agoric/web-components

## [0.5.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.4.1...@agoric/web-components@0.5.0) (2022-10-18)

### Features

- **web-components:** add 'makeAgoricKeplrConnection' util ([#6452](https://github.com/Agoric/agoric-sdk/issues/6452)) ([0b4b1aa](https://github.com/Agoric/agoric-sdk/commit/0b4b1aac42379c68aabe807904f5bfd6670009c5))

### [0.4.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.4.0...@agoric/web-components@0.4.1) (2022-10-08)

**Note:** Version bump only for package @agoric/web-components

## [0.4.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.3.0...@agoric/web-components@0.4.0) (2022-10-05)

### Features

- show default wallet url in connection component ([e4d96db](https://github.com/Agoric/agoric-sdk/commit/e4d96dbde4a2148aeff1fe1b680e1360d6ea27ba))

## [0.3.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.2.0...@agoric/web-components@0.3.0) (2022-09-20)

### Features

- **wallet-connection:** Connect dapp directly to wallet UI ([#5750](https://github.com/Agoric/agoric-sdk/issues/5750)) ([1dd584b](https://github.com/Agoric/agoric-sdk/commit/1dd584b195212705b1f74a8c89b7f3f121640e41))
- **web-components:** provide `makeDefaultLeader` for Casting ([9cd8d40](https://github.com/Agoric/agoric-sdk/commit/9cd8d405cb35f6baea83b0d8a8128e0bd87a0e2e))
- **web-components:** send a cache function in the events ([26a561a](https://github.com/Agoric/agoric-sdk/commit/26a561a33a72bdb0826c29cc8afeca041c7183a0))

### Bug Fixes

- ALWAYS default to safe ([#6079](https://github.com/Agoric/agoric-sdk/issues/6079)) ([963b652](https://github.com/Agoric/agoric-sdk/commit/963b652c696e006fb2c4960fe6e36ca49530dd29))
- Remove lockdown unsafe monkey-patching hack ([8c3126d](https://github.com/Agoric/agoric-sdk/commit/8c3126d8301bc2c8f7bb0a2145469f6d9d96b669))
- **wallet/ui:** style connection component better ([#5984](https://github.com/Agoric/agoric-sdk/issues/5984)) ([94791c9](https://github.com/Agoric/agoric-sdk/commit/94791c933c678a1f5c8dd43721523db8468d0dd7))
- less unsafe. what breaks? ([#5922](https://github.com/Agoric/agoric-sdk/issues/5922)) ([ace75b8](https://github.com/Agoric/agoric-sdk/commit/ace75b864f93d922477094c464da973125dabf3b))
- makePublishKit ([#5435](https://github.com/Agoric/agoric-sdk/issues/5435)) ([d8228d2](https://github.com/Agoric/agoric-sdk/commit/d8228d272cfe18aa2fba713fb5acc4e84eaa1e39))
- **wallet-connection:** retry on websocket not bridge ([#5485](https://github.com/Agoric/agoric-sdk/issues/5485)) ([9a805a0](https://github.com/Agoric/agoric-sdk/commit/9a805a0cc52737004420bc1774270e7fc0e35224))

## [0.2.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.1.5...@agoric/web-components@0.2.0) (2022-05-28)

### Features

- **WalletConnection:** reset connection after connect timeout ([9e6e1ec](https://github.com/Agoric/agoric-sdk/commit/9e6e1ec5dab04de91559cf31baa24faeaca8c020))
- **WalletConnection:** reset connection if bridge is closed ([ab165da](https://github.com/Agoric/agoric-sdk/commit/ab165dae0390ced6c868dd146b75974c0545fabb))
- **web-components:** reset after connection problem ([f518ec2](https://github.com/Agoric/agoric-sdk/commit/f518ec25d428a406beb4b9170207fb003a1821f8))

### [0.1.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.1.4...@agoric/web-components@0.1.5) (2022-04-18)

**Note:** Version bump only for package @agoric/web-components

### [0.1.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/web-components@0.1.3...@agoric/web-components@0.1.4) (2022-02-21)

### Features

- **web-components:** add petimage component ([697fc38](https://github.com/Agoric/agoric-sdk/commit/697fc382d5b0f79ab66987cc13ee62432a2c0a77))
- **web-components:** Add Powerbox-compatible petname component ([4afa736](https://github.com/Agoric/agoric-sdk/commit/4afa736607178dacfec606d43036f7c2b0ed8024))

### Bug Fixes

- Enhance TypeScript node_modules traversal depth ([000f738](https://github.com/Agoric/agoric-sdk/commit/000f73850d46dc7272b2399c06ad774dd3b8fe6e))
- **web-components:** add 100ms delay to deflake test ([c5b8bb4](https://github.com/Agoric/agoric-sdk/commit/c5b8bb407cb15de9e4ae10c9fac17e057a30ba5f))
- **web-components:** attempt to de-flake test ([174554c](https://github.com/Agoric/agoric-sdk/commit/174554cd2ebb4aeae3b3fc48acbd29f28073b408))
- **web-components:** fix change in update warning ([2ee65b6](https://github.com/Agoric/agoric-sdk/commit/2ee65b64cef5474086e3b28f936de0afb2cd0046))
- log warning instead of throwing ([0b8e4fe](https://github.com/Agoric/agoric-sdk/commit/0b8e4fe4bb8a756aa20598833f43b8dd89e50c8a))

### 0.1.3 (2021-12-22)

**Note:** Version bump only for package @agoric/web-components

### [0.1.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/wallet-connection@0.1.1...@agoric/wallet-connection@0.1.2) (2021-12-02)

### Features

- **wallet-connection:** fall back to same origin for admin socket ([25c9986](https://github.com/Agoric/agoric-sdk/commit/25c99868b21964152bc7f226a89180c5c9cf14a5))
- **wallet-connection:** use pluggable connectors, not destinations ([6e6ffea](https://github.com/Agoric/agoric-sdk/commit/6e6ffea0352dea97f81fd6bb2aa181259d42adbc))

### Bug Fixes

- have main entry points use `@endo/init`, not `ses` ([dce92ac](https://github.com/Agoric/agoric-sdk/commit/dce92acfac4dd0a5de048f7d7865e0e3cdc14396))
- **wallet-connection:** actually find the wallet admin object ([e5a3e83](https://github.com/Agoric/agoric-sdk/commit/e5a3e83633ee6237eca61f1e63a12ef41f46005e))

### 0.1.1 (2021-10-13)

### Features

- **react-wallet:** Integrate wallet connection component ([#3922](https://github.com/Agoric/agoric-sdk/issues/3922)) ([01a9118](https://github.com/Agoric/agoric-sdk/commit/01a91181e36f4e2dc49dcbb1327c50e3b268d2f9))
- **wallet-connection:** Add getAdminBootstrap functionality to wallet connection ([#3909](https://github.com/Agoric/agoric-sdk/issues/3909)) ([4c56367](https://github.com/Agoric/agoric-sdk/commit/4c563672836edaf92a65fb7829b0a189f7e4ce53))
- **wallet-connection:** create new cross-framework UI ([905bf6c](https://github.com/Agoric/agoric-sdk/commit/905bf6ccef614b2b8b8d782810b252df9df1abcc))
- **wallet-connection:** handle dapp approval states ([32b7772](https://github.com/Agoric/agoric-sdk/commit/32b7772ed33ed512ed598bbfc5dcea16ed36a705))

### Bug Fixes

- "yarn lint" should not fix ([#3943](https://github.com/Agoric/agoric-sdk/issues/3943)) ([0aca432](https://github.com/Agoric/agoric-sdk/commit/0aca432ed7a3f33eed4575b36dc3fa9e023b445f))
- **wallet-connection:** add install-ses-lockdown.js ([d03c138](https://github.com/Agoric/agoric-sdk/commit/d03c13821d97818fe8b4fceada9fe3d127bcf643))
- **wallet-connection:** more typing and package updates ([623c5e4](https://github.com/Agoric/agoric-sdk/commit/623c5e4a3dd6ec0e06edfb5fda813c58f56ed382))
