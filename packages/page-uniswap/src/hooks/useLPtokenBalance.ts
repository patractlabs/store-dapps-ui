import { useContractQuery, useAccount } from '@patract/react-hooks';
import { useEffect, useState } from 'react';
import { useLPtokenContract } from './useLPtokenContract';

export const useLPtokenBalance = (address?: undefined) => {
  const { currentAccount } = useAccount();
  const { contract } = useLPtokenContract();
  const { read } = useContractQuery({ contract, method: 'balanceOf' });
  const [result, setResult] = useState<string | number | undefined>(undefined);

  useEffect(() => {
    read(address || currentAccount)
      .then((data: any) => {
        setResult(data || 0);
      })
      .catch((error) => {
        setResult(undefined);
        throw error;
      });
  }, [read, currentAccount, address]);

  return result;
};
