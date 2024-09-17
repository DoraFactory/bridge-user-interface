export enum LocalStorageKey {
  // Onboarding / Accounts
  EvmAddress = 'dydx.migrate.EvmAddress',
  DoraAddress = 'dydx.migrate.DoraAddress',
  OnboardingSelectedWalletType = 'dydx.migrate.OnboardingSelectedWalletType',
  WalletConnectionType = 'dydx.migrate.WalletConnectionType',
  OnboardingHasAcknowledgedTerms = 'dydx.migrate.OnboardingHasAcknowledgedTerms',
  EvmDerivedAddresses = 'dydx.migrate.EvmDerivedAddresses',

  // UI State
  SelectedLocale = 'dydx.migrate.SelectedLocale',
}

export const LOCAL_STORAGE_VERSIONS = {
  [LocalStorageKey.EvmDerivedAddresses]: 'v1',
};
