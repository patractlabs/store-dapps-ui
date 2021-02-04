import { useContractQuery } from '@patract/react-hooks';
import { useEffect, useState } from 'react';
import { usePkContract } from './usePkContract';

const empty: any[] = [];

export const usePklist = (signal = 0) => {
  const { contract } = usePkContract();
  const [result, setResult] = useState(empty);
  const [isLoading, setIsLoading] = useState(false);
  const { read: readTotal } = useContractQuery({ contract, method: 'gameTotal' });
  const { read: readDetail } = useContractQuery({ contract, method: 'gameOf' });

  useEffect(() => {
    setIsLoading(true);
    readTotal()
      .then((total) => {
        if (!total) return [];
        return Promise.all(
          [...new Array(total)]
            .map((_, i) => i + 1)
            .reverse()
            .map((id: any) => {
              return readDetail(id).then((data: any) => {
                return {
                  id,
                  ...data?.Ok
                };
              });
            })
        );
      })
      .then((r) => {
        setResult(r);
      })
      .catch(() => {
        setResult(empty);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [readTotal, signal, readDetail]);

  return {
    isLoading,
    data: result
  };
};
