import { useContract } from '@patract/react-hooks';
import Lottery from '../contracts/lottery.json';

export const useLottery = () => {
  return useContract('5FWmurGYTNyqVMKnY9stU9TWt1C3L8yquk3iCzhbwa5xeY5b', Lottery);
};
