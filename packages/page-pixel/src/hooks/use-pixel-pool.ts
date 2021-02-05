import { useAccount } from '@patract/react-hooks';
import { useEffect, useState } from 'react';
import { usePixelContract } from './use-pixel-contract';

const empty: any[] = [];

export const usePixelPool = () => {
  const { contract } = usePixelContract();
  const { currentAccount } = useAccount();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    contract.query
      .pool(currentAccount, {})
      .then((data) => {
        if (data.output?.isEmpty) {
          setResult(null);
        } else {
          setResult(data.output?.toString());
        }
      })
      .catch(() => {
        setResult(null);
      });
  }, [contract, currentAccount]);

  return result;
};
