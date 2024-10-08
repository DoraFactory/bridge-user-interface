import styled, { type AnyStyledComponent } from 'styled-components';

import { STRING_KEYS } from '@/constants/localization';

import { layoutMixins } from '@/styles/layoutMixins';

import { useMigrateToken, useStringGetter } from '@/hooks';

import { AssetIcon } from '@/components/AssetIcon';
import { Details } from '@/components/Details';
import { Tag } from '@/components/Tag';
import { Output, OutputType, ShowSign } from '@/components/Output';
import { TOKEN_DECIMALS } from '@/constants/numbers';

export const TokensBeforeAfterDiagram = () => {
  const stringGetter = useStringGetter();
  const { amountBN } = useMigrateToken();

  const detailItems = [
    {
      key: 'before',
      label: "Before",
      value: (
        <Styled.ValueContainer>
          <Styled.TokenColumn>
            <Styled.TokenIcon>
              <AssetIcon symbol="DORA" />
              <AssetIcon symbol="ETH" />
            </Styled.TokenIcon>
            <Styled.Output
              value={amountBN}
              type={OutputType.Asset}
              fractionDigits={TOKEN_DECIMALS}
            />
            <Tag>ethDORA</Tag>
            <span>
              on Ethereum
            </span>
          </Styled.TokenColumn>
        </Styled.ValueContainer>
      ),
    },
    {
      key: 'after',
      label: "After",
      value: (
        <Styled.ValueContainer>
          <Styled.TokenColumn>
            <Styled.TokenIcon>
              <AssetIcon symbol="DORA" />
              <AssetIcon symbol="ETH" />
            </Styled.TokenIcon>

            <Styled.Outputethdora
              value={amountBN?.negated()}
              type={OutputType.Asset}
              fractionDigits={TOKEN_DECIMALS}
              showSign={ShowSign.Both}
            />
            <Tag>ethDORA</Tag>
            <span>
              on Ethereum
            </span>
          </Styled.TokenColumn>
          <Styled.TokenColumn>
            <Styled.TokenIcon>
              <AssetIcon symbol="DORA" />
              <AssetIcon symbol="DORA" />
            </Styled.TokenIcon>

            <Styled.Output
              value={amountBN}
              type={OutputType.Asset}
              fractionDigits={TOKEN_DECIMALS}
              showSign={ShowSign.Both}
            />
            <Tag>DORA</Tag>
            <span>
              on Dora Vota
            </span>
          </Styled.TokenColumn>
        </Styled.ValueContainer>
      ),
    },
  ];

  return (
    <Styled.Container>
      <Styled.Details items={detailItems} layout="rowColumns" />
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.div`
  overflow-x: scroll;
  font: var(--font-small-book);
`;

Styled.ValueContainer = styled.div`
  ${layoutMixins.inlineRow}

  margin-top: 0.5rem;
  gap: 1rem;

  padding: 1rem 0.75rem;
  background-color: var(--color-layer-5);
  border-radius: 0.75em;
`;

Styled.TokenColumn = styled.div`
  ${layoutMixins.flexColumn}
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  height: 6rem;

  > :not(:last-child) {
    color: var(--color-text-2);
  }

  > :last-child {
    font: var(--font-mini-book);
    color: var(--color-text-0);
  }
`;

Styled.Details = styled(Details)`
  text-align: center;
  place-content: center;
  gap: 2rem;

  > :last-child:before {
    content: '';
    background: url(/arrows-right.svg);
    position: absolute;
    margin: 5rem 0 0 -2rem;
    width: 2rem;
    height: 2rem;
  }

  > * {
    min-width: 6rem;
    padding: 0;
  }
`;

Styled.TokenIcon = styled.div`
  ${layoutMixins.stack}
  margin: 0 auto;

  > img:first-child {
    height: 2rem;
    width: auto;
    margin: 0.25rem;
  }

  > img:last-child {
    height: 0.9rem;
    width: auto;
    place-self: start end;
  }
`;

Styled.Output = styled(Output)`
  --output-sign-color: var(--color-positive);
`;


Styled.Outputethdora = styled(Output)`
  --output-sign-color: var(--color-negative);
`;