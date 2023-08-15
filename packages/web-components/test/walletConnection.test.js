import './installSesLockdown.js';
import { describe, vi, expect, it } from 'vitest';
import { SigningStargateClient } from '@cosmjs/stargate';
import { makeAgoricWalletConnection } from '../src/wallet-connection/walletConnection.js';
import {
  makeInteractiveSigner,
  // @ts-expect-error exported by mock below
  // eslint-disable-next-line import/named
  submitSpendAction as mockSubmitSpendAction,
} from '../src/wallet-connection/makeInteractiveSigner.js';
import { Errors } from '../src/errors.js';

const testAddress = 'agoric123test';

// @ts-expect-error shim keplr
// eslint-disable-next-line no-undef
global.window = { keplr: {} };

vi.mock('../src/wallet-connection/makeInteractiveSigner.js', () => {
  const submitSpendAction = vi.fn();

  return {
    makeInteractiveSigner: vi.fn(() => ({
      address: testAddress,
      submitSpendAction,
    })),
    submitSpendAction,
  };
});

vi.mock('../src/queryBankBalances.js', () => {
  return {
    queryBankBalances: vi.fn(),
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

    expect(makeInteractiveSigner).toHaveBeenCalledWith(
      watcher.chainId,
      watcher.rpcAddr,
      // @ts-expect-error shim keplr
      window.keplr,
      SigningStargateClient.connectWithSigner,
    );
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

  it('submits a spend action', async () => {
    const watcher = {
      chainId: 'agoric-foo',
      rpcAddr: 'https://foo.agoric.net:443',
      watchLatest: (_path, onUpdate) => {
        onUpdate({ offerToPublicSubscriberPaths: 'foo' });
      },
      marshaller: {
        toCapData: val => val,
      },
    };

    const connection = await makeAgoricWalletConnection(watcher);

    const onStatusChange = () => {
      expect(mockSubmitSpendAction).toHaveBeenCalledWith(
        '{"method":"executeOffer","offer":{"id":123,"invitationSpec":{"invitationSpec":"foo"},"proposal":{"give":"bar","want":"fizz"},"offerArgs":{"arg":"buzz"}}}',
      );
    };

    connection.makeOffer(
      { invitationSpec: 'foo' },
      { give: 'bar', want: 'fizz' },
      { arg: 'buzz' },
      onStatusChange,
      123,
    );
  });
});
