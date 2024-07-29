import { useMemo } from 'react';
import { decode } from 'bech32';

import { useAccounts } from './useAccounts';
import { useRestrictions } from './useRestrictions';


function verifyIsBech32(address: string): Error | undefined {
  try {
    decode(address);
  } catch (error) {
    return error;
  }

  return undefined;
}

function isValidAddress(address: string): boolean {
  // An address is valid if it starts with `dora` and is Bech32 format.
  return address.startsWith('dora') && verifyIsBech32(address) === undefined;
}

export const useIsDoraAddressValid = (doraAddress?: string) => {
  const { dydxAddress: accountDoraAddress } = useAccounts();
  const { isAddressSanctioned } = useRestrictions();

  return useMemo(
    () =>
      doraAddress !== undefined &&
      (doraAddress === accountDoraAddress || isValidAddress(doraAddress)) &&
      !isAddressSanctioned(doraAddress),
    [doraAddress, accountDoraAddress, isAddressSanctioned]
  );
};
