import { createContext } from 'react';
import {
  type AmountValue,
  makeAgoricWalletConnection,
} from '@agoric/web-components';
import type { ChainStorageWatcher } from '@agoric/rpc';
import type { Brand, Amount, AssetKind } from '@agoric/ertp/src/types';

export type PurseJSONState<T extends AssetKind> = {
  brand: Brand;
  /** The petname for this purse's brand */
  brandPetname: string;
  /** The petname for this purse */
  pursePetname: string;
  /** The brand's displayInfo */
  // XXX Copied from @agoric/ertp/src/types-ambient.js
  displayInfo: {
    assetKind: AssetKind;
    decimalPlaces?: number;
  };
  currentAmount: Amount<T>;
};

export type AgoricWalletConnection = Awaited<
  ReturnType<typeof makeAgoricWalletConnection>
>;

export type AgoricState = {
  address?: string;
  chainName?: string;
  connect?: () => Promise<void>;
  chainStorageWatcher?: ChainStorageWatcher;
  walletConnection?: AgoricWalletConnection;
  purses?: PurseJSONState<AssetKind>[];
  offerIdsToPublicSubscribers?: Record<string, Record<string, string>>;
  isSmartWalletProvisioned?: boolean;
  provisionSmartWallet?: AgoricWalletConnection['provisionSmartWallet'];
  makeOffer?: AgoricWalletConnection['makeOffer'];
  smartWalletProvisionFee?: bigint;
  checkSmartWalletProvisionAndMakeOffer?: (
    ...params: Parameters<AgoricWalletConnection['makeOffer']>
  ) => void;
};

export const AgoricContext = createContext<AgoricState>({});
