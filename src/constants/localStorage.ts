export enum LocalStorageKey {
  // Onboarding / Accounts
  EvmAddress = 'dora.migrate.EvmAddress',
  DoraAddress = 'dora.migrate.DoraAddress',
  OnboardingSelectedWalletType = 'dora.migrate.OnboardingSelectedWalletType',
  WalletConnectionType = 'dora.migrate.WalletConnectionType',
  OnboardingHasAcknowledgedTerms = 'dora.migrate.OnboardingHasAcknowledgedTerms',
  EvmDerivedAddresses = 'dora.migrate.EvmDerivedAddresses',

  // UI State
  SelectedLocale = 'dora.migrate.SelectedLocale',
}

export const LOCAL_STORAGE_VERSIONS = {
  [LocalStorageKey.EvmDerivedAddresses]: 'v1',
};
