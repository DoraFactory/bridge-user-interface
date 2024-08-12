import { useContext, createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { STRING_KEYS, DORA_LONG_SENTENCE } from '@/constants/localization';

import {
  MigrateFormSteps,
  MigrateTabs,
  PendingMigrationFilter,
  TransactionStatus,
} from '@/constants/migrate';

import { calculateCanAccountMigrate } from '@/state/accountCalculators';

import { MustBigNumber } from '@/lib/numbers';
import { parseWalletError } from '@/lib/wallet';

import { useAccountBalance } from './useAccountBalance';
import { useAccounts } from './useAccounts';
import { useBridgeTransaction } from './migrate/useBridgeTransaction';
import { useIsDoraAddressValid } from './useIsDoraAddressValid';
import { useMatchingEvmNetwork } from './useMatchingEvmNetwork';
import { usePendingMigrationsData } from './usePendingMigrationsData';
import { useStringGetter } from './useStringGetter';
import { useTokenAllowance } from './migrate/useTokenAllowance';
import { useRestrictions } from './useRestrictions';

const MigrateTokenContext = createContext<ReturnType<typeof useMigrateTokenContext> | undefined>(
  undefined
);

MigrateTokenContext.displayName = 'MigrateToken';

export const MigrateTokenProvider = ({ ...props }) => (
  <MigrateTokenContext.Provider value={useMigrateTokenContext()} {...props} />
);

export const useMigrateToken = () => useContext(MigrateTokenContext)!;

const useMigrateTokenContext = () => {
  const stringGetter = useStringGetter();
  const { evmAddress, DoraAddress } = useAccounts();
  const { ethDORABalance, refetchBalances } = useAccountBalance();
  const { screenAddresses, restrictUser } = useRestrictions();
  const { isMatchingNetwork, matchNetwork, isSwitchingNetwork } = useMatchingEvmNetwork({
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
  });

  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const [selectedTab, setSelectedTab] = useState(MigrateTabs.Migrate);

  // Form state and inputs
  const [currentStep, setCurrentStep] = useState(MigrateFormSteps.Edit);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | React.ReactNode[] | undefined>();
  const [amountBN, setAmountBN] = useState<BigNumber | undefined>();
  const [destinationAddress, setDestinationAddress] = useState<string | undefined>(
    DoraAddress as string | undefined
  );

  useEffect(() => {
    setAmountBN(undefined);
  }, [evmAddress]);

  // Validations
  const isAmountValid = Boolean(
    MustBigNumber(ethDORABalance).gt(0) && amountBN?.gt(0) && amountBN?.lte(ethDORABalance ?? 0)
  );

  const isDestinationAddressValid = useIsDoraAddressValid(destinationAddress);

  const canWriteContracts = canAccountMigrate && isAmountValid && isDestinationAddressValid;
  console.log(`在allowance中是否可以写合约？${canWriteContracts}`)
  console.log(amountBN)
  console.log(MigrateFormSteps.Preview)
  // Transactions
  const { needTokenAllowance, approveToken, ...tokenAllowance } = useTokenAllowance({
    amountBN,
    enabled: canWriteContracts,
    watch: currentStep === MigrateFormSteps.Preview,
  });

  console.log(`needTokenAllowance is ${needTokenAllowance}`)

  const { clearStatus, startBridge, bridgeTxError, transactionStatus, ...bridgeTransaction } =
    useBridgeTransaction({
      amountBN,
      destinationAddress,
    });

  const { setAddressSearchFilter, setFilter, refetchPendingMigrations } =
    usePendingMigrationsData();

/*   useEffect(() => {
    // Found current corresponding pending migration
    if (transactionStatus === TransactionStatus.Acknowledged) refetchPendingMigrations();
  }, [transactionStatus]); */

  useEffect(() => {
    // Reset statuses when editing or starting new migration
    if (currentStep === MigrateFormSteps.Edit) {
      refetchBalances();
      clearStatus();
      setErrorMsg(undefined);
    }
  }, [currentStep]);

  const resetForm = (shouldClearInputs?: boolean) => {
    if (shouldClearInputs) {
      setAmountBN(undefined);
      setDestinationAddress(DoraAddress);
    }
    setCurrentStep(MigrateFormSteps.Edit);
  };

  useEffect(() => {
    if (!canAccountMigrate && !isSwitchingNetwork && !isRequesting) resetForm();
  }, [canAccountMigrate, isSwitchingNetwork, isRequesting]);

  const onFormSubmit = async () => {
    switch (currentStep) {
      case MigrateFormSteps.Edit: {
        if (!canAccountMigrate) return;
        setCurrentStep(MigrateFormSteps.Preview);
        break;
      }
      case MigrateFormSteps.Preview: {
        if (!canWriteContracts) return;
        setIsRequesting(true);

        try {
          const screenResults = await screenAddresses({
            addresses: [evmAddress!, DoraAddress!, destinationAddress!],
            throwError: true,
          });

          if (screenResults?.[evmAddress as string] || screenResults?.[DoraAddress as string]) {
            restrictUser();
            return;
          } else if (screenResults?.[destinationAddress!]) {
            setErrorMsg(
              DORA_LONG_SENTENCE.MIGRATION_BLOCKED_MESSAGE_DESTINATION
            );
            return;
          }
        } catch (error) {
          setErrorMsg('Indexer is currently unavailable.');
          return;
        }

        try {
          if (!isMatchingNetwork) await matchNetwork();

          if (needTokenAllowance) {
            await approveToken();
          } else {
            await startBridge();
            setCurrentStep(MigrateFormSteps.Confirmed);
          }
        } catch (error) {
          const { message } = parseWalletError({
            error,
            stringGetter,
          });

          if (message) setErrorMsg(message);
        } finally {
          setIsRequesting(false);
        }

        break;
      }

      case MigrateFormSteps.Confirmed: {
        if (bridgeTxError) {
          resetForm();
        } else if (transactionStatus === TransactionStatus.Acknowledged) {
          // Show relevant pending migrations
          if (destinationAddress !== DoraAddress) {
            setFilter(PendingMigrationFilter.All);
            setAddressSearchFilter(destinationAddress ?? '');
          } else {
            setFilter(PendingMigrationFilter.Mine);
          }

          setSelectedTab(MigrateTabs.PendingMigrations);
        }

        break;
      }
    }
  };

  return {
    selectedTab,
    setSelectedTab,

    // form state and inputs
    onFormSubmit,
    resetForm,
    currentStep,
    errorMsg,

    amountBN,
    setAmountBN,
    destinationAddress,
    setDestinationAddress,
    isAmountValid,
    isDestinationAddressValid,

    // token allowance
    needTokenAllowance,
    ...tokenAllowance,

    // transaction tracking
    bridgeTxError,
    transactionStatus,
    ...bridgeTransaction,
  };
};
