import { useContract } from '@patract/react-hooks';
import Lottery from '@patract/utils/contracts/patralottery.json';
import { PatraLottery } from '@patract/utils';

export const useLottery = () => {
  return useContract(PatraLottery, Lottery);
};
