import { PropsWithChildren, useState } from 'react';
import {
  AgoricContext,
  type PurseJSONState,
  type AgoricWalletConnection,
} from './AgoricContext';
import { useEffect } from 'react';
import {
  agoricRegistryTypes,
  agoricConverters,
  makeAgoricWalletConnection,
} from '@agoric/web-components';
import {
  type ChainStorageWatcher,
  makeAgoricChainStorageWatcher,
} from '@agoric/rpc';
import { OfflineSigner, Registry } from '@cosmjs/proto-signing';
import {
  AminoTypes,
  defaultRegistryTypes,
  createBankAminoConverters,
  createAuthzAminoConverters,
  createIbcAminoConverters,
  SigningStargateClient,
} from '@cosmjs/stargate';
import { subscribeLatest } from '@agoric/notifier';
import type { AssetKind } from '@agoric/ertp/src/types';

export type AgoricProviderProps = PropsWithChildren<{
  restEndpoint: string;
  rpcEndpoint: string;
  address?: string;
  offlineSigner?: OfflineSigner;
  onConnectionError?: (e: unknown) => void;
  chainName?: string;
}>;

/**
 * Provides access to Agoric-specific account features such as smart wallet
 * provisioning, purses, offer signing, and more.
 */
export const AgoricProvider = ({
  children,
  restEndpoint,
  rpcEndpoint,
  offlineSigner,
  address,
  onConnectionError,
  chainName = 'agoric',
}: AgoricProviderProps) => {
  const [walletConnection, setWalletConnection] = useState<
    AgoricWalletConnection | undefined
  >(undefined);
  const [chainStorageWatcher, setChainStorageWatcher] = useState<
    ChainStorageWatcher | undefined
  >(undefined);
  const [purses, setPurses] = useState<PurseJSONState<AssetKind>[] | undefined>(
    undefined,
  );
  const [offerIdsToPublicSubscribers, setOfferIdsToPublicSubscribers] =
    useState<Record<string, Record<string, string>> | undefined>(undefined);
  const [isSmartWalletProvisioned, setIsSmartWalletProvisioned] = useState<
    boolean | undefined
  >(undefined);
  const [smartWalletProvisionFee, setSmartWalletProvisionFee] = useState<
    bigint | undefined
  >(undefined);
  const [smartWalletProvisionFeeUnit, setSmartWalletProvisionFeeUnit] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    const watchPurses = async () => {
      assert(walletConnection);
      const n = walletConnection.pursesNotifier;

      for await (const result of subscribeLatest(n)) {
        if (isCancelled) return;
        if (!result) continue;
        setPurses(result);
      }
    };

    const watchSmartWalletProvision = async () => {
      assert(walletConnection);
      const n = walletConnection.smartWalletStatusNotifier;
      for await (const status of subscribeLatest(n)) {
        if (isCancelled) return;
        if (!status) continue;
        setIsSmartWalletProvisioned(status.provisioned);
        setSmartWalletProvisionFee(status.provisionFee);
        setSmartWalletProvisionFeeUnit(status.feeUnit);
      }
    };

    const watchPublicSubscribers = async () => {
      assert(walletConnection);
      const n = walletConnection.publicSubscribersNotifier;

      for await (const entries of subscribeLatest(n)) {
        if (isCancelled) return;
        if (!entries) continue;
        const result = Object.fromEntries(entries);
        setOfferIdsToPublicSubscribers(result);
      }
    };

    if (walletConnection) {
      watchPurses().catch((err: Error) => {
        console.error('got watchPurses err', err);
      });
      watchSmartWalletProvision().catch((err: Error) => {
        console.error('got watchSmartWalletProvision err', err);
      });
      watchPublicSubscribers().catch((err: Error) => {
        console.error('got watchPublicSubscribers err', err);
      });
    }

    return () => {
      isCancelled = true;
      setPurses(undefined);
      setIsSmartWalletProvisioned(undefined);
      setOfferIdsToPublicSubscribers(undefined);
    };
  }, [walletConnection]);

  useEffect(() => {
    const getWatcher = async () => {
      const watcher = makeAgoricChainStorageWatcher(
        restEndpoint,
        chainName,
        onConnectionError ?? (() => {}),
      );
      setChainStorageWatcher(watcher);
    };

    getWatcher().catch(e => {
      console.error('error making agoric chain storage watcher', e);
      onConnectionError?.(e);
    });
  }, [restEndpoint, chainName, onConnectionError]);

  useEffect(() => {
    const getAgoricWalletConnection = async () => {
      assert(
        offlineSigner !== undefined,
        'Cannot get offline signer, is wallet connected?',
      );
      const signingStargateClient =
        await SigningStargateClient.connectWithSigner(
          rpcEndpoint,
          offlineSigner,
          {
            aminoTypes: new AminoTypes({
              ...agoricConverters,
              ...createBankAminoConverters(),
              ...createAuthzAminoConverters(),
              ...createIbcAminoConverters(),
            }),
            registry: new Registry([
              ...defaultRegistryTypes,
              ...agoricRegistryTypes,
            ]),
          },
        );
      assert(chainStorageWatcher);
      assert(
        address,
        'No address provided in AgoricProvider, is wallet connected?',
      );
      const agoricWalletConnection = await makeAgoricWalletConnection(
        chainStorageWatcher,
        rpcEndpoint,
        (e: unknown) => {
          console.error('wallet connection error', e);
          onConnectionError?.(e);
        },
        { address, client: signingStargateClient },
      );
      setWalletConnection(agoricWalletConnection);
    };

    if (
      offlineSigner !== undefined &&
      address !== undefined &&
      chainStorageWatcher !== undefined
    ) {
      getAgoricWalletConnection().catch(e => {
        onConnectionError?.(e);
        console.error('error making agoric wallet connection', e);
      });
    }

    return () => {
      setWalletConnection(undefined);
    };
  }, [address, chainStorageWatcher, offlineSigner]);

  const state = {
    address,
    chainName,
    chainStorageWatcher,
    walletConnection,
    purses,
    offerIdsToPublicSubscribers,
    isSmartWalletProvisioned,
    provisionSmartWallet: walletConnection?.provisionSmartWallet,
    makeOffer: walletConnection?.makeOffer,
    smartWalletProvisionFee,
    smartWalletProvisionFeeUnit,
  };

  return (
    <AgoricContext.Provider value={state}>{children}</AgoricContext.Provider>
  );
};
