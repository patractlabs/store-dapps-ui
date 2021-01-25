import React, { useState, useEffect, useMemo } from 'react';
import { AccountProvider } from './account-context';
import { Account as AccountType } from './types';

export const Account: React.FC<{ url: string }> = ({ url, children }) => {
  const [accountList, setAccountList] = useState<AccountType[]>([]);
  const [currentAccount, setCurrentAccount] = useState<AccountType>();

  useEffect(() => {
    Promise.resolve([{ address: 'GAnePsafe2WREfJEfs' }, { address: 'WEFsdf2sufhsaudfE5s' }]).then((data) => {
      setAccountList(data);
      setCurrentAccount(data[0]);
    });
  }, [url]);

  const value = useMemo(
    () => ({
      accountList,
      currentAccount,
      setCurrentAccount
    }),
    [accountList, currentAccount, setCurrentAccount]
  );

  return <AccountProvider value={value}>{children}</AccountProvider>;
};
