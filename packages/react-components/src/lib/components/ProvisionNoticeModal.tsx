import { BasicModal, Button, Text } from '@interchain-ui/react';
import { useAgoric } from '../hooks';
import { stringifyValue } from '@agoric/web-components';
import { AssetKind } from '@agoric/ertp';

const feeDecimals = 6;

const formatFeeUnit = (unit?: string) => {
  if (!unit) return '';
  return unit === 'ubld' ? 'BLD' : unit === 'uist' ? 'IST' : unit;
};

const defaultContent = (fee?: bigint, feeUnit?: string) => {
  const prettyFee = stringifyValue(fee, AssetKind.NAT, feeDecimals);
  const prettyFeeUnit = formatFeeUnit(feeUnit);

  return (
    <Text fontSize="large">
      To interact with contracts on the Agoric chain, a smart wallet must be
      created for your account. You will need{' '}
      <Text fontSize="large" as="span" fontWeight="$bold">
        {prettyFee} {prettyFeeUnit}
      </Text>{' '}
      to fund its provision which will be deposited into the reserve pool. Click
      "Proceed" to provision wallet and submit transaction.
    </Text>
  );
};

export type Props = {
  onClose: () => void;
  proceed?: () => void;
  mainContent?: (fee?: bigint, feeUnit?: string) => JSX.Element;
  renderOnboardTokenTrigger?: () => JSX.Element;
};

export const ProvisionNoticeModal = ({
  onClose,
  proceed,
  renderOnboardTokenTrigger,
  mainContent = defaultContent,
}: Props) => {
  const { smartWalletProvisionFee, smartWalletProvisionFeeUnit, purses } =
    useAgoric();
  const bldPurse = purses?.find(p => p.brandPetname === 'BLD');
  const istPurse = purses?.find(p => p.brandPetname === 'IST');
  const canProceed =
    !smartWalletProvisionFee ||
    (smartWalletProvisionFeeUnit === 'ubld' &&
      bldPurse &&
      bldPurse.currentAmount.value >= smartWalletProvisionFee) ||
    (smartWalletProvisionFeeUnit === 'uist' &&
      istPurse &&
      istPurse.currentAmount.value >= smartWalletProvisionFee);

  const renderBalance = () => {
    if (smartWalletProvisionFeeUnit === 'ubld' && bldPurse) {
      return (
        <div className="flex items-center">
          <Text fontSize="large">
            BLD Balance:{' '}
            <Text as="span" fontSize="large" fontWeight="$bold">
              {stringifyValue(
                bldPurse.currentAmount.value,
                AssetKind.NAT,
                feeDecimals,
              )}
            </Text>
          </Text>
        </div>
      );
    }
    if (smartWalletProvisionFeeUnit === 'uist' && istPurse) {
      return (
        <div className="flex items-center">
          <Text fontSize="large">
            IST Balance:{' '}
            <Text as="span" fontSize="large" fontWeight="$bold">
              {stringifyValue(
                istPurse.currentAmount.value,
                AssetKind.NAT,
                feeDecimals,
              )}
            </Text>
          </Text>
        </div>
      );
    }
    return null;
  };

  return (
    <BasicModal
      modalContentClassName="max-w-3xl"
      title="Smart Wallet Required"
      closeOnClickaway={false}
      isOpen={proceed !== undefined}
      onClose={onClose}
    >
      <div className="my-4">
        {mainContent(smartWalletProvisionFee, smartWalletProvisionFeeUnit)}
        <div className="my-4 flex justify-center gap-4">{renderBalance()}</div>
        {renderOnboardTokenTrigger?.()}
      </div>
      <div className="flex justify-end gap-2 mt-6">
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
