import { describe, vi, expect, it } from 'vitest';
import { makeAgoricWalletConnection } from '../src/wallet-connection/walletConnection.js';
import { getKeplrAddress } from '../src/getKeplrAddress.js';
import { Errors } from '../src/errors.js';

const testAddress = 'agoric123test';

vi.mock('../src/getKeplrAddress.js', () => {
  return {
    getKeplrAddress: vi.fn(() => testAddress),
  };
});

vi.mock('../src/queryBankBalances.js', () => {
  return {
    queryBankBalances: vi.fn(),
  };
});

vi.mock('@agoric/ertp', () => {
  return {
    AmountMath: {
      make: (brand, value) => ({ brand, value }),
    },
  };
});

vi.mock('@agoric/notifier', () => {
  return {
    makeNotifierKit: () => ({ updater: { updateState: vi.fn() } }),
  };
});

describe('makeAgoricWalletConnection', () => {
  it('gets the address from keplr', async () => {
    const watcher = {
      chainId: 'agoric-foo',
      rpcAddr: 'https://foo.agoric.net:443',
      watchLatest: (_path, onUpdate) => {
        onUpdate({ offerToPublicSubscriberPaths: 'foo' });
      },
    };

    const connection = await makeAgoricWalletConnection(watcher);

    expect(getKeplrAddress).toHaveBeenCalledWith(watcher.chainId);
    expect(connection.address).toEqual(testAddress);
  });

  it('throws if no smart wallet found', async () => {
    const watcher = {
      chainId: 'agoric-foo',
      rpcAddr: 'https://foo.agoric.net:443',
      watchLatest: (_path, _onUpdate, onError) => {
        onError('not found');
      },
    };

    await expect(makeAgoricWalletConnection(watcher)).rejects.toThrowError(
      Errors.noSmartWallet,
    );
  });
});
