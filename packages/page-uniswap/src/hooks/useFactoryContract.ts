import { useContract } from '@patract/react-hooks';
import Factory from '../contracts/factory.json';

export const useFactoryContract = () => {
  return useContract('5C8pqeB3Cj1ePZm49D1wFwHAJtZARviCGhXkpGtSJSmdgHm7', Factory);
};
