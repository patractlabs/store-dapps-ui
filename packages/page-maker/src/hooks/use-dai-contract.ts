import { useContract } from '@patract/react-hooks';
import ERC20 from '../contracts/erc20_issue.json';

export const useDaiContract = () => {
  return useContract('5Dd8Ubgsd9Yzh9Af2jhjjGQNmmuoUgrJPGSA7ieAJkj9KTRX', ERC20);
};
