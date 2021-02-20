import { useContract } from '@patract/react-hooks';
import Pixel from '../contracts/pixel.json';

export const usePixelContract = () => {
  return useContract('5GSk8bjDtYoeH1E3B3xjgvDvUNk3U91KbyGaWtA7zvSRwzfa', Pixel);
};
