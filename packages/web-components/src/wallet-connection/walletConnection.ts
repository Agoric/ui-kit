import { subscribeLatest } from '@agoric/notifier';
import { makeAgoricSigner } from './makeAgoricSigner.js';
import { watchWallet } from './watchWallet.js';
import { connectKeplr } from './connectKeplr.js';
import type { ChainStorageWatcher } from '@agoric/rpc';
import type { SigningStargateClient } from '@cosmjs/stargate';

interface ClientConfig {
  client: SigningStargateClient;
  address: string;
}

export const makeAgoricWalletConnection = async (
  chainStorageWatcher: ChainStorageWatcher,
  rpc: string,
  onError?: (error: unknown) => void,
  clientConfig?: ClientConfig,
) => {
  await null;
  const { client, address } =
    clientConfig || (await connectKeplr(chainStorageWatcher.chainId, rpc));

  const { submitSpendAction, provisionSmartWallet } = makeAgoricSigner(
    client,
    address,
  );

  const walletNotifiers = watchWallet(
    chainStorageWatcher,
    address,
    rpc,
    onError,
  );

  const makeOffer = async (
    invitationSpec,
    proposal,
    offerArgs,
    onStatusChange,
    id = new Date().getTime(),
  ) => {
    const { marshaller } = chainStorageWatcher;
    const spendAction = marshaller.toCapData(
      harden({
        method: 'executeOffer',
        offer: {
          id,
          invitationSpec,
          proposal,
          offerArgs,
        },
      }),
    );

    let isFinished = false;
    const watchUpdates = async () => {
      const iterator = subscribeLatest(walletNotifiers.walletUpdatesNotifier);
      for await (const update of iterator) {
        if (isFinished) {
          // If tx fails, don't wait for status updates.
          return;
        }
        if (update?.updated !== 'offerStatus' || update.status.id !== id) {
          continue;
        }
        if (update.status.error !== undefined) {
          isFinished = true;
          onStatusChange({ status: 'error', data: update.status.error });
          return;
        }
        if (update.status.numWantsSatisfied === 0) {
          isFinished = true;
          onStatusChange({ status: 'refunded' });
          return;
        }
        // numWantsSatisfied can either be 1 or 0 until "multiples" are
        // supported.
        //
        // https://github.com/Agoric/agoric-sdk/blob/1b5e57f17a043a43171621bbe3ef68131954f714/packages/zoe/src/zoeService/types.js#L213
        if (update.status.numWantsSatisfied > 0) {
          isFinished = true;
          onStatusChange({ status: 'accepted' });
          return;
        }
      }
    };
    const watchP = watchUpdates();

    await null;
    try {
      const txn = await submitSpendAction(JSON.stringify(spendAction));
      if (isFinished) {
        // Don't update again if wallet update happens before tx result is returned.
        return;
      }
      onStatusChange({ status: 'seated', data: { txn, offerId: id } });
    } catch (e) {
      if (isFinished) {
        // Don't update again if wallet update happens before tx result is returned.
        return;
      }
      isFinished = true;
      onStatusChange({ status: 'error', data: e });
    }
    await watchP;
  };

  return {
    makeOffer,
    address,
    provisionSmartWallet,
    signingClient: client,
    ...walletNotifiers,
  };
};
