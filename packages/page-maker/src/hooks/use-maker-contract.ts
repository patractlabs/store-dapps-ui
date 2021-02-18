import { useContract } from '@patract/react-hooks';
import Maker from '../contracts/maker.json';

export const useMakerContract = () => {
  return useContract('5FAuq5anZnsMm8kke6NoPb1ofeTVbmiGsmhbS6r19xrQ26st', Maker);
};
