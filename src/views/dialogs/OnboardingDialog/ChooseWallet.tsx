import styled, { AnyStyledComponent } from 'styled-components';

import { AlertType } from '@/constants/alerts';
import { STRING_KEYS } from '@/constants/localization';
import { DISPLAYED_WALLETS, wallets } from '@/constants/wallets';
import { ButtonAction, ButtonSize } from '@/constants/buttons';

import breakpoints from '@/styles/breakpoints';
import { layoutMixins } from '@/styles/layoutMixins';

import { useAccounts, useStringGetter } from '@/hooks';

import { AlertMessage } from '@/components/AlertMessage';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Link } from '@/components/Link';

export const ChooseWallet = () => {
  const stringGetter = useStringGetter();

  const { selectWalletType, selectedWalletType, selectedWalletError } = useAccounts();

  return (
    <>
      {selectedWalletType && selectedWalletError && (
        <Styled.AlertMessage type={AlertType.Error}>
          {
            <h4>
              Couldn't connect to {wallets[selectedWalletType].stringKey},
            </h4>
          }
          {selectedWalletError}
        </Styled.AlertMessage>
      )}

      <Styled.Wallets>
        {DISPLAYED_WALLETS.map((walletType) => (
          <Styled.WalletButton
            action={ButtonAction.Base}
            key={walletType}
            onClick={() => selectWalletType(walletType)}
            slotLeft={<Styled.Icon iconComponent={wallets[walletType].icon} />}
            size={ButtonSize.Small}
          >
            <div>{wallets[walletType].stringKey}</div>
          </Styled.WalletButton>
        ))}
      </Styled.Wallets>
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.AlertMessage = styled(AlertMessage)`
  h4 {
    font: var(--font-small-medium);
  }
`;

Styled.Wallets = styled.div`
  gap: 0.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));

  > :last-child:nth-child(odd) {
    grid-column: span 2;
  }
`;

Styled.WalletButton = styled(Button)`
  justify-content: start;
  gap: 0.5rem;

  @media ${breakpoints.mobile} {
    div {
      text-align: start;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;

Styled.Icon = styled(Icon)`
  width: 1.5em;
  height: 1.5em;
`;

Styled.Footer = styled.footer`
  ${layoutMixins.spacedRow}
  justify-content: center;
  margin-top: auto;

  a {
    color: var(--color-text-0);
    font: var(--font-base-book);

    &:hover {
      color: var(--color-text-1);
    }
  }
`;
