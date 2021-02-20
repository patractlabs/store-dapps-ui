import { useContract } from '@patract/react-hooks';
import PK from '../contracts/pk.json';

export const usePkContract = () => {
  return useContract('5DkPJueCHTqyVjRUsZnD1HzvtrscESZc3utXR7PCoz4MSNQZ', PK);
};
