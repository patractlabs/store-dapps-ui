import { useContractFactory, useContract } from '@patract/react-hooks';
import { abis, EMPTY } from '@patract/utils';
import { useCallback, useMemo } from 'react';

export const useExchangeFactory = () => {
  const attach = useContractFactory();

  return useCallback(
    (address, from: string, to: string) => {
      const abi = from === EMPTY || to === EMPTY ? abis.Exchange2 : abis.Exchange;
      return attach(address, abi);
    },
    [attach]
  );
};

export const useExchange = (address: string, isDot = false) => {
  const abi = useMemo(() => {
    return isDot ? abis.Exchange2 : abis.Exchange;
  }, [isDot]);
  return useContract(address, abi);
};
