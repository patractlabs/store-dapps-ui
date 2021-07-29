import { useApi, useContractQuery, useAccount, useModal, contractQuery } from '@patract/react-hooks';
import { useCallback } from 'react';

import { EMPTY, trait } from '@patract/utils';

export const queryBalance = async (api: any, currentAccount: any, contract: any, account: any) => {
  if (contract.address.toString() === EMPTY) {
    const info = await api.query.system.account(account);
    return info.data.free.toString();
  } else {
    return contractQuery(currentAccount, contract, `${trait}balanceOf`, account);
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
