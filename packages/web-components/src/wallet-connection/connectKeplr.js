// @ts-check
import { getSigningAgoricClientOptions } from '@agoric/cosmic-proto';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Errors } from './errors.js';
/** @typedef {import('@keplr-wallet/types').Keplr} Keplr */

/**
 *
 * @param {string} chainId
 * @param {string} rpc
 */
export const connectKeplr = async (chainId, rpc) => {
  if (!('keplr' in window)) {
    throw Error(Errors.noKeplr);
  }
  /** @type {import('@keplr-wallet/types').Keplr} */
  // @ts-expect-error cast (checked above)
  const keplr = window.keplr;

  await null;
  try {
    await keplr.enable(chainId);
  } catch {
    throw Error(Errors.enableKeplr);
  }

  // Until we have SIGN_MODE_TEXTUAL,
  // Use Amino because Direct results in ugly protobuf in the keplr UI.
  const offlineSigner = await keplr.getOfflineSignerOnlyAmino(chainId);
  console.debug('InteractiveSigner', { offlineSigner });

  // Currently, Keplr extension manages only one address/public key pair.
  const [account] = await offlineSigner.getAccounts();
  const { address } = account;

  const signingClient = await SigningStargateClient.connectWithSigner(
    rpc,
    offlineSigner,
    // @ts-expect-error version mismatch of private 'types' field
    getSigningAgoricClientOptions(),
  );

  return {
    address,
    client: signingClient,
  };
};
