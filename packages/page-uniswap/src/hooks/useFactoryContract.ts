import { useContract } from '@patract/react-hooks';
import Factory from '../contracts/factory.json';

export const useFactoryContract = () => {
  return useContract('5GrUbDUnghS5p2cG5WXTSWoKpsjn6kPziKkYK68UwMBFNNQV', Factory);
};
