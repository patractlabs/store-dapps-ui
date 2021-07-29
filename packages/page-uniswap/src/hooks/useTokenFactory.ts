import { useContractFactory, useContract } from '@patract/react-hooks';
import { abis } from '@patract/utils';
import { useCallback } from 'react';

export const useTokenFactory = () => {
  const attach = useContractFactory();

  return useCallback(
    (address) => {
      return attach(address, abis.Erc20issue);
    },
    [attach]
  );
};

export const useToken = (address: string) => {
  return useContract(address, abis.Erc20issue);
};
