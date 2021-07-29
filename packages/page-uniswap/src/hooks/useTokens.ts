import { contractQuery, useAccount, useContractQuery } from '@patract/react-hooks';
import { EMPTY, trait } from '@patract/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFactoryContract } from './useFactoryContract';
import { useTokenFactory } from './useTokenFactory';

const addresses = [
  {
    address: '5C9LcUtrcwKRrYizNu3cXQFkw9NFpcRKQhC3hTJfX3DLtVox',
    name: 'USDT',
    symbol: 'USDT',
    decimals: 10
  },
  {
    address: '5GBDNk8TNJk5hJsq5GU52fKhovyu27bieUK3qTxLvH4TSMoo',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 10
  }
];

export const useTokens = () => {
  const factory = useTokenFactory();
  const { currentAccount } = useAccount();
  const [tokens, setTokens] = useState([]);

  const { contract } = useFactoryContract();
  const createToken = useTokenFactory();

  const { read: readSwapPairs } = useContractQuery({ contract, method: 'factory,getSwapPairs' });

  const queryUnknownToken = useCallback(
    async (address) => {
      try {
        const { contract } = factory(address);

        let [name, symbol, decimals] = await Promise.all([
          contractQuery(currentAccount, contract, `${trait}tokenName`),
          contractQuery(currentAccount, contract, `${trait}tokenSymbol`),
          contractQuery(currentAccount, contract, `${trait}tokenDecimals`)
        ]);

        if (address === EMPTY) {
          decimals = 10;
          symbol = 'DOT';
          name = 'Polkadot';
        }

        return {
          address,
          name,
          decimals,
          symbol
        };
      } catch {
        return null;
      }
    },
    [currentAccount, factory]
  );

  useEffect(() => {
    readSwapPairs().then(async (data: any) => {
      const set = new Set();

      (data || []).forEach(([from, to]: any) => {
        set.add(from);
        set.add(to);
      });

      const all = [...set];

      const tokens = await Promise.all(
        all.map(async (address: any) => {
          const { contract } = createToken(address);

          let [decimals, name, symbol] = await Promise.all([
            contractQuery(currentAccount, contract, `${trait}tokenDecimals`),
            contractQuery(currentAccount, contract, `${trait}tokenName`),
            contractQuery(currentAccount, contract, `${trait}tokenSymbol`)
          ]);

          if (address === EMPTY) {
            decimals = 10;
            symbol = 'DOT';
            name = 'Polkadot';
          }

          return {
            address,
            symbol,
            name,
            decimals
          };
        })
      );

      setTokens(tokens as any);
    });
  }, [createToken, currentAccount, readSwapPairs]);

  return useMemo(() => {
    return {
      data: tokens,
      queryUnknownToken
    };
  }, [queryUnknownToken, tokens]);
};
