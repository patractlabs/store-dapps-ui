import { useContract } from '@patract/react-hooks';
import PK from '../contracts/pk.json';

export const usePkContract = () => {
  return useContract('5G2wRyKpCDgAvzDFmHWvfZLJwD96eVAWqEf4Hx4PuQg8Muh3', PK);
};
