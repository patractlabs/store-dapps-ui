import { useContract } from '@patract/react-hooks';
import Maker from '@patract/utils/contracts/patramaker.json';
import { PatraMaker } from '@patract/utils';

export const useMakerContract = () => {
  return useContract(PatraMaker, Maker);
};
