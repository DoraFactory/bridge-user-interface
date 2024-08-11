import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useBalance, useContractRead } from 'wagmi';
import { bridgeContractAbi } from '@/constants/abi';
import { ethers } from 'ethers';
import { toBech32, fromHex } from '@cosmjs/encoding';

import {
  PendingMigrationData,
  PendingMigrationFilter,
  TOKEN_DECIMAL_SHIFT,
} from '@/constants/migrate';

import { DoraAddress } from '@/constants/wallets';

import { MustBigNumber } from '@/lib/numbers';

import { useAccounts } from './useAccounts';
import { useDydxClient } from './useDydxClient';
import BigNumber from 'bignumber.js';

const PENDING_MIGRATIONS_POLLING_INTERVAL = 600_000;

export const usePendingMigrationsData = ({
  interval = PENDING_MIGRATIONS_POLLING_INTERVAL,
}: {
  interval?: number;
} = {}) => {
  const { DoraAddress, evmAddress } = useAccounts();
  const { compositeClient } = useDydxClient();
  // const [unprocessedCount, setUnprocessedCount] = useState();

  const [filter, setFilter] = useState(
    DoraAddress ? PendingMigrationFilter.Mine : PendingMigrationFilter.All
  );
  const [addressSearchFilter, setAddressSearchFilter] = useState<string>('');

  const [pendingMigrations, setPendingMigrations] = useState<PendingMigrationData[]>([]);
  const [refetchPendingMigrations, setRefetchPendingMigrations] = useState(null);
  const [filteredPendingMigrations, setFilteredPendingMigrations] = useState<
    PendingMigrationData[]
  >([]);

  // Get totalRecords count
  const { data: totalRecordsData } = useContractRead({
    address: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
    abi: bridgeContractAbi,
    functionName: 'totalRecords',
  });

  console.log(`total totalRecordsData 数量is ${totalRecordsData}`);

  // Get processedRecords count
  const { data: processedRecordsData } = useContractRead({
    address: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
    abi: bridgeContractAbi,
    functionName: 'processedRecords',
  });
  console.log(`processedRecordsData 数量is ${processedRecordsData}`);

  // Get unprocessedRecords count
  const unprocessedCount = Number(totalRecordsData) - Number(processedRecordsData);

  // Get unprocessed Records Info
  const { data: unprocessedRecordsData } = useContractRead({
    address: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
    abi: bridgeContractAbi,
    functionName: 'getUnprocessedRecords',
    args: [unprocessedCount],
    enabled: unprocessedCount > 0,
  });
  console.log(`unprocessedCount is ${unprocessedCount}`);

  console.log(`未处理的Record data为${unprocessedRecordsData}`);

  useEffect(() => {
    if (unprocessedCount > 0) {
      const fetchData = async () => {
        try {
          console.log(`查询未处理的数据。。。。。。。。`);
          const data = unprocessedRecordsData;
          if (!data) {
            console.log('Data is undefined or null');
            setPendingMigrations([]);
            return;
          }
          console.log(`data is ${data}`);
          if (Array.isArray(data) && data.length === 2) {
            const [size, records] = data;
            const mappedData = records.map((record, idx) => ({
              id: idx,
              address: toBech32(
                'dora',
                fromHex(record.vota.startsWith('0x') ? record.vota.slice(2) : record.vota)
              ),
              amount: BigNumber(record.amount).shiftedBy(-18).toFixed(),
              txHash: ethers.hexlify(record.txHash),
            })) as PendingMigrationData[];
            setPendingMigrations(mappedData);
          } else {
            console.log(`data is not in expected format: ${data}`);
            setPendingMigrations([]);
          }
        } catch (error) {
          console.error('Error fetching pending migrations:', error);
          setPendingMigrations([]);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, interval);
      return () => clearInterval(intervalId);
    }
  }, [unprocessedCount, unprocessedRecordsData, interval]);

  // Get an evm address's all records
  const { data: evmUserRecords, error } = useContractRead({
    address: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
    abi: bridgeContractAbi,
    functionName: 'recordOf',
    args: [evmAddress],
    enabled: filter === PendingMigrationFilter.Mine && Boolean(evmAddress),
  });

  console.log(evmUserRecords);

  useEffect(() => {
    if (error) {
      console.error('Error fetching records from bridge contract:', error);
    }

    let transformedUserRecords = [];
    // 假设 records 是对象或单个值，需要将其转换为数组
    if (evmUserRecords) {
      // 根据 records 的实际数据结构进行转换，这里假设它是一个对象
      transformedUserRecords = Object.values(evmUserRecords);
    }

    let transformedEVMUserRecords = transformedUserRecords.map((record, idx) => ({
      id: idx,
      address: toBech32(
        'dora',
        fromHex(record.vota.startsWith('0x') ? record.vota.slice(2) : record.vota)
      ),
      amount: BigNumber(record.amount).shiftedBy(-18),
      txHash: ethers.hexlify(record.txHash),
    })) as PendingMigrationData[];

    console.log(`transformedEVMUserRecords is ${transformedEVMUserRecords}`);

    if (filter === PendingMigrationFilter.Mine && evmAddress && transformedUserRecords.length) {
      setFilteredPendingMigrations(transformedEVMUserRecords);
    } else {
      const searchFilter = addressSearchFilter.trim().toLowerCase();
      const filtered = (pendingMigrations ?? []).filter(({ address }) =>
        address.includes(searchFilter)
      );
      setFilteredPendingMigrations(filtered);
    }
  }, [evmUserRecords, error, addressSearchFilter, filter, evmAddress]);

  const { data: latestBlockHeight } = useQuery({
    enabled: !!compositeClient && Boolean(pendingMigrations?.length),
    queryKey: ['pollLatestBlockHeight'],
    queryFn: async () => await compositeClient?.validatorClient.get.latestBlockHeight(),
    refetchInterval: interval,
    staleTime: interval,
  });

  return {
    filter,
    setFilter,
    addressSearchFilter,
    setAddressSearchFilter,

    latestBlockHeight,
    pendingMigrations: filteredPendingMigrations,
    refetchPendingMigrations,
  };
};
