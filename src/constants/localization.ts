import { ReactNode } from 'react';

import {
  APP_STRING_KEYS,
  ERRORS_STRING_KEYS,
  LOCALE_DATA,
  TOKEN_MIGRATION_STRING_KEYS,
  TOOLTIPS,
  WARNINGS_STRING_KEYS,
} from '@dydxprotocol/v4-localization';

export { TOOLTIP_STRING_KEYS } from '@dydxprotocol/v4-localization';

export enum SupportedLocales {
  EN = 'en',
  // ZH_CN = 'zh-CN',
  // JA = 'ja',
  // KO = 'ko',
  // RU = 'ru',
  // TR = 'tr',
  // FR = 'fr',
  // PT = 'pt',
  // ES = 'es',
  // DE = 'de',
}

export const DORA_KEYS = {
  "DORA_CHAIN_SETTLEMENT": 'Dora vota-ash Chain settlement',
  "DORA_EXPLORER" : 'Dora vota explorer',
  "VOTA_CHAIN" : 'vota-ash Chain',
  "ETHEREUM": 'Ethereum'
}

export const DORA_LONG_SENTENCE = {
  "CONFIRM_MIGRATION_DISCLAIMER_1": "I understand it may take 24~48 hours until my tokens are available on the Dora vota-ash Chain.",
  "CONFIRM_MIGRATION_DISCLAIMER_2": "I understand that my ethDORA tokens will be sent to a black hole address for permanent destruction in the Bridge Smart Contract and irrecoverable.",
  "PENDING_MIGRATIONS_DESCRIPTION_I": 'This table lists all ongoing DORA token migrations from Ethereum to the Dora vota-ash Chain. It refreshes periodically or upon a manual page reload.',
  "PENDING_MIGRATIONS_DESCRIPTION_II": 'Once a pending migration is listed, the migration will be completed within ~48 hours. Once the migration has been settled, it will be removed from this table during the next automatic update or when the page is manually refreshed.',
  "PENDING_MIGRATIONS_DESCRIPTION_III": 'However, you can see all your migration records (including those that are pending or have been settled) in the "Mine" option. Please note that if the migration is pending, the Transaction Hash will display as 0x0000...00000. If your migration is settled, it will display the link of transaction hash of the successful migration on the Dora vota-ash network.',
  "MIGRATION_FAQ_DYDX_CHAIN_PORTAL": "What is the dYdX Chain Portal?",
  "MIGRATION_FAQ_DYDX_CHAIN_PORTAL_ANSWER": "The dYdX Community elected to migrate Ethereum-based DYDX to dYdX Chain (vote {HERE}). This portal assists Ethereum-based DYDX holders to engage with the Ethereum smart contract to migrate their DYDX tokens from Ethereum to dYdX Chain.",
  "MIGRATION_FAQ_GAS_FEES_ANSWER": "Yes, holders who engage with the portal will have to pay gas costs on Ethereum. Users will not have to pay gas costs on dYdX Chain.",
  "MIGRATION_FAQ_GAS_FEES": "Do I have to pay gas fees?",
  "MIGRATION_FAQ_HOW_LONG_ANSWER": "Once Ethereum-based DYDX is successfully sent to the Ethereum smart contract, a holder will receive wethDYDX immediately. dYdX Chain validators will acknowledge the Ethereum tx after it is finalized (which takes roughly 20 minutes). After dYdX Chain validators acknowledge the Ethereum tx, dYdX Chain DYDX settlement will be delayed for 86400 blocks, which translates into roughly 38.5 hours. After the 86400 block delay, dYdX Chain validators will send the dYdX Chain address the specified amount of DYDX.",
  "MIGRATION_FAQ_HOW_LONG": "How long should the migration take?",
  "MIGRATION_FAQ_HOW_TO_TRACK_ANSWER": "Once your Ethereum tx has been finalized (which takes roughly 20 minutes), you can track your pending dYdX Chain migration in Pending Migrations tab. You can filter the table by pasting a dYdX Chain address to see all of its pending migrations. Once the pending migration has settled to the dYdX Chain Address, the pending migration will no longer be shown in the table.",
  "MIGRATION_FAQ_HOW_TO_TRACK": "How can I track the status of my migration?",
  "MIGRATION_FAQ_WHAT_ADDRESS_ANSWER": "Users who interact with the portal can send dYdX Chain DYDX tokens to any dYdX Chain address. User’s can send tokens directly to their dYdX Chain address that is automatically created from their Ethereum address’s signature.",
  "MIGRATION_FAQ_WHAT_ADDRESS": "What address can I send dYdX Chain DYDX to?",
  "MIGRATION_FAQ_WHAT_TOKENS_ANSWER": "Holders who successfully engage with the portal will receive wethDYDX on Ethereum and DYDX on dYdX Chain.",
  "MIGRATION_FAQ_WHAT_TOKENS": "What tokens will I receive?",
  "MIGRATION_FAQ_WRAPPED_TOKENS_ANSWER": "wethDYDX are minted 1:1 to any users who successfully send Ethereum-based DYDX to the smart contract. wethDYDX have the same v3 governance rights as Ethereum-based DYDX, and are transferable. wethDYDX cannot be bridged to v4.",
  "MIGRATION_FAQ_WRAPPED_TOKENS": "What are wrapped Ethereum DYDX tokens (“wethDYDX”)?",
  "MIGRATION_BLOCKED_MESSAGE_DESTINATION": "Because the destination address appears to be a resident of, or using this user interface from, a jurisdiction that violates our terms of use, or has engaged in activity that violates our terms of use, the destination address has been blocked and this transaction cannot be completed.",
}

