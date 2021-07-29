import { useContract } from '@patract/react-hooks';
import { abis, DAI } from '@patract/utils';

export const useDaiContract = () => {
  return useContract(DAI, abis.Erc20issue);
};
