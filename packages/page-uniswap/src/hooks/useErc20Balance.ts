import { useApi, useContractQuery } from '@patract/react-hooks';
import { useCallback } from 'react';
import { useAccount, useModal, contractQuery } from '@patract/react-hooks';

export const queryBalance = async (api: any, currentAccount: any, contract: any, account: any) => {
  if (contract.address.toString() === '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM') {
    const info = await api.query.system.account(account);
    return info.data.free.toString();
  } else {
    return contractQuery(currentAccount, contract, 'iErc20,balanceOf', account);
  }
};

export const useErc20Balance = (contract: any) => {
  const { api } = useApi();
  const { currentAccount } = useAccount();

  return useCallback(
    async (account: string) => {
      return queryBalance(api, currentAccount, contract, account);
    },
    [api, currentAccount, contract]
  );
};
