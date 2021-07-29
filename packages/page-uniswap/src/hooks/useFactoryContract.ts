import { useContract } from '@patract/react-hooks';
import { abis, PatraSwap } from '@patract/utils';

export const useFactoryContract = () => {
  return useContract(PatraSwap, abis.Factory);
};
