import { useContract } from '@patract/react-hooks';
import Maker from '../contracts/maker.json';
import { PatraMaker } from '@patract/utils';

export const useMakerContract = () => {
  return useContract(PatraMaker, Maker);
};
