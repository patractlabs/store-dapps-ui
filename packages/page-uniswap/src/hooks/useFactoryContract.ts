import { useContract } from '@patract/react-hooks';
import Factory from '../contracts/factory.json';

export const useFactoryContract = () => {
  return useContract('5H2Xf47JxdgTJkAw19XcHqaZouJJeKxyaiezbh1NGew3V4LL', Factory);
};
