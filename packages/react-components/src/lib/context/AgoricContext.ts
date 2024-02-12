import { createContext } from 'react';
import { makeAgoricWalletConnection } from '@agoric/web-components';
import type { ChainStorageWatcher } from '@agoric/rpc';
import type { Brand, Amount, AssetKind } from '@agoric/ertp/src/types';

export type PursesJSONState<T extends AssetKind> = {
  brand: Brand;
  /** The board ID for this purse's brand */
  brandBoardId: string;
  /** The board ID for the deposit-only facet of this purse */
  depositBoardId?: string;
  /** The petname for this purse's brand */
  brandPetname: string;
  /** The petname for this purse */
  pursePetname: string;
  /** The brand's displayInfo */
  displayInfo: unknown;
  /** The purse's current balance */
  value: unknown;
  currentAmountSlots: unknown;
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
  purses?: PursesJSONState<AssetKind>[];
  offerIdsToPublicSubscribers?: Record<string, Record<string, string>>;
  isSmartWalletProvisioned?: boolean;
};

export const AgoricContext = createContext<AgoricState>({});
