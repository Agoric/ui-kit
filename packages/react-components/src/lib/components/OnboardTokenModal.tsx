import { type AssetSelector, LiquidityModal, Tabs } from '@leapwallet/elements';
import { useElementsWalletClient } from '../utils';
import { useAgoric } from '../hooks';
import { Ist } from '../icons/Ist';
import { Button } from '@interchain-ui/react';

import '@leapwallet/elements/styles.css';

const agoricChainId = 'agoric-3';
const istSelector: AssetSelector = ['symbol', 'IST'];
const bldSelector: AssetSelector = ['symbol', 'BLD'];

type TokenType = 'IST' | 'BLD';

type Props = {
  token: TokenType;
};

export const OnboardTokenModal = ({ token }: Props) => {
  const { address } = useAgoric();
  const elementsWalletClient = useElementsWalletClient();
  const destinationSelector = token === 'IST' ? istSelector : bldSelector;

  const renderLiquidityButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <Button onClick={onClick} leftIcon="walletFilled">
        Deposit {token}
      </Button>
    );
  };

  return (
    <LiquidityModal
      renderLiquidityButton={renderLiquidityButton}
      theme="light"
      walletClientConfig={{
        userAddress: address,
        walletClient: elementsWalletClient,
        connectWallet: (chainId?: string) => {
          return elementsWalletClient.enable(chainId ?? []);
        },
      }}
      defaultActiveTab={Tabs.SWAP}
      config={{
        icon: Ist,
        title: `Deposit ${token}`,
        subtitle: '',
        tabsConfig: {
          [Tabs.BRIDGE_USDC]: {
            enabled: false,
          },
          [Tabs.FIAT_ON_RAMP]: {
            enabled: false,
          },
          [Tabs.CROSS_CHAIN_SWAPS]: {
            enabled: true,
            defaults: {
              destinationChainId: agoricChainId,
              destinationAssetSelector: destinationSelector,
            },
          },
          [Tabs.SWAP]: {
            enabled: true,
            defaults: {
              sourceChainId: agoricChainId,
              sourceAssetSelector: token === 'IST' ? bldSelector : istSelector,
              destinationChainId: agoricChainId,
              destinationAssetSelector: destinationSelector,
            },
          },
          [Tabs.TRANSFER]: {
            enabled: true,
            defaults: {
              destinationChainId: agoricChainId,
              sourceChainId: agoricChainId,
              sourceAssetSelector: destinationSelector,
            },
          },
        },
      }}
    />
  );
};
