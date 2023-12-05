// @ts-check
import { SigningStargateClient } from '@cosmjs/stargate';
import { subscribeLatest } from '@agoric/notifier';
import { makeInteractiveSigner } from './makeInteractiveSigner.js';
import { watchWallet } from './watchWallet.js';
import { Errors } from '../errors.js';

export const makeAgoricWalletConnection = async (chainStorageWatcher, rpc) => {
  if (!('keplr' in window)) {
    throw Error(Errors.noKeplr);
  }
  /** @type {import('@keplr-wallet/types').Keplr} */
  // @ts-expect-error cast (checked above)
  const keplr = window.keplr;

  const { address, submitSpendAction, provisionSmartWallet } =
    await makeInteractiveSigner(
      chainStorageWatcher.chainId,
      rpc,
      keplr,
      SigningStargateClient.connectWithSigner,
    );

  const walletNotifiers = watchWallet(chainStorageWatcher, address, rpc);

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
    ...walletNotifiers,
  };
};
