import { useSelector } from 'react-redux';
import styled, { type AnyStyledComponent } from 'styled-components';
import BigNumber from 'bignumber.js';

import { ButtonAction, ButtonSize, ButtonType } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { NumberSign } from '@/constants/numbers';

import { layoutMixins } from '@/styles/layoutMixins';

import { useAccounts, useAccountBalance, useStringGetter, useMigrateToken } from '@/hooks';

import { Button } from '@/components/Button';
import { DiffOutput } from '@/components/DiffOutput';
import { OutputType } from '@/components/Output';
import { Tag } from '@/components/Tag';
import { WithDetailsReceipt } from '@/components/WithDetailsReceipt';
import { OnboardingTriggerButton } from '@/views/dialogs/OnboardingTriggerButton';

import { calculateCanAccountMigrate } from '@/state/accountCalculators';

import { MustBigNumber } from '@/lib/numbers';
import { isTruthy } from '@/lib/isTruthy';

type ElementProps = {
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const PreviewMigrateButtonAndReceipt = ({ isDisabled, isLoading }: ElementProps) => {
  const stringGetter = useStringGetter();
  const { DoraAddress, evmAddress } = useAccounts();
  const { amountBN, destinationAddress } = useMigrateToken();
  const { ethDORABalance, DYDXBalance } = useAccountBalance();

  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const getLabel = ({ chain, asset }: { chain: string; asset: string }) => (
    <Styled.InlineRow>
      Balance on Ethereum
      <Tag>{asset}</Tag>
    </Styled.InlineRow>
  );

  const migrateDetailItems = [
    {
      key: 'ethDORABalance',
      label: getLabel({ chain: 'Ethereum', asset: 'ethDORA' }),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={ethDORABalance}
          newValue={MustBigNumber(ethDORABalance)
            .minus(amountBN ?? 0)
            .toNumber()}
          sign={NumberSign.Negative}
          withDiff={Boolean(ethDORABalance !== undefined && amountBN)}
          roundingMode={BigNumber.ROUND_DOWN}
        />
      ),
    },
  ].filter(isTruthy);

  return (
    <WithDetailsReceipt detailItems={migrateDetailItems} hideReceipt={!evmAddress}>
      {!canAccountMigrate ? (
        <OnboardingTriggerButton size={ButtonSize.Base} />
      ) : (
        <Button
          action={ButtonAction.Primary}
          type={ButtonType.Submit}
          state={{ isLoading, isDisabled }}
        >
          Preview Migration
        </Button>
      )}
    </WithDetailsReceipt>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.InlineRow = styled.span`
  ${layoutMixins.inlineRow}
`;
