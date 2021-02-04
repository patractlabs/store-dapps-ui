import { useContract } from '@patract/react-hooks';
import Factory from '../contracts/factory.json';

export const useFactoryContract = () => {
  return useContract('5Gi9W8XGigJWAQRY4FhzvF1eotZYohhaoKVb7N1wSmqxWJbH', Factory);
};
