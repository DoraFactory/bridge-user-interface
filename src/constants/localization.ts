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
  
}

export const DORA_LONG_SENTENCE = {
  "CONFIRM_MIGRATION_DISCLAIMER_1": "I understand it may take 24~48 hours until my tokens are available on the Dora vota-ash Chain.",
  "CONFIRM_MIGRATION_DISCLAIMER_2": "I understand that my ethDORA tokens will be sent to a black hole address for permanent destruction in the Bridge Smart Contract and irrecoverable.",
  "PENDING_MIGRATIONS_DESCRIPTION_I": 'This table lists all ongoing DORA token migrations from Ethereum to the Dora vota-ash Chain. It refreshes periodically or upon a manual page reload.',
  "PENDING_MIGRATIONS_DESCRIPTION_II": 'Once a pending migration is listed, the migration will be completed within ~48 hours. Once the migration has been settled, it will be removed from this table during the next automatic update or when the page is manually refreshed.',
  "PENDING_MIGRATIONS_DESCRIPTION_III": 'However, you can see all your migration records (including those that are pending or have been settled) in the "Mine" option. Please note that if the migration is pending, the Transaction Hash will display as 0x0000...00000. If your migration is settled, it will display the link of transaction hash of the successful migration on the Dora vota-ash network.',
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
