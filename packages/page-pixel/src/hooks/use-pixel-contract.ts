import { useContract } from '@patract/react-hooks';
import { PatraPixel } from '@patract/utils';
import Pixel from '../contracts/pixel.json';

export const usePixelContract = () => {
  return useContract(PatraPixel, Pixel);
};
