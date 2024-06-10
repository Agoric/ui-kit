import { AgoricProvider, ConnectWalletButton } from '@agoric/react-components';
import { wallets } from 'cosmos-kit';
import { ThemeProvider, useTheme } from '@interchain-ui/react';
import '@agoric/react-components/dist/style.css';

const localnet = {
  testChain: {
    chainId: 'agoriclocal',
    chainName: 'agoric-local',
  },
  apis: {
    rest: ['http://localhost:1317'],
    rpc: ['http://localhost:26657'],
    iconUrl: '/agoriclocal.svg', // Optional icon for Network Dropdown component
  },
};

// Omit "testChain" to specify the apis for Agoric Mainnet.
const mainnet = {
  apis: {
    rest: ['https://main.api.agoric.net'],
    rpc: ['https://main.rpc.agoric.net'],
  },
};

const App = () => {
  const { themeClass } = useTheme();
  return (
    <ThemeProvider>
      <div className={themeClass}>
      <AgoricProvider
        wallets={wallets.extension}
        agoricNetworkConfigs={[localnet, mainnet]}
        /**
         * If unspecified, connects to Agoric Mainnet by default.
         * See "Network Dropdown" below to see how to switch between Agoric testnets.
         */
        defaultChainName="agoric-local"
      >
        <ConnectWalletButton />
      </AgoricProvider>
    </div>
    </ThemeProvider>
  );
};

export default App;
