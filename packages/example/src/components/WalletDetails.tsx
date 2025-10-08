import { useAgoric, type PurseJSONState } from '@agoric/react-components';
import { stringifyAmountValue, stringifyValue } from '@agoric/web-components';

const WalletDetails = () => {
  const {
    isSmartWalletProvisioned,
    purses,
    address,
    provisionSmartWallet,
    smartWalletProvisionFee,
    makeOffer,
  } = useAgoric();
  const usdcPurseBrand = purses?.find(p => p.brandPetname === 'USDC')
    ?.currentAmount.brand;

  const testTransaction = () => {
    makeOffer?.(
      {
        source: 'agoricContract',
        instancePath: ['fastUsdc'],
        callPipe: [['makeDepositInvitation', []]],
      },
      {
        give: { USDC: { brand: usdcPurseBrand, value: 10_000n } },
        want: {},
      },
      {},
      (status: object) => {
        console.log(status);
      },
    );
  };

  return (
    <div>
      <div>
        <p>Address: {address}</p>
      </div>
      <div>
        <p>
          Purses:{' '}
          {purses === undefined
            ? 'Loading...'
            : purses
                .map(
                  (p: PurseJSONState<'nat' | 'copyBag' | 'set' | 'copySet'>) =>
                    p.brandPetname +
                    ': ' +
                    stringifyAmountValue(
                      p.currentAmount,
                      p.displayInfo.assetKind,
                      p.displayInfo.decimalPlaces,
                    ),
                )
                .join(', ')}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}></div>
      <div>
        <p>
          Smart Wallet Provisioned:{' '}
          {isSmartWalletProvisioned === undefined
            ? 'Loading...'
            : isSmartWalletProvisioned
              ? 'Yes'
              : 'No'}
        </p>
      </div>
      {isSmartWalletProvisioned === false && smartWalletProvisionFee ? (
        <div>
          <p>
            Smart Wallet Provision Fee:{' '}
            {stringifyValue(smartWalletProvisionFee, 'nat', 6)} BLD
          </p>
          <p>
            Try{' '}
            <a
              href="https://devnet.faucet.agoric.net/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'cyan', textDecoration: 'underline' }}
            >
              https://devnet.faucet.agoric.net
            </a>{' '}
            to get BLD
          </p>
          <button
            style={{ marginTop: '10px' }}
            onClick={async () => {
              try {
                await provisionSmartWallet!();
              } catch (error: unknown) {
                console.error(error);
                alert('Error provisioning smart wallet: ' + error);
              }
            }}
          >
            Provision Smart Wallet
          </button>
        </div>
      ) : (
        <button onClick={testTransaction}>Test Transaction</button>
      )}
    </div>
  );
};

export default WalletDetails;
