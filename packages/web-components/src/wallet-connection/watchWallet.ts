// @ts-check
import { makeNotifierKit } from '@agoric/notifier';
import { AmountMath } from '@agoric/ertp';
import { iterateEach, makeFollower, makeLeader } from '@agoric/casting';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { AgoricChainStoragePathKind } from '@agoric/rpc';
import { Far } from '@endo/marshal';
import { queryBankBalances } from './queryBankBalances.js';
import { querySwingsetParams } from './querySwingsetParams.js';

import type { ChainStorageWatcher } from '@agoric/rpc';
import type { Petname } from '@agoric/smart-wallet/src/types.js';
import type { Coin } from '@keplr-wallet/types';
import type { Brand } from '@agoric/ertp/exported.js';
import type {
  CurrentWalletRecord,
  UpdateRecord,
} from '@agoric/smart-wallet/src/smartWallet.js';
import type { NatValue } from '@agoric/ertp/src/types.js';

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

/** @typedef {import('@agoric/ertp/src/types.js').Amount<'nat'>['value']} NatValue */

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
  const pursesNotifierKit = makeNotifierKit<PurseInfo[] | null>(null);

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

  const publicSubscriberPathsNotifierKit = makeNotifierKit<
    CurrentWalletRecord['offerToPublicSubscriberPaths'] | null
  >(null);

  const walletUpdatesNotifierKit = makeNotifierKit<UpdateRecord | null>(null);

  const smartWalletStatusNotifierKit = makeNotifierKit<{
    provisioned: boolean;
    provisionFee?: NatValue;
  } | null>();

  let lastPaths;
  let isWalletMissing = false;
  /** @type {Promise<Tendermint34Client> | undefined} */
  let tendermintClientP;

  /** @returns {Promise<NatValue>} */
  const fetchProvisionFee = async () => {
    await null;
    return new Promise((res, rej) => {
      const query = async (attempts = 0) => {
        await null;

        try {
          tendermintClientP ||= Tendermint34Client.connect(rpc);
          const swingset = await querySwingsetParams(await tendermintClientP);
          console.debug('got swingset params:', swingset);
          const beansPerSmartWallet = swingset.params?.beansPerUnit.find(
            ({ key }) => key === 'smartWalletProvision',
          )?.beans;
          const feeUnit = swingset.params?.beansPerUnit.find(
            ({ key }) => key === 'feeUnit',
          )?.beans;
          const feeUnitPrice = swingset.params?.feeUnitPrice[0]?.amount;

          if (!(feeUnitPrice && beansPerSmartWallet && feeUnit)) {
            console.error('Provisioning fee missing from swingset params');
            res(0n);
            return;
          }

          const fee =
            (BigInt(beansPerSmartWallet) / BigInt(feeUnit)) *
            BigInt(feeUnitPrice);

          res(fee);
        } catch (e) {
          console.error('Error querying smart wallet provision fee', address);
          if (attempts >= MAX_ATTEMPTS_TO_WATCH_BANK) {
            rej(e);
          } else {
            setTimeout(() => query(attempts + 1), RETRY_INTERVAL_MS);
          }
        }
      };
      query();
    });
  };

  chainStorageWatcher.watchLatest(
    [AgoricChainStoragePathKind.Data, `published.wallet.${address}.current`],
    (value?: { offerToPublicSubscriberPaths: Record<string, string> }) => {
      if (!value) {
        if (!isWalletMissing) {
          isWalletMissing = true;
          fetchProvisionFee()
            .then(provisionFee => {
              if (isWalletMissing) {
                smartWalletStatusNotifierKit.updater.updateState(
                  harden({ provisioned: false, provisionFee }),
                );
              }
            })
            .catch(e => {
              onError(new Error(`RPC error - ${e.toString?.()}`));
              if (isWalletMissing) {
                smartWalletStatusNotifierKit.updater.updateState(
                  harden({ provisioned: false }),
                );
              }
            });
        }
        return;
      }

      isWalletMissing = false;
      smartWalletStatusNotifierKit.updater.updateState(
        harden({ provisioned: true }),
      );
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
        let shouldUpdatePurses = false;

        const bankMap = new Map(
          bank.map(({ denom, amount }) => [denom, amount]),
        );

        vbankAssets.forEach(([denom, info]) => {
          const existingPurse = brandToPurse.get(info.brand);
          const value = BigInt(bankMap.get(denom) ?? 0n);
          if (!existingPurse || existingPurse.currentAmount.value !== value) {
            shouldUpdatePurses = true;
          }

          const purseInfo = {
            brand: info.brand,
            currentAmount: AmountMath.make(info.brand, value),
            brandPetname: info.issuerName,
            pursePetname: info.issuerName,
            displayInfo: info.displayInfo,
          };
          brandToPurse.set(info.brand, purseInfo);
        });

        if (shouldUpdatePurses) {
          updatePurses(brandToPurse);
        }
      };

      const watchBank = async (attempts = 0) => {
        await null;

        try {
          tendermintClientP ||= Tendermint34Client.connect(rpc);
          bank = await queryBankBalances(address, await tendermintClientP);
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
          (value: VBankAssets) => {
            vbankAssets = value;
            possiblyUpdateBankPurses();
          },
        );
      };

      void watchVbankAssets();
      void watchBank();
    }

    {
      let agoricBrands: [string, unknown][];
      let nonBankPurses: { balance: unknown; brand: unknown }[];
      let brandToBoardAux: Map<unknown, { displayInfo: unknown }>;

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
          (value: [string, unknown][]) => {
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
      const follower = makeFollower<{ error?: unknown; value: unknown }>(
        `:published.wallet.${address}`,
        leader,
        {
          proof: 'none',
          unserializer: Far('marshaller', {
            ...chainStorageWatcher.marshaller,
          }),
        },
      );

      for await (const update of iterateEach(follower)) {
        console.debug('wallet update', update);
        // @ts-expect-error update unknown bc iterateEach() losing the type
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
