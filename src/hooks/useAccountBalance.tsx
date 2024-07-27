import { useContext, createContext } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { useBalance, useContractRead } from 'wagmi';
import { ethINFContractAbi } from '@/constants/abi';

import { TOKEN_DECIMAL_SHIFT } from '@/constants/migrate';

import { calculateCanAccountMigrate } from '@/state/accountCalculators';

import { MustBigNumber } from '@/lib/numbers';

import { useAccounts } from './useAccounts';

const AccountBalanceContext = createContext<
  ReturnType<typeof useAccountBalanceContext> | undefined
>(undefined);

AccountBalanceContext.displayName = 'AccountBalance';

export const AccountBalanceProvider = ({ ...props }) => (
  <AccountBalanceContext.Provider value={useAccountBalanceContext()} {...props} />
);

export const useAccountBalance = () => useContext(AccountBalanceContext)!;

const ACCOUNT_BALANCE_POLLING_INTERVAL = 60_000;

const useAccountBalanceContext = () => {
  const { evmAddress, dydxAddress, getAccountBalance } = useAccounts();
  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  console.log(`ETH dydx contract address is ${import.meta.env.VITE_ETH_DORA_ADDRESSS}`)
  console.log(`query evmAddress is ${evmAddress}`)
  console.log(`是否可以进行账户迁移${canAccountMigrate}`)
  console.log(`chain id is ${Number(import.meta.env.VITE_ETH_CHAIN_ID)}`)

  const { data: ethDYDXBalanceData, refetch: refetchEthDYDXBalance } = useBalance({
    enabled: import.meta.env.VITE_ETH_DORA_ADDRESSS && evmAddress && canAccountMigrate,
    address: evmAddress,
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
    token: import.meta.env.VITE_ETH_DORA_ADDRESSS,
  });

  const { data: balance, isError, isLoading, refetch } = useContractRead({
    address: import.meta.env.VITE_ETH_DORA_ADDRESSS,
    abi: ethINFContractAbi,
    functionName: 'balanceOf',
    args: [evmAddress],
    watch: true,
  });

  console.log(`dydx使用合约查询的余额为${balance}`)

  console.log(`ethDYDXBalanceData is ${ethDYDXBalanceData}`)
  const result = useBalance({
    enabled: import.meta.env.VITE_ETH_DORA_ADDRESSS && evmAddress && canAccountMigrate,
    address: evmAddress,
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
    token: import.meta.env.VITE_ETH_DORA_ADDRESSS,
  });
  console.log(`result查询结果为${result.toString()}`)

  const { data: wethDYDXBalanceData, refetch: refetchWethDYDXBalance } = useBalance({
    enabled: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS && evmAddress && canAccountMigrate,
    address: evmAddress,
    token: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
  });

  const { data: DYDXBalance, refetch: refetchDYDXBalance } = useQuery({
    enabled: Boolean(import.meta.env.VITE_DYDX_DENOM && dydxAddress !== undefined),
    queryKey: ['usePollDYDXBalance', { dydxAddress }],
    queryFn: async () => {
      if (!dydxAddress) return;
      return await getAccountBalance({
        dydxAddress,
        denom: import.meta.env.VITE_DYDX_DENOM,
      });
    },
    refetchInterval: ACCOUNT_BALANCE_POLLING_INTERVAL,
    staleTime: ACCOUNT_BALANCE_POLLING_INTERVAL,
    select: (data) =>
      MustBigNumber(data?.amount)
        .shiftedBy(TOKEN_DECIMAL_SHIFT * -1)
        .toString(),
  });

  const { formatted: ethDYDXBalance } = ethDYDXBalanceData || {};
  const { formatted: wethDYDXBalance } = wethDYDXBalanceData || {};

  console.log(ethDYDXBalance)

  const refetchBalances = () => {
    if (!evmAddress || !canAccountMigrate) return;

    refetchEthDYDXBalance();
    refetchWethDYDXBalance();

    if (dydxAddress !== undefined) refetchDYDXBalance();
  };

  return {
    ethDYDXBalance,
    wethDYDXBalance,
    DYDXBalance,

    refetchBalances,
  };
};
