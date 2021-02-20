import { useContract } from '@patract/react-hooks';
import Factory from '../contracts/factory.json';

export const useFactoryContract = () => {
  return useContract('5HBv8M3cmQvS5CWBaJSitwwvvKxYDmconuupEPLzFvMKqe89', Factory);
};
