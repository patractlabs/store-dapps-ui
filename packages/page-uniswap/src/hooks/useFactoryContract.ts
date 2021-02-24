import { useContract } from '@patract/react-hooks';
import Factory from '@patract/utils/contracts/factory.json';
import { PatraSwap } from '@patract/utils';

export const useFactoryContract = () => {
  return useContract(PatraSwap, Factory);
};
