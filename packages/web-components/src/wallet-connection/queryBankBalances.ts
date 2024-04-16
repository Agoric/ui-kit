import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate';
import type { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { QueryClientImpl } from 'cosmjs-types/cosmos/bank/v1beta1/query';

export const queryBankBalances = async (
  address: string,
  tendermint: Tendermint34Client,
) => {
  const queryClient = new QueryClient(tendermint);
  const rpcClient = createProtobufRpcClient(queryClient);
  const bankQueryService = new QueryClientImpl(rpcClient);

  const { balances } = await bankQueryService.AllBalances({
    address,
  });

  return balances;
};
