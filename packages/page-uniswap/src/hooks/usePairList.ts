import { useContract, useContractQuery, contractQuery, useAccount } from '@patract/react-hooks';
import { useEffect, useState } from 'react';
import { useFactoryContract } from './useFactoryContract';
import { useExchangeFactory } from './useExchangeFactory';
import { useTokenFactory } from './useTokenFactory';

const empty: any[] = [];

export const usePairList = (signal = 0) => {
  const { contract } = useFactoryContract();
  const { currentAccount } = useAccount();
  const createExchange = useExchangeFactory();
  const createToken = useTokenFactory();

  const { read: readSwapPairs } = useContractQuery({ contract, method: 'factory,getSwapPairs' });
  const { read: readExchangeAddress } = useContractQuery({ contract, method: 'factory,getExchange' });

  const [data, setData] = useState<any[]>(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    readSwapPairs()
      .then((data: any) => {
        return Promise.all(
          (data || []).map(([from, to]: any) => {
            return readExchangeAddress(from, to).then((exchange) => {
              return {
                from,
                to,
                exchange
              };
            });
          })
        );
      })
      .then((result) => {
        return Promise.all(
          (result || []).map(({ from, to, exchange }: any) => {
            const { contract } = createExchange(exchange);
            const { contract: fromContract } = createToken(from);
            const { contract: toContract } = createToken(to);

            return Promise.all([
              contractQuery(currentAccount, contract, 'exchangeInfo'),
            ]).then(([data]: any) => {
              if(data.to === "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM") {
                data.to_symbol = 'DOT'
                data.to_decimals = 10
              }
              if(data.from === "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM") {
                data.from_symbol = 'DOT'
                data.from_decimals = 10
              }
              return ({
                ...data,
                from,
                to,
                exchange
              })
            })
            
          })
        );
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.log(error);
        setData(empty);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [readSwapPairs, readExchangeAddress, createExchange, currentAccount, signal, createToken]);

  return {
    data,
    loading
  };
};
