import { useContract } from '@patract/react-hooks';
import Factory from '../contracts/factory.json';
import { PatraSwap } from '@patract/utils';

export const useFactoryContract = () => {
  return useContract(PatraSwap, Factory);
};
