import { IconName } from '@/components/Icon';
import { STRING_KEYS, DORA_KEYS } from './localization';
import { AppRoute } from './routes';

export const RELEVANT_LINKS = [
  {
    value: 'DORA_EXPLORER',
    iconName: IconName.Mintscan,
    labelStringKey: DORA_KEYS.DORA_EXPLORER,
    href: import.meta.env.VITE_DORA_EXPLORER_URL,
  },
  {
    value: 'TERMS_OF_USE',
    iconName: IconName.File,
    labelStringKey: 'Terms of Use',
    href: AppRoute.Terms,
  },
  {
    value: 'PRIVACY_POLICY',
    iconName: IconName.Privacy,
    labelStringKey: 'Private Policy',
    href: AppRoute.Privacy,
  },
];
