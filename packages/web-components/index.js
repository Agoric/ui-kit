// @ts-check

export { makeAgoricKeplrConnection } from './src/keplr-connection/KeplrConnection.js';
export { makeAgoricWalletConnection } from './src/wallet-connection/walletConnection.js';
export {
  agoricRegistryTypes,
  agoricConverters,
} from './src/wallet-connection/signerOptions.js';
export { suggestChain } from './src/wallet-connection/suggestChain.js';
export { Errors as AgoricKeplrConnectionErrors } from './src/errors.js';
export {
  DappWalletBridge,
  BridgeProtocol,
} from './src/dapp-wallet-bridge/DappWalletBridge.js';
