import { fromBech32, toBase64 } from '@cosmjs/encoding';
import { assertIsDeliverTxSuccess } from '@cosmjs/stargate';
import { stableCurrency } from './chainInfo.js';
import { AgoricMsgs } from './signerOptions.js';

/** @typedef {import("@cosmjs/proto-signing").EncodeObject} EncodeObject */
/** @typedef {import("@cosmjs/stargate").AminoConverters} AminoConverters */
/** @typedef {import("@cosmjs/stargate").StdFee} StdFee */
/** @typedef {import('@keplr-wallet/types').ChainInfo} ChainInfo */
/** @typedef {import('@keplr-wallet/types').Keplr} Keplr */
/** @typedef {import('@cosmjs/stargate').SigningStargateClient} SigningStargateClient */

/**
 * @param {string} address
 * @returns {Uint8Array}
 */
const toAccAddress = address => {
  return fromBech32(address).data;
};

// XXX domain of @agoric/cosmic-proto
/**
 * non-exhaustive list of powerFlags
 *
 * See also MsgProvision in golang/cosmos/proto/agoric/swingset/msgs.proto
 */
const PowerFlags = {
  SMART_WALLET: 'SMART_WALLET',
};

/** @typedef {{owner: string, spendAction: string}} WalletSpendAction */

/**
 * @returns {StdFee}
 */
const zeroFee = () => {
  const { coinMinimalDenom: denom } = stableCurrency;
  const fee = {
    amount: [{ amount: '0', denom }],
    gas: '300000', // TODO: estimate gas?
  };
  return fee;
};

/**
 * Use a signing client to
 * @param {SigningStargateClient} signingClient
 * @param {string} address
 * Ref: https://docs.keplr.app/api/
 */
export const makeAgoricSigner = (signingClient, address) => {
  const fee = zeroFee();

  return harden({
    /**
     * Sign and broadcast Provision for a new smart wallet
     *
     * @throws if account does not exist on chain, user cancels,
     *         RPC connection fails, RPC service fails to broadcast (
     *         for example, if signature verification fails)
     */
    provisionSmartWallet: async () => {
      const { accountNumber, sequence } = await signingClient.getSequence(
        address,
      );
      console.log({ accountNumber, sequence });

      const b64address = toBase64(toAccAddress(address));

      const act1 = {
        typeUrl: AgoricMsgs.MsgProvision.typeUrl,
        value: {
          address: b64address,
          nickname: 'my wallet',
          powerFlags: [PowerFlags.SMART_WALLET],
          submitter: b64address,
        },
      };

      const msgs = [act1];
      console.log('sign provision', { address, msgs, fee });

      const tx = await signingClient.signAndBroadcast(address, msgs, fee);
      console.log('spend action result tx', tx);
      assertIsDeliverTxSuccess(tx);

      return tx;
    },

    /**
     * Sign and broadcast WalletSpendAction
     *
     * @param {string} spendAction marshaled offer
     * @throws if account does not exist on chain, user cancels,
     *         RPC connection fails, RPC service fails to broadcast (
     *         for example, if signature verification fails)
     */
    submitSpendAction: async spendAction => {
      const { accountNumber, sequence } = await signingClient.getSequence(
        address,
      );
      console.debug({ accountNumber, sequence });

      const act1 = {
        typeUrl: AgoricMsgs.MsgWalletSpendAction.typeUrl,
        value: {
          owner: toBase64(toAccAddress(address)),
          spendAction,
        },
      };

      const msgs = [act1];
      console.debug('sign spend action', { address, msgs, fee });

      const tx = await signingClient.signAndBroadcast(address, msgs, fee);
      console.debug('spend action result tx', tx);
      assertIsDeliverTxSuccess(tx);

      return tx;
    },
  });
};
