import { useContract } from '@patract/react-hooks';
import PK from '../contracts/pk.json';

export const usePkContract = () => {
  return useContract('5FKU3eEAEKnb1RPEyaN4KEruosucgYVCXDxEcn89jT3gqKru', PK);
};
