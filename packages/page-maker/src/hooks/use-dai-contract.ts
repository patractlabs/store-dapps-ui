import { useContract } from '@patract/react-hooks';
import ERC20 from '../contracts/erc20_issue.json';
import { DAI } from '@patract/utils';

export const useDaiContract = () => {
  return useContract(DAI, ERC20);
};
