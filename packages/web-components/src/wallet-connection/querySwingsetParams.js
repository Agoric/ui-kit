import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate';
import { QueryClientImpl } from '@agoric/cosmic-proto/swingset/query.js';

/** @typedef {import('@agoric/cosmic-proto/swingset/query.js').QueryParamsResponse} QueryParamsResponse */
/** @typedef {import('@cosmjs/tendermint-rpc').Tendermint34Client} Tendermint34Client */

/**
 * Query swingset params.
 * @param {Tendermint34Client} tendermint
 * @returns {Promise<QueryParamsResponse>}
 */
export const querySwingsetParams = async tendermint => {
  const base = QueryClient.withExtensions(tendermint);
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);

  return queryService.Params({});
};
