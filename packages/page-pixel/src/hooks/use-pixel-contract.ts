import { useContract } from '@patract/react-hooks';
import Pixel from '../contracts/pixel.json';

export const usePixelContract = () => {
  return useContract('5FAuq5anZnsMm8kke6NoPb1ofeTVbmiGsmhbS6r19xrQ26st', Pixel);
};
