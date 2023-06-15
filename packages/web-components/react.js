import { createComponent } from '@lit-labs/react';

import { DappWalletBridge } from './index.js';

// Upgrade the tags.
import './dapp-wallet-bridge.js';

export const makeReactDappWalletBridge = React =>
  createComponent(React, 'dapp-wallet-bridge', DappWalletBridge, {
    onBridgeMessage: 'bridgeMessage',
    onError: 'error',
    onBridgeReady: 'bridgeReady',
    onBridgeLocated: 'bridgeLocated',
  });
