import { useState, useCallback } from 'react';
import { CHAIN_ID, NETWORK_CONFIG_HREF } from '../utils/constants';
import type { OfflineSigner } from '@cosmjs/proto-signing';
import { suggestChain } from '@agoric/web-components';

export const useWalletManager = () => {
  const [address, setAddress] = useState<string>('');
  const [offlineSigner, setOfflineSigner] = useState<OfflineSigner | undefined>(
    undefined,
  );

  const connectWallet = useCallback(async () => {
    try {
      if (!window.keplr) {
        throw new Error('Please install Keplr extension');
      }
      await suggestChain(NETWORK_CONFIG_HREF);
      await window.keplr.enable(CHAIN_ID);
      const signer = await window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID);

      const [account] = await signer.getAccounts();
      if (!account) {
        throw new Error(
          `No account found for wallet keplr and chain ${CHAIN_ID}`,
        );
      }
      setAddress(account?.address as string);
      if (!signer) {
        throw new Error(
          `No offline signer found for wallet keplr and chain ${CHAIN_ID}`,
        );
      }
      setOfflineSigner(signer);
    } catch (error: unknown) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet: ' + (error as Error).message);
    }
  }, []);

  return {
    address,
    offlineSigner,
    connectWallet,
  };
};
