import { useApi } from './useApi';
import { ContractPromise, Abi } from '@polkadot/api-contract';
import { useMemo } from 'react';

export const useContract = (address: string, abi: any) => {
  const { api } = useApi();

  return useMemo(() => {
    if (!address) {
      throw new Error('Unexpected');
    }

    return {
      contract: new ContractPromise(api, abi, address),
      abi: new Abi(abi),
      abiJSON: abi
    };
  }, [api, address, abi]);
};
