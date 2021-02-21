import { useEffect, useState } from 'react';
import { useApi } from './useApi';

export const useBalance = (account: string) => {
  const { api } = useApi();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    api.query.system
      .account(account, (info) => {
        setBalance(info.data.free.toString());
      })
      .catch(() => {
        setBalance(null);
      });
  }, [api, account]);

  return balance;
};
