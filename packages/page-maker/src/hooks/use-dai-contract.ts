import { useContract } from '@patract/react-hooks';
import ERC20 from '@patract/utils/contracts/erc20mintable.json';
import { DAI } from '@patract/utils';

export const useDaiContract = () => {
  return useContract(DAI, ERC20);
};
