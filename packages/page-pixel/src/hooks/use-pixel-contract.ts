import { useContract } from '@patract/react-hooks';
import { abis, PatraPixel } from '@patract/utils';

export const usePixelContract = () => {
  return useContract(PatraPixel, abis.Patrapixel);
};
