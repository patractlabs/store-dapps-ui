import { useContract } from '@patract/react-hooks';
import { abis, PatraMaker } from '@patract/utils';

export const useMakerContract = () => {
  return useContract(PatraMaker, abis.Patramaker);
};
