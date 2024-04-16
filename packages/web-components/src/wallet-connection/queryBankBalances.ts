import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate';
import { QueryClientImpl } from 'cosmjs-types/cosmos/bank/v1beta1/query';

/** @typedef {import('@cosmjs/tendermint-rpc').Tendermint34Client} Tendermint34Client */

/**
 * @param {string} address
 * @param {Tendermint34Client} tendermint
 */
export const queryBankBalances = async (address, tendermint) => {
  const queryClient = new QueryClient(tendermint);
  const rpcClient = createProtobufRpcClient(queryClient);
  const bankQueryService = new QueryClientImpl(rpcClient);

  const { balances } = await bankQueryService.AllBalances({
    address,
  });

  return balances;
};
