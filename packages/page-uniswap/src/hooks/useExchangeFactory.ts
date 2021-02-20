import { useContractFactory, useContract } from '@patract/react-hooks';
import Exchange from '../contracts/exchange.json';
import Exchange2 from '../contracts/exchange2.json';
import { useCallback, useMemo } from 'react';

export const useExchangeFactory = () => {
  const attach = useContractFactory();


  return useCallback(
    (address, from: string, to: string) => {
      const abi =
        from === '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM' ||
        to === '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM'
          ? Exchange2
          : Exchange;
      return attach(address, abi);
    },
    [attach]
  );
};

export const useExchange = (address: string, isDot = false) => {
  const abi = useMemo(() => {
    return isDot ? Exchange2 : Exchange;
  }, [isDot]);
  return useContract(address, abi);
};
