import React, { useState, useReducer, useEffect, useMemo } from 'react';
import { AccountContext } from './account-context';
import { useApi } from '@patract/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

export const AccountProvider: React.FC = ({ children }) => {
  const { isApiReady } = useApi();
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [count, forceUpdate] = useReducer((x) => x + 1, 1);

  const accountList = useMemo(() => {
    if (!isApiReady) return;
    return keyring.getPairs();
  }, [isApiReady, count]);

  const value = useMemo(
    () => ({
      accountList,
      currentAccount,
      setCurrentAccount,
      updateAccounts: forceUpdate
    }),
    [accountList, currentAccount, setCurrentAccount, forceUpdate]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
