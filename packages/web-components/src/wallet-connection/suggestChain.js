import { bech32Config, stableCurrency, stakeCurrency } from './chainInfo.js';

/**  @typedef {import('@agoric/casting/src/netconfig').NetworkConfig} NetworkConfig */
/**  @typedef {import('@keplr-wallet/types').ChainInfo} ChainInfo */
/**  @typedef {import('@keplr-wallet/types').Keplr} Keplr */

export const AGORIC_COIN_TYPE = 564;
export const COSMOS_COIN_TYPE = 118;

/**
 *
 * @param {NetworkConfig} networkConfig
 * @param {string} caption
 * @param {number} randomFloat
 * @param {string | undefined} walletUrlForStaking
 * @returns {ChainInfo}
 */
const makeChainInfo = (
  networkConfig,
  caption,
  randomFloat,
  walletUrlForStaking,
) => {
  const { chainName, rpcAddrs, apiAddrs } = networkConfig;
  const index = Math.floor(randomFloat * rpcAddrs.length);

  const rpcAddr = rpcAddrs[index];
  const rpc = rpcAddr.match(/:\/\//) ? rpcAddr : `http://${rpcAddr}`;

  const rest = apiAddrs
    ? // pick the same index
      apiAddrs[index]
    : // adapt from rpc
      rpc.replace(/(:\d+)?$/, ':1317');

  return {
    rpc,
    rest,
    chainId: chainName,
    chainName: caption,
    stakeCurrency,
    walletUrlForStaking,
    bip44: {
      coinType: AGORIC_COIN_TYPE,
    },
    bech32Config,
    currencies: [stakeCurrency, stableCurrency],
    feeCurrencies: [stableCurrency],
    features: ['stargate', 'ibc-transfer'],
  };
};

/**
 *
 * @param {string} networkConfigHref
 * @param {string=} caption
 */
export async function suggestChain(networkConfigHref, caption) {
  // @ts-expect-error Check for Keplr
  const { keplr } = window;

  if (!keplr) {
    throw Error('Missing Keplr');
  }

  console.debug('suggestChain: fetch', networkConfigHref); // log net IO
  const url = new URL(networkConfigHref);
  const res = await fetch(url);
  if (!res.ok) {
    throw Error(`Cannot fetch network: ${res.status}`);
  }

  const networkConfig = await res.json();

  if (!caption) {
    const subdomain = url.hostname.split('.')[0];
    caption = `Agoric ${subdomain}`;
  }

  const walletUrlForStaking = `https://${url.hostname}.staking.agoric.app`;

  const chainInfo = makeChainInfo(
    networkConfig,
    caption,
    Math.random(),
    walletUrlForStaking,
  );
  console.debug('chainInfo', chainInfo);
  await keplr.experimentalSuggestChain(chainInfo);

  return chainInfo;
}
