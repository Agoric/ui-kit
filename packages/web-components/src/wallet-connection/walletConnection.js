// @ts-check
import { SigningStargateClient } from '@cosmjs/stargate';
import { subscribeLatest } from '@agoric/notifier';
import { makeInteractiveSigner } from './makeInteractiveSigner.js';
import { watchWallet } from './watchWallet.js';
import { Errors } from '../errors.js';

export const makeAgoricWalletConnection = async chainStorageWatcher => {
  if (!('keplr' in window)) {
    throw Error(Errors.noKeplr);
  }
  /** @type {import('@keplr-wallet/types').Keplr} */
  // @ts-expect-error cast (checked above)
  const keplr = window.keplr;

  const { address, submitSpendAction } = await makeInteractiveSigner(
    chainStorageWatcher.chainId,
    chainStorageWatcher.rpcAddr,
    keplr,
    SigningStargateClient.connectWithSigner,
  );

  const walletNotifiers = await watchWallet(chainStorageWatcher, address);

  const makeOffer = async (
    invitationSpec,
    proposal,
    offerArgs,
    onStatusChange,
  ) => {
    const { marshal } = chainStorageWatcher;
    const id = new Date().getTime();
    const spendAction = marshal.serialize(
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

    try {
      // eslint-disable-next-line @jessie.js/safe-await-separator
      const txn = await submitSpendAction(JSON.stringify(spendAction));
      onStatusChange({ status: 'seated', data: { txn, offerId: id } });
    } catch (e) {
      onStatusChange({ status: 'error', data: e });
      return;
    }

    const iterator = subscribeLatest(walletNotifiers.walletUpdatesNotifier);
    for await (const update of iterator) {
      if (update.updated !== 'offerStatus' || update.status.id !== id) {
        continue;
      }
      if (update.status.error !== undefined) {
        onStatusChange({ status: 'error', data: update.status.error });
        return;
      }
      if (update.status.numWantsSatisfied === 0) {
        onStatusChange({ status: 'refunded' });
        return;
      }
      if (update.status.numWantsSatisfied === 1) {
        onStatusChange({ status: 'accepted' });
        return;
      }
    }
  };

  return {
    makeOffer,
    address,
    ...walletNotifiers,
  };
};
