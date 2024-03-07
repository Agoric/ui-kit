import { Endpoints } from '@cosmos-kit/core';
import { createContext } from 'react';

export type NetworkConfig = {
  apis: Endpoints;
  testChain?: {
    chainId: string;
    chainName: string;
    iconUrl?: string;
  };
};

export const NetworkContext = createContext<{
  networkConfig?: NetworkConfig;
  setNetworkConfig?: (config: NetworkConfig) => void;
}>({});
