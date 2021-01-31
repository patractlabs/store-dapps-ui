import { useContractFactory, useContract } from '@patract/react-hooks';
import Exchange from '../contracts/exchange.json';
import { useCallback } from 'react';

export const useExchangeFactory = () => {
  const attach = useContractFactory();

  return useCallback(
    (address) => {
      return attach(address, Exchange);
    },
    [attach]
  );
};

export const useExchange = (address: string) => {
  return useContract(address, Exchange);
};
