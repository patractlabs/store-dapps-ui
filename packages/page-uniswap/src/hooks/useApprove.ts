import { useAccount, useContractQuery, useContractTx } from '@patract/react-hooks';
import { EMPTY, trait } from '@patract/utils';
import { useCallback } from 'react';

export const useApprove = (contract: any) => {
  const { excute } = useContractTx({
    title: 'Approve',
    contract: contract,
    method: `${trait}approve`
  });

  const { read } = useContractQuery({
    contract: contract,
    method: `${trait}allowance`
  });

  const { currentAccount } = useAccount();

  return useCallback(
    async (spender: string) => {
      // isDot
      if (contract.address.toString() === EMPTY) {
        return;
      }

      const allowance = await read(currentAccount, spender);

      if (Number(allowance) >= Number('0x0fffffffffffffffffffffffffffffff')) {
      } else {
        return excute([spender, '0xffffffffffffffffffffffffffffffff']);
      }
    },
    [excute, currentAccount, contract]
  );
};
