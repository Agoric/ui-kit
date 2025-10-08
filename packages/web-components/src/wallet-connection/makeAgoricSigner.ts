import { fromBech32, toBase64 } from '@cosmjs/encoding';
import { assertIsDeliverTxSuccess } from '@cosmjs/stargate';
import { stakeCurrency } from './chainInfo.js';
import { AgoricMsgs } from './signerOptions.js';
import type { SigningStargateClient, StdFee } from '@cosmjs/stargate';

const toAccAddress = (address: string): Uint8Array => {
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

// Empirically Keplr seems to use 15000 ubld and 300000 gas for medium fee preset.
const defaultFeeAmount = '15000';
const defaultFeeGas = '300000';

const defaultFee = (): StdFee => {
  const { coinMinimalDenom: denom } = stakeCurrency;
  const fee = {
    amount: [{ amount: defaultFeeAmount, denom }],
    gas: defaultFeeGas, // TODO: estimate gas?
  };
  return fee;
};

/**
 * Use a signing client to create a signer for Agoric-specific transactions
 * @param signingClient
 * @param address
 * Ref: https://docs.keplr.app/api/
 */
export const makeAgoricSigner = (
  signingClient: SigningStargateClient,
  address: string,
) => {
  const fee = defaultFee();

  return harden({
    /**
     * Sign and broadcast Provision for a new smart wallet
     *
     * @throws if account does not exist on chain, user cancels,
     *         RPC connection fails, RPC service fails to broadcast (
     *         for example, if signature verification fails)
     */
    provisionSmartWallet: async () => {
      const { accountNumber, sequence } =
        await signingClient.getSequence(address);
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
     * @param spendAction marshaled offer
     * @throws if account does not exist on chain, user cancels,
     *         RPC connection fails, RPC service fails to broadcast (
     *         for example, if signature verification fails)
     */
    submitSpendAction: async (spendAction: string) => {
      const { accountNumber, sequence } =
        await signingClient.getSequence(address);
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
