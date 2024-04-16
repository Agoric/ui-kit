/** @typedef {import('@keplr-wallet/types').Bech32Config} Bech32Config */
/** @typedef {import('@keplr-wallet/types').FeeCurrency} FeeCurrency */

/** @type {FeeCurrency} */
export const stakeCurrency = {
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

/** @type {FeeCurrency} */
export const stableCurrency = {
  coinDenom: 'IST',
  coinMinimalDenom: 'uist',
  coinDecimals: 6,
  coinGeckoId: undefined,
  gasPriceStep: {
    low: 0,
    average: 0,
    high: 0,
  },
};

/** @type {Bech32Config} */
export const bech32Config = {
  bech32PrefixAccAddr: 'agoric',
  bech32PrefixAccPub: 'agoricpub',
  bech32PrefixValAddr: 'agoricvaloper',
  bech32PrefixValPub: 'agoricvaloperpub',
  bech32PrefixConsAddr: 'agoricvalcons',
  bech32PrefixConsPub: 'agoricvalconspub',
};
