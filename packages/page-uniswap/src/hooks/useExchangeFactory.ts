import { useContractFactory, useContract } from '@patract/react-hooks';
import Exchange from '@patract/utils/contracts/exchange.json';
import Exchange2 from '@patract/utils/contracts/exchange2.json';
import { useCallback, useMemo } from 'react';

export const useExchangeFactory = () => {
  const attach = useContractFactory();


  return useCallback(
    (address, from: string, to: string) => {
      const abi =
        from === '3bU9io5UzZju4XX4YqscpRv3ocieRmNXuTQQzmiq3ETgKhGV' ||
        to === '3bU9io5UzZju4XX4YqscpRv3ocieRmNXuTQQzmiq3ETgKhGV'
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
