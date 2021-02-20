import { useContract } from '@patract/react-hooks';
import Maker from '../contracts/maker.json';

export const useMakerContract = () => {
  return useContract('5CHwBvsyCbTKSo8xV9uezj78YmdL5wHs39CHSTnjmjZ5dSPH', Maker);
};
