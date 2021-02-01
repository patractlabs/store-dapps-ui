import { useApi, useAccount } from '@patract/react-hooks';
import { formatAmount } from '@patract/utils';
import { useMemo, useEffect, useState } from 'react';

export const useBalance = () => {
  const { api } = useApi();
  const { currentAccount } = useAccount();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    api.query.system
      .account(currentAccount)
      .then((result) => {
        if (!result) setBalance('0');
        setBalance(formatAmount(result.data.free.toString(), 10));
      })
      .catch(() => {
        setBalance('0');
      });
  }, [api]);

  return balance;
};
