import { useContract } from '@patract/react-hooks';
import LPtoken from '../contracts/lpt.json';

export const useLPtokenContract = () => {
  return useContract('5HXBBSg9gi2aPPrTdtMLdjXknneo6xNuqMJ8JXuyb8TwNfvp', LPtoken);
};
