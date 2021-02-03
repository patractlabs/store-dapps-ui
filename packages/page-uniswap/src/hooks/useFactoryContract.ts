import { useContract } from '@patract/react-hooks';
import Factory from '../contracts/factory.json';

export const useFactoryContract = () => {
  return useContract('5G252cTNAheNMwsR6L5CCwjgWYRjDvPbK2pUaBCCzewH9e7b', Factory);
};
