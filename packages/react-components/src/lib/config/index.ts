import { assets, chains } from 'chain-registry';
import type { AssetList, Chain } from '@chain-registry/types';
import type { Endpoints } from '@cosmos-kit/core';

export type ChainConfig = { chains: Chain[]; assetLists: AssetList[] };

export const prettyTestChainName = (name: string) =>
  name
    .split('-')
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join(' ');

export const agoricChain = chains.find((chain: Chain) => {
  return chain.chain_name === 'agoric';
}) as Chain | undefined;

export const makeChainInfo = (
  chainName: string,
  chainId: string,
  apis: Endpoints,
) => {
  assert(
    agoricChain,
    'Agoric missing from chain registry, cannot initiliaze test chains',
  );

  return {
    ...agoricChain,
    ...{
      chain_id: chainId ?? chainName,
      chain_name: chainName,
      pretty_name: prettyTestChainName(chainName),
      apis,
    },
  } as Chain;
};

const agoricAssetList = assets.find((assetList: AssetList) => {
  return assetList.chain_name === 'agoric';
});

export const makeAssetList = (chain_name: string) => {
  assert(
    agoricAssetList,
    'Agoric missing from chain registry, cannot initiliaze test chains',
  );

  return { ...agoricAssetList, chain_name } as AssetList;
};
