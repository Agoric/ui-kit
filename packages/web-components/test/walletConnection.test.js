// @ts-check
import './installSesLockdown.js';
import { describe, vi, expect, it } from 'vitest';
import { makeAgoricWalletConnection } from '../src/wallet-connection/walletConnection.js';
import {
  makeAgoricSigner,
  // @ts-expect-error exported by mock below
  // eslint-disable-next-line import/named
  submitSpendAction as mockSubmitSpendAction,
  // @ts-expect-error exported by mock below
  // eslint-disable-next-line import/named
  provisionSmartWallet as mockProvisionSmartWallet,
} from '../src/wallet-connection/makeAgoricSigner.js';
import { Errors } from '../src/errors.js';

const testAddress = 'agoric123test';
const rpc = 'https://fake.rpc';

// @ts-expect-error shim keplr
// eslint-disable-next-line no-undef
global.window = { keplr: {} };

vi.mock('../src/wallet-connection/makeAgoricSigner.js', () => {
  const submitSpendAction = vi.fn();
  const provisionSmartWallet = vi.fn();

  return {
    makeAgoricSigner: vi.fn(() => ({
      address: testAddress,
      submitSpendAction,
      provisionSmartWallet,
    })),
    submitSpendAction,
    provisionSmartWallet,
  };
});

vi.mock('../src/queryBankBalances.js', () => {
  return {
    queryBankBalances: vi.fn(),
  };
});

describe('makeAgoricWalletConnection', () => {
  it('defaults to keplr connection if no client config', async () => {
    const watcher = {
      chainId: 'agoric-foo',
      watchLatest: (_path, onUpdate) => {
        onUpdate({ offerToPublicSubscriberPaths: 'foo' });
      },
    };

    // Don't bother faking keplr, just expect it to try to enable and fail.
    await expect(() =>
      // @ts-expect-error fake partial watcher implementation
      makeAgoricWalletConnection(watcher, rpc),
    ).rejects.toThrowError(Errors.enableKeplr);
  });

  it('gets the address from the client config', async () => {
    const watcher = {
      chainId: 'agoric-foo',
      watchLatest: (_path, onUpdate) => {
        onUpdate({ offerToPublicSubscriberPaths: 'foo' });
      },
    };

    const connection = await makeAgoricWalletConnection(
      // @ts-expect-error fake partial watcher implementation
      watcher,
      rpc,
      undefined,
      { address: testAddress, client: {} },
    );

    expect(makeAgoricSigner).toHaveBeenCalledWith({}, testAddress);
    expect(connection.address).toEqual(testAddress);
  });

  it('submits a spend action', async () => {
    const watcher = {
      chainId: 'agoric-foo',
      watchLatest: (_path, onUpdate) => {
        onUpdate({ offerToPublicSubscriberPaths: 'foo' });
      },
      marshaller: {
        toCapData: val => val,
      },
    };

    const connection = await makeAgoricWalletConnection(
      // @ts-expect-error fake partial watcher implementation
      watcher,
      rpc,
      undefined,
      { address: testAddress, client: {} },
    );

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

it('submits a spend action', async () => {
  const watcher = {
    chainId: 'agoric-foo',
    watchLatest: (_path, onUpdate) => {
      onUpdate({ offerToPublicSubscriberPaths: 'foo' });
    },
    marshaller: {
      toCapData: val => val,
    },
  };

  const connection = await makeAgoricWalletConnection(
    // @ts-expect-error fake partial watcher implementation
    watcher,
    rpc,
    undefined,
    { address: testAddress, client: {} },
  );

  connection.provisionSmartWallet();
  expect(mockProvisionSmartWallet).toHaveBeenCalled();
});
