import { useContract } from '@patract/react-hooks';
import { PatraPixel } from '@patract/utils';
import Pixel from '@patract/utils/contracts/patrapixel.json'

export const usePixelContract = () => {
  return useContract(PatraPixel, Pixel);
};
