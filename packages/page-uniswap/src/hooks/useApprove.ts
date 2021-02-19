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


  return useCallback(async (spender: string) => {
    const allowance = await read(currentAccount, spender)
    console.log('allowance', allowance)

    if(allowance === '0xffffffffffffffffffffffffffffffff') {
      return 
    } else {
      return excute([spender, '0xffffffffffffffffffffffffffffffff'])
    }
  }, [excute, currentAccount])
}