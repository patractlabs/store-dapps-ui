import { useAccount, useContractQuery, useContractTx } from '@patract/react-hooks';
import { useCallback } from 'react';

export const useApprove = (contract: any) => {
  const { excute } = useContractTx({
    title: 'Approve',
    contract: contract,
    method: 'iErc20,approve'
  });

  const { read } = useContractQuery({
    contract: contract,
    method: 'iErc20,allowance'
  });

  const { currentAccount } = useAccount();

  return useCallback(
    async (spender: string) => {
      // isDot
      if (contract.address.toString() === '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM') {
        return;
      }

      const allowance = await read(currentAccount, spender);

      if (Number(allowance) >= Number('0x0fffffffffffffffffffffffffffffff')) {
        return;
      } else {
        return excute([spender, '0xffffffffffffffffffffffffffffffff']);
      }
    },
    [excute, currentAccount, contract]
  );
};
