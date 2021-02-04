import { useContract } from '@patract/react-hooks';
import PK from '../contracts/pk.json';

export const usePkContract = () => {
  return useContract('5DwFpmu5Fi8Uu5Cu4Wkw1UnnnkGu5nSe486LAma9rjoSP6KK', PK);
};
