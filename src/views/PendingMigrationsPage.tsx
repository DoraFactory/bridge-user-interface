import { useState } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { CaretDownIcon } from '@radix-ui/react-icons';

import { STRING_KEYS, DORA_LONG_SENTENCE } from '@/constants/localization';

import { layoutMixins } from '@/styles/layoutMixins';
import breakpoints from '@/styles/breakpoints';

import { useStringGetter } from '@/hooks';

import { ToggleButton } from '@/components/ToggleButton';

import { PendingMigrationsTable } from './PendingMigrationsTable';

export const PendingMigrationsPage = () => {
  const stringGetter = useStringGetter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <Styled.Container>
      <Styled.Description>
        <p>
        {DORA_LONG_SENTENCE.PENDING_MIGRATIONS_DESCRIPTION_I}
        </p>
        {showFullDescription && (
          <>
            <p>
            {DORA_LONG_SENTENCE.PENDING_MIGRATIONS_DESCRIPTION_II}
            </p>
            <p>
            {DORA_LONG_SENTENCE.PENDING_MIGRATIONS_DESCRIPTION_III}
            </p>
          </>
        )}
        <Styled.ViewMoreToggle
          onPressedChange={setShowFullDescription}
          slotRight={<CaretDownIcon />}
        >
          {showFullDescription ? "View Less" : "View More"}
        </Styled.ViewMoreToggle>
      </Styled.Description>
      <PendingMigrationsTable />
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.section`
  ${layoutMixins.flexColumn}
  gap: 1rem;

  > * {
    width: 49.25rem;
    max-width: 100%;
  }
`;

Styled.Description = styled.div`
  font: var(--font-base-book);
  color: var(--color-text-0);
  padding: 0 0.75rem;

  p:not(:last-of-type) {
    margin-bottom: 1rem;
  }

  @media ${breakpoints.tablet} {
    padding: 0 2.25rem;
  }
`;

Styled.ViewMoreToggle = styled(ToggleButton)`
  --button-toggle-off-backgroundColor: transparent;
  --button-toggle-off-textColor: var(--color-text-1);
  --button-toggle-on-backgroundColor: transparent;
  --button-toggle-on-textColor: var(--color-text-1);
  --button-border: none;
  --button-padding: 0;

  &[data-state='on'] {
    svg {
      rotate: 0.5turn;
    }
  }
`;
