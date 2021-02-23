import { useAccount, useApi } from '@patract/react-hooks';
import { formatAmount } from '@patract/utils';
import { useEffect, useState } from 'react';

export const useBalance = () => {
  const { api } = useApi();
  const { currentAccount } = useAccount();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    api.query.system
      .account(currentAccount, (result) => {
        if (!result) setBalance('0');
        setBalance(formatAmount(result.data.free.toString(), 10));
      })
      .catch(() => {
        setBalance('0');
      });
  }, [api, currentAccount]);

  return balance;
};
