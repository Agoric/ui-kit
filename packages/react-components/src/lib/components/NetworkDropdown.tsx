import { type NetworkConfig } from '../context/NetworkContext.js';
import { useAgoricNetwork } from '../hooks/network.js';
import { agoricChain, prettyTestChainName } from '../config/index.js';
import { ChangeChainCombobox } from '@interchain-ui/react';
import { useState } from 'react';

export type NetworkDropdownProps = {
  networkConfigs: NetworkConfig[];
  label?: ChangeChainCombobox['label'];
  size?: ChangeChainCombobox['size'];
  appearance?: ChangeChainCombobox['appearance'];
  maxHeight?: ChangeChainCombobox['maxHeight'];
};

const nameForNetwork = (network: NetworkConfig) => {
  const name = network.testChain?.chainName ?? agoricChain?.chain_name;
  assert(
    name,
    'Cannot find default Agoric chain in registry, testChain must be provided.',
  );
  return name;
};

const iconForNetwork = (network: NetworkConfig) => {
  return network.testChain === undefined
    ? agoricChain?.images?.[0].svg
    : network.testChain.iconUrl;
};

export const NetworkDropdown = ({
  networkConfigs,
  label,
  maxHeight,
  size = 'md',
  appearance = 'bold',
}: NetworkDropdownProps) => {
  const { networkConfig, setNetworkConfig } = useAgoricNetwork();
  assert(
    networkConfig && setNetworkConfig,
    'NetworkDropdown error, NetworkContext missing',
  );

  const [selectedChain, setSelectedChain] = useState<{
    label: string;
    value: string;
    iconUrl?: string;
  }>({
    value: nameForNetwork(networkConfig),
    label: prettyTestChainName(nameForNetwork(networkConfig)),
    iconUrl: iconForNetwork(networkConfig),
  });

  const dropdownList = networkConfigs.map(config => {
    return {
      value: nameForNetwork(config),
      label: prettyTestChainName(nameForNetwork(config)),
      iconUrl: iconForNetwork(config),
    };
  });

  return (
    <ChangeChainCombobox
      maxHeight={maxHeight}
      label={label}
      isClearable={false}
      defaultSelected={selectedChain}
      size={size}
      valueItem={selectedChain}
      appearance={appearance}
      onItemSelected={item => {
        if (!item) return;
        const selectedNetworkConfig = networkConfigs.find(network => {
          return nameForNetwork(network) === item?.value;
        });
        assert(
          selectedNetworkConfig,
          'Selected chain missing from networkConfigs',
        );
        setSelectedChain(item);
        setNetworkConfig(selectedNetworkConfig);
      }}
      options={dropdownList}
    />
  );
};
