import type { ExternalProvider } from '@ethersproject/providers';

import { STRING_KEYS } from '@/constants/localization';

import { CoinbaseIcon, GenericWalletIcon, MetaMaskIcon, WalletConnectIcon } from '@/icons';

import { isMetaMask } from '@/lib/wallet/providers';

// Wallet connection types

export enum WalletConnectionType {
  InjectedEip1193 = 'injectedEip1193',
}

export enum WalletErrorType {
  // General
  ChainMismatch,
  UserCanceled,

  // Non-Deterministic
  NonDeterministicWallet,

  // Misc
  Unknown,
}

type WalletConnectionTypeConfig = {
  name: string;
  wagmiConnectorId?: string;
};

export const walletConnectionTypes: Record<WalletConnectionType, WalletConnectionTypeConfig> = {
  [WalletConnectionType.InjectedEip1193]: {
    name: 'injected EIP-1193 provider',
    wagmiConnectorId: 'injected',
  },
};

// Wallets

export enum WalletType {
  MetaMask = 'METAMASK',
  OtherWallet = 'OTHER_WALLET',
}

export const DISPLAYED_WALLETS: WalletType[] = [
  WalletType.MetaMask,
  WalletType.OtherWallet,
];

type WalletConfig = {
  type: WalletType;
  stringKey: string;
  icon: string;
  connectionTypes: WalletConnectionType[];
  matchesInjectedEip1193?: (provider: ExternalProvider & any) => boolean;
  walletconnect2Id?: string;
};

const WALLET_CONNECT_EXPLORER_RECOMMENDED_WALLETS = {
  Metamask: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  imToken: 'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef',
  TokenPocket: '20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66',
  Trust: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
  Rainbow: '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
  Zerion: 'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18',
  Ledger: '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
  Fireblocks: '5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489',
  Uniswap: 'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a',
  Robinhood: '8837dd9413b1d9b585ee937d27a816590248386d9dbf59f5cd3422dbbb65683e',
  '1inch': 'c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576',
};

export const WALLET_CONNECT_EXPLORER_RECOMMENDED_IDS = Object.values(
  WALLET_CONNECT_EXPLORER_RECOMMENDED_WALLETS
);

export const wallets: Record<WalletType, WalletConfig> = {
  [WalletType.OtherWallet]: {
    type: WalletType.OtherWallet,
    stringKey: "Other",
    icon: GenericWalletIcon,
    connectionTypes: [WalletConnectionType.InjectedEip1193],
    matchesInjectedEip1193: (provider) =>
      Object.entries(wallets).every(
        ([walletType, walletConfig]) =>
          walletType === WalletType.OtherWallet ||
          !walletConfig.matchesInjectedEip1193 ||
          !walletConfig.matchesInjectedEip1193(provider)
      ),
  },
  [WalletType.MetaMask]: {
    type: WalletType.MetaMask,
    stringKey: "MetaMask",
    icon: MetaMaskIcon,
    connectionTypes: [WalletConnectionType.InjectedEip1193],
    matchesInjectedEip1193: isMetaMask,
    walletconnect2Id: WALLET_CONNECT_EXPLORER_RECOMMENDED_WALLETS.Metamask,
  },
};

// Injected EIP-1193 Providers
export type InjectedEthereumProvider = ExternalProvider;

export type InjectedWeb3Provider = ExternalProvider;

export type InjectedCoinbaseWalletExtensionProvider = InjectedEthereumProvider & {
  isMetaMask: true;
  overrideIsMetaMask: true;
  providerMap: Map<'MetaMask' | 'CoinbaseWallet', ExternalProvider>;
  providers: ExternalProvider[];
};

export type WithInjectedEthereumProvider = {
  ethereum: InjectedEthereumProvider;
};

export type WithInjectedWeb3Provider = {
  web3: {
    currentProvider: InjectedWeb3Provider;
  };
};

// Wallet connections

export type WalletConnection = {
  type: WalletConnectionType;
  provider?: ExternalProvider;
};

// Chain wallets

import { type onboarding } from '@dydxprotocol/v4-client-js';

export const COSMOS_DERIVATION_PATH = "m/44'/118'/0'/0/0";

/**
 * @description typed data to sign for Dora Vota Chain onboarding
 */
export const SIGN_TYPED_DATA = {
  primaryType: 'DORA',
  domain: {
    name: 'Dora Vota',
  },
  types: {
    DORA: [{ name: 'action', type: 'string' }],
  },
  message: {
    action: 'DORA Token Migration Onboarding',
  },
} as const;

export type PrivateInformation = ReturnType<typeof onboarding.deriveHDKeyFromEthereumSignature>;

export type EthereumAddress = `0x${string}`;
export type DoraAddress = `dora${string}`;
