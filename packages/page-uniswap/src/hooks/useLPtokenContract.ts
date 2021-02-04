import { useContract } from '@patract/react-hooks';
import LPtoken from '../contracts/lpt.json';

export const useLPtokenContract = () => {
  return useContract('5FQskjNMEALcXg3qx3KK2RbT38WE5GmzcZ2GrijMF1ckdqDC', LPtoken);
};
