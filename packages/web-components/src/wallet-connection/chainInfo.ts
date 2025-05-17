import type { Bech32Config, FeeCurrency } from '@keplr-wallet/types';

export const stakeCurrency: FeeCurrency = {
  coinDenom: 'BLD',
  coinMinimalDenom: 'ubld',
  coinDecimals: 6,
  coinGeckoId: undefined,
  gasPriceStep: {
    low: 0,
    average: 0,
    high: 0,
  },
};

export const bech32Config: Bech32Config = {
  bech32PrefixAccAddr: 'agoric',
  bech32PrefixAccPub: 'agoricpub',
  bech32PrefixValAddr: 'agoricvaloper',
  bech32PrefixValPub: 'agoricvaloperpub',
  bech32PrefixConsAddr: 'agoricvalcons',
  bech32PrefixConsPub: 'agoricvalconspub',
};
