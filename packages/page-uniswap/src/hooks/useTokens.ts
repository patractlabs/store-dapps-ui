import { useContractFactory, contractQuery, useAccount } from '@patract/react-hooks';
import { useCallback, useMemo } from 'react';
import ERC20 from '../contracts/erc20.json';
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

  const queryUnknownToken = useCallback(
    async (address) => {
      try {
        const { contract } = factory(address);

        const [name, symbol, decimals] = await Promise.all([
          contractQuery(currentAccount, contract, 'erc20,tokenName'),
          contractQuery(currentAccount, contract, 'erc20,tokenSymbol'),
          contractQuery(currentAccount, contract, 'erc20,tokenDecimals')
        ]);

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
    [factory]
  );

  return useMemo(() => {
    return {
      data: addresses,
      queryUnknownToken
    };
  }, [queryUnknownToken]);
};
