import { useMemo, useState, useEffect } from 'react';
import { usePixelContract } from './use-pixel-contract';
import { useAccount } from '@patract/react-hooks';

const empty: any[] = [];

export const usePixelHistroy = () => {
  const { contract } = usePixelContract();
  const { currentAccount } = useAccount();
  const [data, setData] = useState<any>();
  const [result, setResult] = useState<any[]>(empty);
  useEffect(() => {
    console.log('currentAccount', currentAccount);
    contract.query.balanceOf(currentAccount, {}, currentAccount).then((data) => {
      console.log('data===', data);
      if (data.output?.isEmpty) {
        setData(null);
      } else {
        setData(data.output?.toJSON());
      }
    });
  }, [contract, currentAccount]);

  useEffect(() => {
    if (Array.isArray(data)) {
      Promise.all(
        data.map((id) => {
          return contract.query.tokenMetadata(currentAccount, {}, id).then((data) => {
            if (data.output?.isEmpty) {
              return null;
            } else {
              return {
                id: id,
                value: (data.output?.toJSON() as any)?.Ok
              };
            }
          });
        })
      ).then((arr) => {
        setResult(arr.filter((x) => x));
      });
    } else {
      setResult(empty);
    }
  }, [contract, data, currentAccount]);

  console.log(result);
  return result;
};
