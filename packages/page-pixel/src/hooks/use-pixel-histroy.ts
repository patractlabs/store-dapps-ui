import { useMemo } from 'react';
import { usePixelContract } from './use-pixel-contract';

export const usePixelHistroy = () => {
  const { contract } = usePixelContract();

  return useMemo(() => {
    return contract.query.tx('1', {});
  }, []);
};
