import { useState } from 'react';
import { useSignTypedData } from 'wagmi';
import styled, { type AnyStyledComponent, css } from 'styled-components';
import { AES } from 'crypto-js';

import { EvmDerivedAccountStatus } from '@/constants/account';
import { AlertType } from '@/constants/alerts';
import { ButtonAction } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';

import { DoraAddress, SIGN_TYPED_DATA } from '@/constants/wallets';

import { useAccounts, useDydxClient, useStringGetter, useMatchingEvmNetwork } from '@/hooks';

import { layoutMixins } from '@/styles/layoutMixins';

import { AlertMessage } from '@/components/AlertMessage';
import { Button } from '@/components/Button';
import { Icon, IconName } from '@/components/Icon';
import { LoadingSpinner } from '@/components/Loading/LoadingSpinner';
import { Switch } from '@/components/Switch';
import { WithReceipt } from '@/components/WithReceipt';
import { WithTooltip } from '@/components/WithTooltip';

import { isTruthy } from '@/lib/isTruthy';
import { parseWalletError } from '@/lib/wallet';

type ElementProps = {
  status: EvmDerivedAccountStatus;
  setStatus: (status: EvmDerivedAccountStatus) => void;
  onKeysDerived?: () => void;
};

export const GenerateKeys = ({
  status: status,
  setStatus,
  onKeysDerived = () => {},
}: ElementProps) => {
  const stringGetter = useStringGetter();

  const [shouldRememberMe, setShouldRememberMe] = useState(false);
  const [error, setError] = useState<string | React.ReactNode[]>();

  const { setWalletFromEvmSignature, saveEvmSignature } = useAccounts();

  const chainId = Number(import.meta.env.VITE_ETH_CHAIN_ID);

  // 1. Switch network
  const { isMatchingNetwork, matchNetwork, isSwitchingNetwork } = useMatchingEvmNetwork({
    chainId,
  });

  const switchNetwork = async () => {
    setError(undefined);

    try {
      await matchNetwork?.();
    } catch (error) {
      const { message } = parseWalletError({
        error,
        stringGetter,
      });

      if (message) setError(message);
    }
  };

  // 2. Derive keys from EVM account
  const { getWalletFromEvmSignature } = useDydxClient();
  const { getSubaccounts } = useAccounts();

  const isDeriving = ![
    EvmDerivedAccountStatus.NotDerived,
    EvmDerivedAccountStatus.Derived,
  ].includes(status);

  const { signTypedDataAsync } = useSignTypedData({
    ...SIGN_TYPED_DATA,
    domain: {
      ...SIGN_TYPED_DATA.domain,
      chainId,
    },
  });

  const staticEncryptionKey = import.meta.env.VITE_PK_ENCRYPTION_KEY;

  const deriveKeys = async () => {
    setError(undefined);

    try {
      // 1. First signature
      setStatus(EvmDerivedAccountStatus.Deriving);

      const signature = await signTypedDataAsync();
      await setWalletFromEvmSignature(signature);

      // 3: Remember me (encrypt and store signature)
      if (shouldRememberMe && staticEncryptionKey) {
        const encryptedSignature = AES.encrypt(signature, staticEncryptionKey).toString();

        saveEvmSignature(encryptedSignature);
      }

      // 2. Done
      setStatus(EvmDerivedAccountStatus.Derived);
    } catch (error) {
      setStatus(EvmDerivedAccountStatus.NotDerived);
      const { message } = parseWalletError({
        error,
        stringGetter,
      });
      console.log(`find error, error is ${error}`);
      if (message) setError(message);
    }
  };

  return (
    <>
      <Styled.StatusCardsContainer>
        {[
          {
            status: EvmDerivedAccountStatus.EnsuringDeterminism,
            title: 'Verify wallet compatibility',
            description: 'Ensures your wallet is supported.',
          },
        ]
          .filter(isTruthy)
          .map((step) => (
            <Styled.StatusCard key={step.status} active={status === step.status}>
              {status < step.status ? (
                <LoadingSpinner disabled />
              ) : status === step.status ? (
                <LoadingSpinner />
              ) : (
                <Styled.CheckIcon iconName={IconName.CheckCircle} />
              )}
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </Styled.StatusCard>
          ))}
      </Styled.StatusCardsContainer>

      <Styled.Footer>
        {staticEncryptionKey && (
          <Styled.RememberMe htmlFor="remember-me">
            <WithTooltip tooltip="remember-me" withIcon>
              Remember me
            </WithTooltip>
            <Switch
              name="remember-me"
              disabled={!staticEncryptionKey || isDeriving}
              checked={shouldRememberMe}
              onCheckedChange={setShouldRememberMe}
            />
          </Styled.RememberMe>
        )}
        {error && <AlertMessage type={AlertType.Error}>{error}</AlertMessage>}
        <Styled.WithReceipt
          slotReceipt={
            <Styled.ReceiptArea>
              <span>
                Signing is {''}
                <Styled.Green>free</Styled.Green>
                {''} and will not send a transaction.
              </span>
            </Styled.ReceiptArea>
          }
        >
          {!isMatchingNetwork ? (
            <Button
              action={ButtonAction.Primary}
              onClick={() => switchNetwork().then(deriveKeys).then(onKeysDerived)}
              state={{ isLoading: isSwitchingNetwork }}
            >
              Switch network
            </Button>
          ) : (
            <Button
              action={ButtonAction.Primary}
              onClick={() => deriveKeys().then(onKeysDerived)}
              state={{
                isLoading: isDeriving,
                isDisabled: status !== EvmDerivedAccountStatus.NotDerived,
              }}
            >
              {!error ? 'Send request' : 'Try again'}
            </Button>
          )}
        </Styled.WithReceipt>
        <Styled.Disclaimer>Check your wallet for a request!</Styled.Disclaimer>
      </Styled.Footer>
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.StatusCardsContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

Styled.StatusCard = styled.div<{ active?: boolean }>`
  ${layoutMixins.row}
  gap: 1rem;
  background-color: var(--color-layer-4);
  padding: 1rem;
  border-radius: 0.625rem;

  ${({ active }) =>
    active &&
    css`
      background-color: var(--color-layer-6);
    `}

  > div {
    ${layoutMixins.column}
    gap: 0.25rem;

    h3 {
      color: var(--color-text-2);
      font: var(--font-base-book);
    }

    p {
      color: var(--color-text-1);
      font: var(--font-small-regular);
    }
  }
`;

Styled.Footer = styled.footer`
  ${layoutMixins.stickyFooter}
  margin-top: auto;

  display: grid;
  gap: 1rem;
`;

Styled.RememberMe = styled.label`
  ${layoutMixins.spacedRow}
  font: var(--font-base-book);
`;

Styled.WithReceipt = styled(WithReceipt)`
  --withReceipt-backgroundColor: var(--color-layer-2);
`;

Styled.ReceiptArea = styled.div`
  padding: 1rem;
  font: var(--font-small-book);
  color: var(--color-text-0);
`;

Styled.Green = styled.span`
  color: var(--color-positive);
`;

Styled.CheckIcon = styled(Icon)`
  font-size: 2.375rem;
`;

Styled.Disclaimer = styled.span`
  text-align: center;
  color: var(--color-text-0);
  font: var(--font-base-book);
`;
