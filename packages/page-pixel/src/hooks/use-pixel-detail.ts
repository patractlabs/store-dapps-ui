import { useMemo, useState, useEffect } from 'react';
import { usePixelContract } from './use-pixel-contract';
import { useAccount } from '@patract/react-hooks';
import { compactStripLength } from '@polkadot/util';

const empty: any[] = [];

export const usePixelDetail = (signal = 0) => {
  const { contract } = usePixelContract();
  const { currentAccount } = useAccount();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    contract.query
      .metadata(currentAccount, {})
      .then((data) => {
        if (data.output?.isEmpty) {
          setResult(null);
        } else {
          const [_, result] = compactStripLength(data.output as any);
          const r1 = Array.from(result);

          const r = [];

          for (let i = 1; i <= 90; i++) {
            r.push([...r1.slice((i - 1) * 160, i * 160)]);
          }

          setResult(r);
        }
      })
      .catch(() => {
        setResult(null);
      });
  }, [contract, currentAccount, signal]);

  return result;
};
