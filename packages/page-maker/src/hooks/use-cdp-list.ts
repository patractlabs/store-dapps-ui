import { useMakerContract } from './use-maker-contract';
import { useContractQuery } from '@patract/react-hooks';
import { useEffect, useState } from 'react';
import { CDP } from '../pages/maker/types';

const empty: any[] = [];

export const useCdpList = (signal = 0): { data: CDP[], isLoading: boolean } => {
  const { contract } = useMakerContract();
  const [data, setList] = useState(empty);
  const [isLoading, setIsLoading] = useState(false);
  const { read: readTotal } = useContractQuery({ contract, method: 'cdpCount' });
  const { read: readDetail } = useContractQuery({ contract, method: 'queryCdp' });

  useEffect(() => {
    setIsLoading(true);
    readTotal()
      .then((total) => {
        if (!total) return [];
        return Promise.all(
          [...new Array(total)]
            .map((_, i) => i + 1)
            .reverse()
            .map(id => {
              return readDetail(id).then((data: any) => {
                return {
                  ...data,
                  id,
                };
              });
            })
        );
      })
      .then((r) => {
        setList(r);
      })
      .catch((e) => {
        console.log(e, 'total error');
        setList(empty);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [readTotal, signal, readDetail]);

  return {
    isLoading,
    data,
  };
};
