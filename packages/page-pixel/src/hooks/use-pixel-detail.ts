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
        const canvasObj = new Array(HEIGHT_FIELD).fill(0).map(() => new Array(WIDTH_FIELD).fill(0));

        if (data.output?.isEmpty) {
          console.log(canvasObj)

          setResult(canvasObj);
        } else {
          const array: any = data.output?.toJSON()
          
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
