import { useState } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Close } from '@radix-ui/react-dialog';

import { ButtonAction } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { AppRoute } from '@/constants/routes';

import { layoutMixins } from '@/styles/layoutMixins';

import { useAccounts, useStringGetter } from '@/hooks';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { closeDialog } from '@/state/dialogs';
import { Checkbox } from '@/components/Checkbox';
import { Link } from '@/components/Link';

type ElementProps = {
  setIsOpen?: (open: boolean) => void;
};

export const AcknowledgeTermsDialog = ({ setIsOpen }: ElementProps) => {
  const stringGetter = useStringGetter();
  const dispatch = useDispatch();
  const { saveHasAcknowledgedTerms } = useAccounts();

  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const onContinue = () => {
    saveHasAcknowledgedTerms(true);
    dispatch(closeDialog());
  };

  return (
    <Dialog isOpen preventClose setIsOpen={setIsOpen} title="Acknowledge terms">
      <Styled.Content>
        <div>
          <p>Notice: Please Read Carefully Before Using the Token Migration Interface</p>
          <p>
            <li>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'red' }}>
                Caution.
              </span>{' '}
              <span style={{ fontWeight: 'bold' }}>
                You must make sure you own or have access to the Dora Vota network address you
                entered.{' '}
              </span>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'red' }}>
                Double-check
              </span>{' '}
              {''}
              <span style={{ fontWeight: 'bold' }}>
                that your Dora Vota network address is accurate and complete, before initiating the
                migration. We cannot verify the ownership of the Dora Vota address you entered,
                other than yourself. This is your responsibility.
              </span>
            </li>
            <li>
              <span style={{ fontWeight: 'bold' }}>
                Once initiated, your Ethereum DORA tokens will be sent to a burn address and cannot
                be reversed. And you will receive the DORA Tokens at the Dora Vota network address
                you entered. Any error you make is irreversible, and we are not liable for any of
                your errors.
              </span>
            </li>
            <li>
              Allow at least{' '}
              <span style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'red' }}>
                48 hours
              </span>{' '}
              for the migration to complete.
            </li>
            <li>
              We do not have control or custody over your digital assets or wallets. You are
              interacting directly with the blockchain smart contracts.
            </li>
            <li>
              You are strictly prohibited from using the Token Migration Interface if you are under
              any sanctions imposed by any sanctions authority, including but not limited to the
              United States Department of the Treasury's Office of Foreign Assets Control, the
              United Nations Security Council, the European Union, or any other government authority
              (“Sanctions”), or if you are a resident of a country or territory that is the subject
              of Sanctions, or if your use of the interface would violate any laws or regulations,
              or cause us to violate any laws or regulations (collectively,{' '}
              <span style={{ fontWeight: 'bold' }}>“Excluded Individual”</span>
              ).
            </li>
            <li>
              By using the Token Migration Interface, you agree to our{' '}
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              Terms of Use and Privacy Policy
              </span>
              , and you represent to us that you are not an Excluded Individual.
            </li>
          </p>
        </div>

        <Checkbox
          id="acknowledge-terms"
          checked={hasAcknowledged}
          onCheckedChange={setHasAcknowledged}
          label={
            <Styled.Label>
              I have read and agree to the <Link href={`/#${AppRoute.Terms}`}>Terms of Use</Link>{' '}
              and <Link href={`/#${AppRoute.Privacy}`}>Privacy Policy</Link>.
            </Styled.Label>
          }
        />

        <Close asChild>
          <Button
            action={ButtonAction.Primary}
            onClick={onContinue}
            state={{ isDisabled: !hasAcknowledged }}
          >
            Continue
          </Button>
        </Close>
      </Styled.Content>
    </Dialog>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Content = styled.div`
  ${layoutMixins.column}
  gap: 1rem;
  margin-top: var(--border-width);
`;

Styled.Label = styled.span`
  display: inline-block;
  font: var(--font-base-book);
  color: var(--color-text-3);

  a {
    display: inline-block;
    --link-color: var(--color-text-2);
  }
`;