export const EN_LOCALE_DATA = {
  ...LOCALE_DATA[SupportedLocales.EN],
  TOOLTIPS: TOOLTIPS[SupportedLocales.EN],
};

export const STRING_KEYS = {
  ...APP_STRING_KEYS,
  ...TOKEN_MIGRATION_STRING_KEYS,
  ...ERRORS_STRING_KEYS,
  ...WARNINGS_STRING_KEYS,
};

export type LocaleData = typeof EN_LOCALE_DATA;

export type StringGetterFunction = (a: {
  key: string;
  params?: {
    [key: string]: ReactNode;
  };
}) => string | Array<string | React.ReactNode>;

export const SUPPORTED_LOCALE_STRING_LABELS: {
  [key in SupportedLocales]: string;
} = {
  [SupportedLocales.EN]: 'English',
  // [SupportedLocales.ZH_CN]: '中文',
  // [SupportedLocales.JA]: '日本語',
  // [SupportedLocales.KO]: '한국어',
  // [SupportedLocales.RU]: 'русский',
  // [SupportedLocales.TR]: 'Türkçe',
  // [SupportedLocales.FR]: 'Français',
  // [SupportedLocales.PT]: 'Português',
  // [SupportedLocales.ES]: 'Español',
  // [SupportedLocales.DE]: 'Deutsch',
};

export const SUPPORTED_LOCALE_BASE_TAGS = {
  [SupportedLocales.EN]: 'en',
  // [SupportedLocales.ZH_CN]: 'zh',
  // [SupportedLocales.JA]: 'ja',
  // [SupportedLocales.KO]: 'ko',
  // [SupportedLocales.RU]: 'ru',
  // [SupportedLocales.TR]: 'tr',
  // [SupportedLocales.FR]: 'fr',
  // [SupportedLocales.PT]: 'pt',
  // [SupportedLocales.ES]: 'es',
  // [SupportedLocales.DE]: 'de',
};

export const SUPPORTED_BASE_TAGS_LOCALE_MAPPING = Object.fromEntries(
  Object.entries(SUPPORTED_LOCALE_BASE_TAGS).map(([locale, baseTag]) => [baseTag, locale])
);

export type TooltipStrings = {
  [key: string]: ({
    stringGetter,
    stringParams,
  }: {
    stringGetter: StringGetterFunction;
    stringParams?: Record<string, string>;
  }) => {
    title: string | ReactNode[];
    body: string | ReactNode[];
    learnMoreLink?: string;
  };
};
