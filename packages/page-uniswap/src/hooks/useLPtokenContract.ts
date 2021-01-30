import { useContract } from '@patract/react-hooks';
import LPtoken from '../contracts/lpt.json';

export const useLPtokenContract = () => {
  return useContract('5HjVvMBRfpv925ZWNkbYC3Gepuu55zuBmBqTsjZeuMVE293N', LPtoken);
};
