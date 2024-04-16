import { Registry } from '@cosmjs/proto-signing';
import {
  SigningStargateClient,
  AminoTypes,
  defaultRegistryTypes,
  createBankAminoConverters,
  createAuthzAminoConverters,
} from '@cosmjs/stargate';
import { Errors } from './errors.js';
import { agoricConverters, agoricRegistryTypes } from './signerOptions.js';

import type { Keplr } from '@keplr-wallet/types';

export const connectKeplr = async (chainId: string, rpc: string) => {
  if (!('keplr' in window)) {
    throw Error(Errors.noKeplr);
  }
  const keplr = window.keplr as Keplr;

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
    {
      aminoTypes: new AminoTypes({
        ...agoricConverters,
        ...createBankAminoConverters(),
        ...createAuthzAminoConverters(),
      }),
      registry: new Registry([...defaultRegistryTypes, ...agoricRegistryTypes]),
    },
  );

  return {
    address,
    client: signingClient,
  };
};
