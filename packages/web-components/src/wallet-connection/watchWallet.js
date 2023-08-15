// @ts-check
import { makeNotifierKit } from '@agoric/notifier';
import { AmountMath } from '@agoric/ertp';
import { iterateLatest, makeFollower, makeLeader } from '@agoric/casting';
import { Errors } from '../errors.js';
import { queryBankBalances } from '../queryBankBalances.js';

/** @typedef {import('@agoric/smart-wallet/src/types.js').Petname} Petname */

/**
 * @typedef {{
 *  brand?: unknown,
 *  brandPetname?: Petname,
 *  currentAmount: unknown,
 *  pursePetname?: Petname,
 *  displayInfo?: unknown,
 * }} PurseInfo
 */

const POLL_INTERVAL_MS = 6000;

/**
 * @param {any} chainStorageWatcher
 * @param {string} address
 */
export const watchWallet = async (chainStorageWatcher, address) => {
  const pursesNotifierKit = makeNotifierKit(
    /** @type {PurseInfo[] | null} */ (null),
  );

  const updatePurses = brandToPurse => {
    /** @type {PurseInfo[]} */
    const purses = [];
    for (const [_brand, purse] of brandToPurse.entries()) {
      if (purse.currentAmount && purse.brandPetname) {
        assert(purse.pursePetname, 'missing purse.pursePetname');
        purses.push(purse);
      }
    }
    pursesNotifierKit.updater.updateState(harden(purses));
  };

  const publicSubscriberPathsNotifierKit = makeNotifierKit(
    /** @type {  import('@agoric/smart-wallet/src/smartWallet.js').CurrentWalletRecord['offerToPublicSubscriberPaths'] | null } */ (
      null
    ),
  );

  const walletUpdatesNotifierKit = makeNotifierKit(
    /** @type {  import('@agoric/smart-wallet/src/smartWallet.js').UpdateRecord | null } */ (
      null
    ),
  );

  // NB: this watches '.current' but only notifies of changes to offerToPublicSubscriberPaths
  await /** @type {Promise<void>} */ (
    new Promise((res, rej) => {
      let lastPaths;
      chainStorageWatcher.watchLatest(
        ['data', `published.wallet.${address}.current`],
        value => {
          res();
          const { offerToPublicSubscriberPaths: currentPaths } = value;
          if (currentPaths === lastPaths) return;

          publicSubscriberPathsNotifierKit.updater.updateState(
            harden(currentPaths),
          );
        },
        err => {
          if (!lastPaths) {
            rej();
          } else {
            throw Error(err);
          }
        },
      );
    })
  ).catch(() => {
    throw Error(Errors.noSmartWallet);
  });

  const watchChainBalances = () => {
    const brandToPurse = new Map();
    let vbankAssets;
    let bank;

    const possiblyUpdateBankPurses = () => {
      if (!vbankAssets || !bank) return;

      const bankMap = new Map(bank.map(({ denom, amount }) => [denom, amount]));

      vbankAssets.forEach(([denom, info]) => {
        const amount = bankMap.get(denom) ?? 0n;
        const purseInfo = {
          brand: info.brand,
          currentAmount: AmountMath.make(info.brand, BigInt(amount)),
          brandPetname: info.issuerName,
          pursePetname: info.issuerName,
          displayInfo: info.displayInfo,
        };
        brandToPurse.set(info.brand, purseInfo);
      });

      updatePurses(brandToPurse);
    };

    const watchBank = async () => {
      const balances = await queryBankBalances(
        address,
        chainStorageWatcher.rpcAddr,
      );
      bank = balances;
      possiblyUpdateBankPurses();
      setTimeout(watchBank, POLL_INTERVAL_MS);
    };

    const watchVbankAssets = async () => {
      chainStorageWatcher.watchLatest(
        ['data', 'published.agoricNames.vbankAsset'],
        value => {
          vbankAssets = value;
          possiblyUpdateBankPurses();
        },
      );
    };

    void watchVbankAssets();
    void watchBank();
  };

  const watchWalletUpdates = async () => {
    const leader = makeLeader(chainStorageWatcher.rpcAddr);
    const follower = makeFollower(`:published.wallet.${address}`, leader, {
      proof: 'none',
      unserializer: chainStorageWatcher.marshaller,
    });

    for await (const { value } of iterateLatest(follower)) {
      console.debug('wallet update', value);
      walletUpdatesNotifierKit.updater.updateState(harden(value));
    }
  };

  watchChainBalances();
  watchWalletUpdates();

  return {
    pursesNotifier: pursesNotifierKit.notifier,
    publicSubscribersNotifier: publicSubscriberPathsNotifierKit.notifier,
    walletUpdatesNotifier: walletUpdatesNotifierKit.notifier,
  };
};
