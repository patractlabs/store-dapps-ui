import { useContractFactory, useContract } from '@patract/react-hooks';
import { useCallback } from 'react';
import ERC20 from '@patract/utils/contracts/erc20_issue.json';

export const useTokenFactory = () => {
  const attach = useContractFactory();

  return useCallback((address) => {
    return attach(address, ERC20);
  }, [attach]);
};

export const useToken = (address: string) => {
  return useContract(address, ERC20);
};
