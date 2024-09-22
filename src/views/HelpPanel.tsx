import styled, { AnyStyledComponent } from 'styled-components';

import { STRING_KEYS, DORA_LONG_SENTENCE } from '@/constants/localization';
import { AppRoute } from '@/constants/routes';

import breakpoints from '@/styles/breakpoints';
import { layoutMixins } from '@/styles/layoutMixins';

import { useStringGetter } from '@/hooks';

import { Accordion } from '@/components/Accordion';
import { Link } from '@/components/Link';
import { Panel } from '@/components/Panel';

export const HelpPanel = () => {
  const stringGetter = useStringGetter();
  return (
    <Styled.Container>
      <Styled.HelpCard
        slotHeader={
          <Styled.Header>
            <h3>Migration help</h3>
            <Link withIcon href="https://docs.dorafactory.org/docs/mainnet-migration">
              Learn More
            </Link>
          </Styled.Header>
        }
      >
        <Accordion
          items={[
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_DORA_CHAIN_PORTAL,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_DORA_CHAIN_PORTAL_ANSWER,
            },
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_WHAT_ADDRESS_CAN_INTERACT,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_WHAT_ADDRESS_CAN_INTERACT_ANSWER,
            },
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_CUSTODY_TOKEN,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_CUSTODY_TOKEN_ANSWER,
            },
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_HOW_LONG,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_HOW_LONG_ANSWER,
            },
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_CONTRACR_TOKEN,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_CONTRACR_TOKEN_ANSWER,
            },
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_VCDORA_HOLDER,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_VCDORA_HOLDER_ANSWER,
            },
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_GAS_FEES,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_GAS_FEES_ANSWER,
            },
            {
              header: DORA_LONG_SENTENCE.MIGRATION_FAQ_HOW_TO_TRACK,
              content: DORA_LONG_SENTENCE.MIGRATION_FAQ_HOW_TO_TRACK_ANSWER,
            },
          ]}
        />
      </Styled.HelpCard>

      <Styled.TermsLink href={`/#${AppRoute.Terms}`} withIcon>
        Terms of Use
      </Styled.TermsLink>
      <Styled.TermsLink href={`/#${AppRoute.Privacy}`} withIcon>
        Privacy policy
      </Styled.TermsLink>
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.div`
  text-align: center;

  @media ${breakpoints.notTablet} {
    width: max-content;
  }
`;

Styled.HelpCard = styled(Panel)`
  width: 21.25rem;
  max-width: 100%;
  height: max-content;
  padding: 0;
  gap: 0;

  text-align: start;

  @media ${breakpoints.tablet} {
    padding-top: 0;
    width: 100%;
    max-width: 100%;
    background-color: var(--color-layer-2);
  }
`;

Styled.Header = styled.div`
  ${layoutMixins.spacedRow}
  gap: 1ch;

  padding: 1.25rem 1.5rem;
  border-bottom: var(--border-width) solid var(--border-color);

  font: var(--font-small-book);

  h3 {
    font: var(--font-medium-book);
    color: var(--color-text-2);
  }
`;

Styled.Link = styled(Link)`
  display: inline-flex;
`;

Styled.TermsLink = styled(Link)`
  --link-color: var(--color-text-0);

  display: inline-flex;
  padding: 1.5rem;

  font: var(--font-small-book);
`;
