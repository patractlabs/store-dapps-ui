import { useContractFactory } from '@patract/react-hooks';
import Exchange from '../contracts/exchange.json';
import { useCallback } from 'react';

export const useExchangeFactory = () => {
  const attach = useContractFactory();

  return useCallback((address) => {
    return attach(address, Exchange);
  }, []);
};
