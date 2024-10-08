import { useState } from 'react';
import styled, { type AnyStyledComponent } from 'styled-components';
import type { NumberFormatValues } from 'react-number-format';
import type { SyntheticInputEvent } from 'react-number-format/types/types';
import BigNumber from 'bignumber.js';

import { AlertType } from '@/constants/alerts';
import { ButtonShape, ButtonSize } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { DestinationAddressOptions } from '@/constants/migrate';
import { NumberSign, TOKEN_DECIMALS } from '@/constants/numbers';

import { formMixins } from '@/styles/formMixins';
import { layoutMixins } from '@/styles/layoutMixins';

import {
  useAccounts,
  useStringGetter,
  useAccountBalance,
  useMigrateToken,
  useRestrictions,
} from '@/hooks';

import { DiffOutput } from '@/components/DiffOutput';
import { FormInput } from '@/components/FormInput';
import { Icon, IconName } from '@/components/Icon';
import { InputType } from '@/components/Input';
import { OutputType } from '@/components/Output';
import { RadioGroup } from '@/components/RadioGroup';
import { Tag } from '@/components/Tag';
import { ToggleButton } from '@/components/ToggleButton';
import { WithDetailsReceipt } from '@/components/WithDetailsReceipt';

import { MustBigNumber } from '@/lib/numbers';
import { truncateAddress } from '@/lib/wallet';

import { PreviewMigrateButtonAndReceipt } from './PreviewMigrateButtonAndReceipt';

export const MigrateFormEditingStep = () => {
  const stringGetter = useStringGetter();
  const { DoraAddress: accountDoraAddress } = useAccounts();
  const { ethDORABalance } = useAccountBalance();
  const { isAddressSanctioned } = useRestrictions();

  const {
    amountBN,
    destinationAddress,
    setAmountBN,
    setDestinationAddress,
    isAmountValid,
    isDestinationAddressValid,
  } = useMigrateToken();

  const [destinationAddressOption, setDestinationAddressOption] = useState(
    DestinationAddressOptions.Account
  );

  const ethDORABalanceBN = MustBigNumber(ethDORABalance);
  const newethDORABalanceBN = ethDORABalanceBN.minus(amountBN ?? 0);

  const onOptionChange = (option: string) => {
    if (option === DestinationAddressOptions.Other) {
      setDestinationAddress('');
    } else if (accountDoraAddress) {
      setDestinationAddress(accountDoraAddress);
    }
    setDestinationAddressOption(option as DestinationAddressOptions);
  };

  const onPasteAddress = async () => {
    try {
      const value = await navigator.clipboard.readText();
      setDestinationAddress(value);
    } catch (error) {
      // expected error if user rejects clipboard access
    }
  };

  const amountDetailItems = [
    {
      key: 'amount',
      label: (
        <Styled.InlineRow>
          Available on Ethereum
          <Tag>ethDORA</Tag>
        </Styled.InlineRow>
      ),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={ethDORABalance?.toString()}
          newValue={newethDORABalanceBN.toString()}
          sign={NumberSign.Negative}
          hasInvalidNewValue={newethDORABalanceBN.isNegative()}
          withDiff={ethDORABalance !== undefined && amountBN && amountBN.gt(0)}
          roundingMode={BigNumber.ROUND_DOWN}
        />
      ),
    },
  ];

  const renderFormInputButton = ({
    label,
    isInputEmpty,
    onClear,
    onClick,
  }: {
    label: string | React.ReactNode[];
    isInputEmpty: boolean;
    onClear: () => void;
    onClick: () => void;
  }) => (
    <Styled.FormInputToggleButton
      size={ButtonSize.XSmall}
      isPressed={!isInputEmpty}
      onPressedChange={(isPressed: boolean) => (isPressed ? onClick : onClear)()}
      shape={isInputEmpty ? ButtonShape.Rectangle : ButtonShape.Circle}
    >
      {isInputEmpty ? label : <Icon iconName={IconName.Close} />}
    </Styled.FormInputToggleButton>
  );

  return (
    <>
      <WithDetailsReceipt side="bottom" detailItems={amountDetailItems}>
        <Styled.FormInput
          id="amount"
          label="Amount"
          type={InputType.Number}
          onChange={({ floatValue }: NumberFormatValues) => setAmountBN(MustBigNumber(floatValue))}
          value={amountBN?.toFixed(
            Math.min(TOKEN_DECIMALS, amountBN?.dp() ?? 0),
            BigNumber.ROUND_DOWN
          )}
          slotRight={renderFormInputButton({
            label: 'Max',
            isInputEmpty: !amountBN,
            onClear: () => setAmountBN(undefined),
            onClick: () => ethDORABalance && setAmountBN(ethDORABalanceBN),
          })}
          validationConfig={
            amountBN && !amountBN.gt(0.1) &&
            {
              attached: true,
              type: AlertType.Error,
              message: 'Please enter a quantity greater than 0.1',
            }
          }
        />
      </WithDetailsReceipt>

      <Styled.Label>Send to your Dora Vota Address</Styled.Label>
      <Styled.AdressInputContainer>
        <Styled.InnerFormInput
          id="destination"
          onInput={(e: SyntheticInputEvent) => setDestinationAddress(e.target?.value)}
          label={
            <Styled.DestinationInputLabel>
              Dora Vota Address
              {isDestinationAddressValid && <Icon iconName={IconName.Check} />}
            </Styled.DestinationInputLabel>
          }
          type={InputType.Text}
          value={destinationAddress}
          placeholder={'Enter Dora Vota address'}
          slotRight={renderFormInputButton({
            label: "Paste",
            isInputEmpty: !destinationAddress,
            onClear: () => setDestinationAddress(''),
            onClick: onPasteAddress,
          })}
          validationConfig={
            destinationAddress &&
            !isDestinationAddressValid && {
              attached: true,
              type: AlertType.Error,
              message: 'Please enter a valid DORA Vota address.',
            }
          }
        />
      </Styled.AdressInputContainer>
      <Styled.Footer>
        <PreviewMigrateButtonAndReceipt isDisabled={!isAmountValid || !isDestinationAddressValid} />
      </Styled.Footer>
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.FormInput = styled(FormInput)`
  --form-input-height: 3.5rem;
`;

Styled.InnerFormInput = styled(FormInput)`
  --input-backgroundColor: var(--color-layer-5);
  input {
    font: var(--font-mini-book);
  }
`;

Styled.Footer = styled.footer`
  ${layoutMixins.stickyFooter}
  margin-top: auto;
`;

Styled.Row = styled.div`
  ${layoutMixins.gridEqualColumns}
  gap: var(--form-input-gap);
`;

Styled.DestinationInputLabel = styled.span`
  ${layoutMixins.inlineRow}

  svg {
    color: var(--color-positive);
  }
`;

Styled.AdressInputContainer = styled.div`
  ${layoutMixins.flexColumn}
  gap: var(--form-input-gap);
  text-align: start;
`;

Styled.FormInputToggleButton = styled(ToggleButton)`
  ${formMixins.inputInnerToggleButton}

  svg {
    color: var(--color-text-0);
  }
`;

Styled.AddressOption = styled.div`
  ${layoutMixins.column}
  text-align:start;
  gap: 0.5rem;

  width: 100%;
`;

Styled.Label = styled.span`
  font: var(--font-mini-book);
`;

Styled.InlineRow = styled.span`
  ${layoutMixins.inlineRow}
`;
