import { useContract } from '@patract/react-hooks';
import { PatraPK } from '@patract/utils';
import PK from '../contracts/pk.json';

export const usePkContract = () => {
  return useContract(PatraPK, PK);
};
