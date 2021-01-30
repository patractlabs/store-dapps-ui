import { useMemo } from 'react';
import { useContractFactory } from './useContractFactory';

export const useContract = (address: string, abi: any) => {
  const attach = useContractFactory();

  return useMemo(() => {
    return attach(address, abi);
  }, [address, abi]);
};
