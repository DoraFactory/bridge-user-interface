import styled, { type AnyStyledComponent } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { OnboardingState } from '@/constants/account';

import { ButtonAction, ButtonShape, ButtonSize, ButtonType } from '@/constants/buttons';

import { DialogTypes } from '@/constants/dialogs';
import { STRING_KEYS, TOOLTIP_STRING_KEYS } from '@/constants/localization';
import { wallets } from '@/constants/wallets';

import { layoutMixins } from '@/styles/layoutMixins';
import { headerMixins } from '@/styles/headerMixins';

import { useAccountBalance, useAccounts, useBreakpoints, useStringGetter } from '@/hooks';

import { OnboardingTriggerButton } from '@/views/dialogs/OnboardingTriggerButton';

import { AssetIcon } from '@/components/AssetIcon';
import { CopyButton } from '@/components/CopyButton';
import { DropdownMenu } from '@/components/DropdownMenu';
import { Icon, IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Output, OutputType } from '@/components/Output';

import { openDialog } from '@/state/dialogs';

import { getOnboardingState } from '@/state/accountSelectors';

import { isTruthy } from '@/lib/isTruthy';
import { truncateAddress } from '@/lib/wallet';
import { WithTooltip } from '@/components/WithTooltip';

export const AccountMenu = () => {
  const stringGetter = useStringGetter();
  const { isTablet } = useBreakpoints();
  const dispatch = useDispatch();
  const onboardingState = useSelector(getOnboardingState);

  const { evmAddress, walletType, DoraAddress, hdKey } = useAccounts();
  const { DYDXBalance } = useAccountBalance();

  const onRecoverKeys = () => {
    dispatch(openDialog({ type: DialogTypes.Onboarding }));
  };

  return onboardingState === OnboardingState.Disconnected ? (
    <OnboardingTriggerButton size={ButtonSize.XSmall} />
  ) : (
    <Styled.DropdownMenu
      slotTopContent={
        onboardingState === OnboardingState.AccountConnected && (
          <Styled.AccountInfo>
            <Styled.AddressRow>
              {/* {walletType && (
                <Styled.SourceIcon>
                  <Styled.ConnectorIcon iconName={IconName.AddressConnector} />
                  <Icon iconComponent={wallets[walletType].icon} />
                </Styled.SourceIcon>
              )} */}
              <Styled.Column>
                <Styled.Address>{truncateAddress(evmAddress, '0x')}</Styled.Address>
              </Styled.Column>

              <Styled.CopyButton buttonType="icon" value={evmAddress} shape={ButtonShape.Square} />

              <Styled.IconButton
                action={ButtonAction.Base}
                href={`${import.meta.env.VITE_ETHERSCAN_URL}/address/${evmAddress}`}
                iconName={IconName.LinkOut}
                shape={ButtonShape.Square}
                type={ButtonType.Link}
              />
            </Styled.AddressRow>
          </Styled.AccountInfo>
        )
      }
      items={[
        {
          value: 'Disconnect',
          icon: <Icon iconName={IconName.BoxClose} />,
          label: "Disconnect",
          highlightColor: 'negative',
          onSelect: () => dispatch(openDialog({ type: DialogTypes.DisconnectWallet })),
        },
      ].filter(isTruthy)}
      align="end"
      sideOffset={16}
    >
      {onboardingState === OnboardingState.WalletConnected ? (
        <Styled.WarningIcon iconName={IconName.Warning} />
      ) : onboardingState === OnboardingState.AccountConnected ? (
        walletType && <Icon iconComponent={wallets[walletType].icon} />
      ) : null}
      {!isTablet && <Styled.Address>{truncateAddress(evmAddress, '0x')}</Styled.Address>}
    </Styled.DropdownMenu>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.AccountInfo = styled.div`
  ${layoutMixins.flexColumn}

  gap: 1rem;
  padding: 1rem 1rem 0.5rem 1rem;
`;

Styled.Column = styled.div`
  ${layoutMixins.column}
`;

Styled.InlineRow = styled.div`
  ${layoutMixins.inlineRow}
`;

Styled.AddressRow = styled.div`
  ${layoutMixins.row}

  gap: 0.5rem;

  ${Styled.Column} {
    margin-right: auto;
  }

  > img {
    font-size: 1.75rem;
  }
`;

Styled.SourceIcon = styled.div`
  padding: 0.375rem;
  position: relative;
  z-index: 1;

  font-size: 1rem;

  line-height: 0;
  border-radius: 50%;
  background-color: #303045;
`;

Styled.ConnectorIcon = styled(Icon)`
  position: absolute;
  top: -1.625rem;
  height: 1.75rem;
`;

Styled.Label = styled.div`
  ${layoutMixins.row}

  gap: 0.25rem;
  font-size: var(--fontSize-mini);
  color: var(--color-text-0);

  img {
    font-size: 1rem;
  }
`;

Styled.DropdownMenu = styled(DropdownMenu)`
  ${headerMixins.dropdownTrigger}

  --dropdownMenu-item-font-size: 0.875rem;
  --popover-padding: 0 0 0.5rem 0;
`;

Styled.WarningIcon = styled(Icon)`
  font-size: 1.25rem;
  color: var(--color-warning);
`;

Styled.Address = styled.span`
  font: var(--font-base-book);
  font-feature-settings: var(--fontFeature-monoNumbers);
`;

Styled.ConnectToChain = styled(Styled.Column)`
  max-width: 12em;
  gap: 0.5rem;
  text-align: center;

  p {
    color: var(--color-text-1);
    font: var(--font-small-book);
  }
`;

Styled.Balance = styled.div`
  padding: 0.5rem 1rem;

  background-color: var(--color-layer-4);
  border-radius: 0.5rem;
`;

Styled.BalanceOutput = styled(Output)`
  font-size: var(--fontSize-medium);
`;

Styled.IconButton = styled(IconButton)`
  --button-padding: 0 0.25rem;
  --button-border: solid var(--border-width) var(--color-layer-6);
`;

Styled.CopyButton = styled(CopyButton)`
  --button-padding: 0 0.25rem;
  --button-border: solid var(--border-width) var(--color-layer-6);
`;
