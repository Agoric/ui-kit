import { useEffect } from 'react';
import WalletDetails from './components/WalletDetails';
import { useWalletManager } from './hooks/useWalletManager';
import { AgoricProvider } from '@agoric/react-components';
import { CHAIN_ID, REST_ENDPOINT, RPC_ENDPOINT } from './utils/constants';

function App() {
  const { address, connectWallet, offlineSigner } = useWalletManager();

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <AgoricProvider
      restEndpoint={REST_ENDPOINT}
      rpcEndpoint={RPC_ENDPOINT}
      offlineSigner={offlineSigner}
      address={address}
      chainName={CHAIN_ID}
    >
      <div>
        <div>
          <h1> Agoric Wallet</h1>
          {!address ? (
            <button onClick={connectWallet}>Connect Keplr</button>
          ) : (
            <WalletDetails />
          )}
        </div>
      </div>
    </AgoricProvider>
  );
}

export default App;
