import { useContract } from '@patract/react-hooks';
import Pixel from '../contracts/pixel.json';

export const usePixelContract = () => {
  return useContract('5FmUk6r5R74LPhDNr5hrB7z78cpScnbDoS1A5voLvKHW86Gp', Pixel);
};
