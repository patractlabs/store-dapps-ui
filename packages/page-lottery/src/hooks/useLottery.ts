import { useContract } from '@patract/react-hooks';
import Lottery from '../contracts/lottery.json';

export const useLottery = () => {
  return useContract('5DYvhVPkjTJdbQNz66kza3e2Cn7XvxBpR4F1s1si9Vd96wFh', Lottery);
};
