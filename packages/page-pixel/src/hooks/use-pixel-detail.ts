import { useMemo, useState, useEffect } from 'react';
import { usePixelContract } from './use-pixel-contract';
import { useAccount } from '@patract/react-hooks';
import { compactStripLength } from '@polkadot/util';

const HEIGHT_FIELD = 180;
const WIDTH_FIELD = 320;


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
          const array: any = data.output?.toJSON()
          // const [_, result] = compactStripLength(data.output as any);
          // const r1 = Array.from(result);

          // const r = [];

          // for (let i = 1; i <= 90; i++) {
          //   r.push([...r1.slice((i - 1) * 160, i * 160)]);
          // }
          
          const canvasObj = new Array(HEIGHT_FIELD).fill(0).map(() => new Array(WIDTH_FIELD).fill(0));

          for(const item of array) {
            const xAxis = item[0] % 320
            const yAxis = Math.floor(item[0] / 320)
            canvasObj[yAxis][xAxis] =  item[1]
          }
         
          setResult(canvasObj);
        }
      })
      .catch(() => {
        setResult(null);
      });
  }, [contract, currentAccount, signal]);

  return result;
};
