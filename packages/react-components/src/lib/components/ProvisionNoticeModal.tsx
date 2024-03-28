import { BasicModal, Button, Text } from '@interchain-ui/react';
import { useAgoric } from '../hooks';
import { stringifyValue } from '@agoric/web-components';
import { AssetKind } from '@agoric/ertp';
import { OnboardIstModal } from './OnboardIstModal';

const feeDecimals = 6;

const defaultContent = (fee?: bigint) => {
  const prettyFee = stringifyValue(fee, AssetKind.NAT, feeDecimals);

  return (
    <Text fontSize="large">
      To interact with contracts on the Agoric chain, a smart wallet must be
      created for your account. You will need{' '}
      <Text fontSize="large" as="span" fontWeight="$bold">
        {prettyFee} IST
      </Text>{' '}
      to fund its provision which will be deposited into the reserve pool. Click
      "Proceed" to provision wallet and submit transaction.
    </Text>
  );
};

export type Props = {
  onClose: () => void;
  proceed?: () => void;
  mainContent?: (fee?: bigint) => JSX.Element;
};

export const ProvisionNoticeModal = ({
  onClose,
  proceed,
  mainContent = defaultContent,
}: Props) => {
  const { smartWalletProvisionFee, purses } = useAgoric();
  const istPurse = purses?.find(p => p.brandPetname === 'IST');
  const canProceed =
    !smartWalletProvisionFee ||
    (istPurse && istPurse.currentAmount.value >= smartWalletProvisionFee);

  return (
    <BasicModal
      modalContentClassName="max-w-3xl"
      title="Smart Wallet Required"
      closeOnClickaway={false}
      isOpen={proceed !== undefined}
      onClose={onClose}
    >
      <div className="my-4">
        {mainContent(smartWalletProvisionFee)}
        <div className="my-4 flex justify-center gap-4">
          {istPurse && (
            <div className="flex items-center">
              <Text fontSize="large">
                IST Balance:{' '}
                <Text as="span" fontSize="large" fontWeight="$bold">
                  {istPurse &&
                    stringifyValue(
                      istPurse.currentAmount.value,
                      AssetKind.NAT,
                      feeDecimals,
                    )}
                </Text>
              </Text>
            </div>
          )}
          <OnboardIstModal />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button intent="secondary" onClick={onClose}>
          Go Back
        </Button>
        <Button onClick={proceed} disabled={!canProceed}>
          Proceed
        </Button>
      </div>
    </BasicModal>
  );
};
