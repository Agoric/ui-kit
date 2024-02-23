import { NetworkContext } from './NetworkContext';
import { PropsWithChildren, useState } from 'react';
import type { NetworkConfig } from './NetworkContext';

type Props = { defaultNetworkConfig: NetworkConfig };

const storageKey = 'agoric-saved-network-config';

const readFromStorage = () => {
  const data = localStorage.getItem(storageKey);
  return data && JSON.parse(data);
};

const writeToStorage = (networkConfig: NetworkConfig) => {
  const data = JSON.stringify(networkConfig);
  localStorage.setItem(storageKey, data);
};

export const NetworkProvider = ({
  defaultNetworkConfig,
  children,
}: PropsWithChildren<Props>) => {
  const [networkConfig] = useState(readFromStorage() ?? defaultNetworkConfig);

  const setNetworkConfig = (newConfig: NetworkConfig) => {
    writeToStorage(newConfig);
    window.location.reload();
  };

  return (
    <NetworkContext.Provider value={{ networkConfig, setNetworkConfig }}>
      {children}
    </NetworkContext.Provider>
  );
};
