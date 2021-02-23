import { useContract } from '@patract/react-hooks';
import Lottery from '../contracts/lottery.json';
import { PatraLottery } from '@patract/utils';

export const useLottery = () => {
  return useContract(PatraLottery, Lottery);
};
