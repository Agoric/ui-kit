import { ChainProvider } from '@cosmos-kit/react';
import { AgoricProviderLite } from './AgoricProviderLite';
import { chains, assets } from 'chain-registry';
import { makeAssetList, makeChainInfo } from '../config';
import { PropsWithChildren, useContext } from 'react';
import { NetworkConfig, NetworkContext } from './NetworkContext';
import { NetworkProvider } from './NetworkProvider';
import type { MainWalletBase, WalletConnectOptions } from '@cosmos-kit/core';

import '@interchain-ui/react/styles';

type Props = {
  wallets: MainWalletBase[];
  defaultNetworkConfig: NetworkConfig;
  walletConnectOptions?: WalletConnectOptions;
  onConnectionError?: (e: unknown) => void;
};

export const AgoricProvider = (props: PropsWithChildren<Props>) => {
  return (
    <NetworkProvider defaultNetworkConfig={props.defaultNetworkConfig}>
      <AgoricProviderInner {...props} />
    </NetworkProvider>
  );
};

const AgoricProviderInner = ({
  wallets,
  walletConnectOptions,
  children,
  onConnectionError,
}: PropsWithChildren<Props>) => {
  const { networkConfig } = useContext(NetworkContext);
  assert(networkConfig, 'Network config missing from context');

  const { apis, testChain } = networkConfig;
  const testChainInfo =
    testChain && makeChainInfo(testChain.chainName, testChain.chainId, apis);
  const testChainAssets = testChain && makeAssetList(testChain.chainName);
  const chainName = testChain ? testChain.chainName : 'agoric';

  return (
    <ChainProvider
      chains={testChainInfo ? [...chains, testChainInfo] : chains}
      assetLists={testChainAssets ? [...assets, testChainAssets] : assets}
      wallets={wallets}
      walletConnectOptions={walletConnectOptions}
      endpointOptions={{
        endpoints: { [chainName]: apis },
        isLazy: true,
      }}
    >
      <AgoricProviderLite
        chainName={chainName}
        onConnectionError={onConnectionError}
      >
        {children}
      </AgoricProviderLite>
    </ChainProvider>
  );
};
