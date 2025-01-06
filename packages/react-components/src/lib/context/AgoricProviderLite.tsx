import { PropsWithChildren, useState } from 'react';
import {
  AgoricContext,
  type PurseJSONState,
  type AgoricWalletConnection,
} from './AgoricContext';
import { SigningStargateClient } from '@cosmjs/stargate';
import { useChain, useWalletClient } from '@cosmos-kit/react';
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
import { Registry } from '@cosmjs/proto-signing';
import {
  AminoTypes,
  defaultRegistryTypes,
  createBankAminoConverters,
  createAuthzAminoConverters,
  createIbcAminoConverters,
} from '@cosmjs/stargate';
import { subscribeLatest } from '@agoric/notifier';
import type { ChainName } from 'cosmos-kit';
import type { AssetKind } from '@agoric/ertp/src/types';
import {
  ProvisionNoticeModal,
  type Props as ProvisionNoticeProps,
} from '../components/ProvisionNoticeModal';

export type AgoricProviderLiteProps = PropsWithChildren<{
  chainName?: ChainName;
  useCustomEndpoints?: boolean;
  onConnectionError?: (e: unknown) => void;
  provisionNoticeContent?: ProvisionNoticeProps['mainContent'];
}>;

/**
 * Provides access to Agoric-specific account features such as smart wallet
 * provisioning, purses, offer signing, and more.
 *
 * Meant to be used inside a `ChainProvider` from
 * https://github.com/cosmology-tech/cosmos-kit/tree/main/packages/react.
 *
 * If a custom `ChainProvider` is not desired, one can implicitly use
 * the default one via `AgoricProvider`.
 */
export const AgoricProviderLite = ({
  children,
  onConnectionError = () => {},
  chainName = 'agoric',
  useCustomEndpoints = true,
  provisionNoticeContent,
}: AgoricProviderLiteProps) => {
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
  const [postProvisionOffer, setPostProvisionOffer] = useState<
    | {
        makeOffer: () => void;
        onStatusChange: (change: { status: string; data: any }) => void;
      }
    | undefined
  >(undefined);

  const { status, client } = useWalletClient();
  const chain = useChain(chainName);

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
      const restEndpoint = await chain.getRestEndpoint(useCustomEndpoints);
      const apiAddr =
        typeof restEndpoint === 'string' ? restEndpoint : restEndpoint.url;
      const watcher = makeAgoricChainStorageWatcher(
        apiAddr,
        chainName,
        onConnectionError,
      );
      setChainStorageWatcher(watcher);
    };

    getWatcher().catch(e => {
      console.error('error making agoric chain storage watcher', e);
      onConnectionError(e);
    });
  }, []);

  useEffect(() => {
    const getAgoricWalletConnection = async () => {
      const [rpcEndpoint, aminoSigner] = await Promise.all([
        chain.getRpcEndpoint(useCustomEndpoints),
        client?.getOfflineSigner?.(chain.chain.chain_id, 'amino'),
      ]);
      const rpcAddr =
        typeof rpcEndpoint === 'string' ? rpcEndpoint : rpcEndpoint.url;

      assert(
        aminoSigner !== undefined,
        'Cannot getOfflineSigner, is wallet connected?',
      );
      const signingStargateClient =
        await SigningStargateClient.connectWithSigner(
          rpcEndpoint,
          // @ts-expect-error Some mismatch on accountNumber 'Long' types
          aminoSigner,
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
      assert(chain.address, 'Cannot get address, is wallet connected?');
      assert(chainStorageWatcher);
      const agoricWalletConnection = await makeAgoricWalletConnection(
        chainStorageWatcher,
        rpcAddr,
        (e: unknown) => {
          console.error('wallet connection error', e);
          onConnectionError(e);
        },
        { address: chain.address, client: signingStargateClient },
      );
      setWalletConnection(agoricWalletConnection);
    };

    if (
      status === 'Done' &&
      chain.address !== undefined &&
      chainStorageWatcher !== undefined
    ) {
      getAgoricWalletConnection().catch(e => {
        onConnectionError(e);
        console.error('error making agoric wallet connection', e);
      });
    }

    return () => {
      setWalletConnection(undefined);
    };
  }, [status, chain.address, chainStorageWatcher]);

  const checkSmartWalletProvisionAndMakeOffer =
    isSmartWalletProvisioned !== undefined
      ? (...offerArgs: Parameters<AgoricWalletConnection['makeOffer']>) => {
          if (isSmartWalletProvisioned) {
            walletConnection?.makeOffer(...offerArgs);
            return;
          }
          setPostProvisionOffer({
            makeOffer: () => {
              walletConnection?.makeOffer(...offerArgs);
              setPostProvisionOffer(undefined);
            },
            onStatusChange: offerArgs[3],
          });
        }
      : undefined;

  const state = {
    address: chain.address,
    chainName,
    connect: chain.connect,
    chainStorageWatcher,
    walletConnection,
    purses,
    offerIdsToPublicSubscribers,
    isSmartWalletProvisioned,
    makeOfferWithoutModal: walletConnection?.makeOffer,
    provisionSmartWallet: walletConnection?.provisionSmartWallet,
    makeOffer: checkSmartWalletProvisionAndMakeOffer,
    smartWalletProvisionFee,
  };

  return (
    <AgoricContext.Provider value={state}>
      {children}
      <ProvisionNoticeModal
        mainContent={provisionNoticeContent}
        onClose={() => {
          postProvisionOffer?.onStatusChange({
            status: 'error',
            data: new Error('User cancelled'),
          });
          setPostProvisionOffer(undefined);
        }}
        proceed={postProvisionOffer?.makeOffer}
      />
    </AgoricContext.Provider>
  );
};
