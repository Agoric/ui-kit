import { type AssetSelector, LiquidityModal, Tabs } from '@leapwallet/elements';
import { useElementsWalletClient } from '../utils';
import { useAgoric } from '../hooks';
import { Ist } from '../icons/Ist';
import { Button } from '@interchain-ui/react';

import '@leapwallet/elements/styles.css';

const agoricChainId = 'agoric-3';
const istSelector: AssetSelector = ['symbol', 'IST'];
const bldSelector: AssetSelector = ['symbol', 'BLD'];

export const OnboardIstModal = () => {
  const { address } = useAgoric();
  const elementsWalletClient = useElementsWalletClient();

  const renderLiquidityButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <Button onClick={onClick} leftIcon="walletFilled">
        Deposit IST
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
        title: 'Deposit IST',
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
              destinationAssetSelector: istSelector,
            },
          },
          [Tabs.SWAP]: {
            enabled: true,
            defaults: {
              sourceChainId: agoricChainId,
              sourceAssetSelector: bldSelector,
              destinationChainId: agoricChainId,
              destinationAssetSelector: istSelector,
            },
          },
          [Tabs.TRANSFER]: {
            enabled: true,
            defaults: {
              destinationChainId: agoricChainId,
              sourceChainId: agoricChainId,
              sourceAssetSelector: istSelector,
            },
          },
        },
      }}
    />
  );
};
