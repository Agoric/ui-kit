import {
  MsgProvision,
  MsgWalletSpendAction,
} from '@agoric/cosmic-proto/swingset/msgs.js';
import { fromBase64, fromBech32, toBase64, toBech32 } from '@cosmjs/encoding';
import { bech32Config } from './chainInfo.js';

import type { AminoConverters } from '@cosmjs/stargate';
import type { GeneratedType } from '@cosmjs/proto-signing';

const dbg = label => x => {
  console.debug(label, x);
  return x;
};

const toAccAddress = (address: string): Uint8Array => {
  return fromBech32(address).data;
};

/**
 * `/agoric.swingset.XXX` matches package agoric.swingset in swingset/msgs.proto
 * aminoType taken from Type() in golang/cosmos/x/swingset/types/msgs.go
 */
export const AgoricMsgs = {
  MsgWalletSpendAction: {
    typeUrl: '/agoric.swingset.MsgWalletSpendAction',
    aminoType: 'swingset/WalletSpendAction',
  },
  MsgProvision: {
    typeUrl: '/agoric.swingset.MsgProvision',
    aminoType: 'swingset/Provision',
  },
};

export const agoricRegistryTypes: [string, GeneratedType][] = [
  [
    AgoricMsgs.MsgWalletSpendAction.typeUrl,
    MsgWalletSpendAction as GeneratedType,
  ],
  [AgoricMsgs.MsgProvision.typeUrl, MsgProvision as GeneratedType],
];

export const agoricConverters: AminoConverters = {
  [AgoricMsgs.MsgWalletSpendAction.typeUrl]: {
    aminoType: AgoricMsgs.MsgWalletSpendAction.aminoType,
    toAmino: ({ spendAction, owner }) => ({
      spend_action: spendAction,
      owner: toBech32(bech32Config.bech32PrefixAccAddr, fromBase64(owner)),
    }),
    fromAmino: ({ spend_action: spendAction, owner }) => ({
      spendAction,
      owner: toBase64(toAccAddress(owner)),
    }),
  },
  [AgoricMsgs.MsgProvision.typeUrl]: {
    aminoType: AgoricMsgs.MsgProvision.aminoType,
    toAmino: protoVal => {
      const { nickname, address, powerFlags, submitter } = dbg(
        'provision toAmino protoVal',
      )(protoVal);
      return {
        address: toBech32(
          bech32Config.bech32PrefixAccAddr,
          fromBase64(address),
        ),
        nickname,
        powerFlags,
        submitter: toBech32(
          bech32Config.bech32PrefixAccAddr,
          fromBase64(submitter),
        ),
      };
    },
    fromAmino: aminoVal => {
      const { nickname, address, powerFlags, submitter } = dbg(
        'provision fromAmino aminoVal',
      )(aminoVal);
      return {
        address: toBase64(toAccAddress(address)),
        nickname,
        powerFlags,
        submitter: toBase64(toAccAddress(submitter)),
      };
    },
  },
};
