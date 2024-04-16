// @ts-check
import { makeNotifierKit } from '@agoric/notifier';
import { AmountMath } from '@agoric/ertp';
import { iterateEach, makeFollower, makeLeader } from '@agoric/casting';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { AgoricChainStoragePathKind } from '@agoric/rpc';
import { Far } from '@endo/marshal';
import { queryBankBalances } from './queryBankBalances.js';

import type { ChainStorageWatcher } from '@agoric/rpc';
import type { Petname } from '@agoric/smart-wallet/src/types.js';
import type { Coin } from '@keplr-wallet/types';
import type { Brand } from '@agoric/ertp/exported.js';

interface PurseInfo {
  brand?: Brand;
  brandPetname?: Petname;
  currentAmount: unknown;
  pursePetname?: Petname;
  displayInfo?: unknown;
}

type VBankAssets = [
  string,
  { brand: Brand; issuerName: string; displayInfo: unknown },
][];

const POLL_INTERVAL_MS = 6000;
const RETRY_INTERVAL_MS = 200;
const MAX_ATTEMPTS_TO_WATCH_BANK = 2;

export const watchWallet = (
  chainStorageWatcher: ChainStorageWatcher,
  address: string,
  rpc: string,
  onError = (_err: unknown) => {
    /* noop */
  },
) => {
  const pursesNotifierKit = makeNotifierKit(
    /** @type {PurseInfo[] | null} */ null,
  );

  const updatePurses = brandToPurse => {
    const purses = [] as PurseInfo[];
    for (const [_brand, purse] of brandToPurse.entries()) {
      if (purse.currentAmount && purse.brandPetname) {
        assert(purse.pursePetname, 'missing purse.pursePetname');
        purses.push(purse);
      }
    }
    pursesNotifierKit.updater.updateState(harden(purses));
  };

  const publicSubscriberPathsNotifierKit = makeNotifierKit(
    /** @type {  import('@agoric/smart-wallet/src/smartWallet.js').CurrentWalletRecord['offerToPublicSubscriberPaths'] | null } */ null,
  );

  const walletUpdatesNotifierKit = makeNotifierKit(
    /** @type {  import('@agoric/smart-wallet/src/smartWallet.js').UpdateRecord | null } */ null,
  );

  const smartWalletStatusNotifierKit = makeNotifierKit(
    /** @type { {provisioned: boolean} | null } */ null,
  );

  let lastPaths;
  let isWalletMissing = false;
  chainStorageWatcher.watchLatest(
    [AgoricChainStoragePathKind.Data, `published.wallet.${address}.current`],
    value => {
      if (!value) {
        if (!isWalletMissing) {
          smartWalletStatusNotifierKit.updater.updateState(
            harden({ provisioned: false }),
          );
          isWalletMissing = true;
        }
        return;
      }

      smartWalletStatusNotifierKit.updater.updateState(
        harden({ provisioned: true }),
      );
      // @ts-expect-error xxx
      const { offerToPublicSubscriberPaths: currentPaths } = value;
      if (currentPaths === lastPaths) return;

      publicSubscriberPathsNotifierKit.updater.updateState(
        harden(currentPaths),
      );
    },
  );

  const watchChainBalances = () => {
    const brandToPurse = new Map();

    {
      let vbankAssets: VBankAssets;
      let bank: Coin[];

      const possiblyUpdateBankPurses = () => {
        if (!vbankAssets || !bank) return;

        const bankMap = new Map(
          bank.map(({ denom, amount }) => [denom, amount]),
        );

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

      /** @type {Tendermint34Client} */
      let tendermintClient;
      const watchBank = async (attempts = 0) => {
        await null;

        try {
          tendermintClient ||= await Tendermint34Client.connect(rpc);
          bank = await queryBankBalances(address, tendermintClient);
        } catch (e) {
          console.error('Error querying bank balances for address', address);
          if (attempts >= MAX_ATTEMPTS_TO_WATCH_BANK) {
            onError(new Error(`RPC error - ${e.toString?.()}`));
          } else {
            setTimeout(() => watchBank(attempts + 1), RETRY_INTERVAL_MS);
            return;
          }
        }
        possiblyUpdateBankPurses();
        setTimeout(watchBank, POLL_INTERVAL_MS);
      };

      const watchVbankAssets = () => {
        chainStorageWatcher.watchLatest(
          [AgoricChainStoragePathKind.Data, 'published.agoricNames.vbankAsset'],
          value => {
            // @ts-expect-error cast
            vbankAssets = value;
            possiblyUpdateBankPurses();
          },
        );
      };

      void watchVbankAssets();
      void watchBank();
    }

    {
      /** @type { [string, unknown][] } */
      let agoricBrands;
      /** @type { {balance: unknown, brand: unknown}[] } */
      let nonBankPurses;
      /** @type { Map<unknown, { displayInfo: unknown }> } */
      let brandToBoardAux;

      const possiblyUpdateNonBankPurses = () => {
        if (!agoricBrands || !nonBankPurses || !brandToBoardAux) return;

        nonBankPurses.forEach(({ balance, brand }) => {
          const petname = agoricBrands
            ?.find(([_petname, b]) => b === brand)
            ?.at(0);
          const { displayInfo } = brandToBoardAux.get(brand) ?? {};
          const purseInfo = {
            brand,
            currentAmount: balance,
            brandPetname: petname,
            pursePetname: petname,
            displayInfo,
          };
          brandToPurse.set(brand, purseInfo);
        });

        updatePurses(brandToPurse);
      };

      const watchBrands = () => {
        chainStorageWatcher.watchLatest(
          [AgoricChainStoragePathKind.Data, 'published.agoricNames.brand'],
          value => {
            agoricBrands = value;
            possiblyUpdateNonBankPurses();
          },
        );
      };

      const watchPurses = () =>
        chainStorageWatcher.watchLatest(
          [
            AgoricChainStoragePathKind.Data,
            `published.wallet.${address}.current`,
          ],
          async value => {
            // @ts-expect-error cast
            const { purses } = value;
            if (nonBankPurses === purses) return;

            await null;
            if (purses.length !== nonBankPurses?.length) {
              const brands = purses.map(p => p.brand);
              try {
                const boardAux = await Promise.all(
                  chainStorageWatcher.queryBoardAux(brands),
                );
                brandToBoardAux = new Map(
                  brands.map((brand, index) => [brand, boardAux[index]]),
                );
              } catch (e) {
                console.error('Error getting boardAux for brands', brands, e);
                onError(new Error(`API error - ${e.toString?.()}`));
              }
            }

            nonBankPurses = purses;
            possiblyUpdateNonBankPurses();
          },
        );

      void watchBrands();
      void watchPurses();
    }
  };

  const watchWalletUpdates = async () => {
    const watch = async () => {
      const leader = makeLeader(rpc);
      const follower = makeFollower(`:published.wallet.${address}`, leader, {
        proof: 'none',
        unserializer: Far('marshaller', { ...chainStorageWatcher.marshaller }),
      });

      for await (const update of iterateEach(follower)) {
        console.debug('wallet update', update);
        // @ts-expect-error xxx
        if ('error' in update) continue;

        // @ts-expect-error xxx
        walletUpdatesNotifierKit.updater.updateState(harden(update.value));
      }
    };

    await null;
    try {
      await watch();
    } catch (e) {
      onError(new Error(`RPC error - ${e.toString?.()}`));
    }
  };

  watchChainBalances();
  watchWalletUpdates();

  return {
    pursesNotifier: pursesNotifierKit.notifier,
    publicSubscribersNotifier: publicSubscriberPathsNotifierKit.notifier,
    walletUpdatesNotifier: walletUpdatesNotifierKit.notifier,
    smartWalletStatusNotifier: smartWalletStatusNotifierKit.notifier,
  };
};
