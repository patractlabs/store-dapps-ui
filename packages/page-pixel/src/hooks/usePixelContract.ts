import { useContract } from '@patract/react-hooks';
import Pixel from '../contracts/pixel.json';

export const usePixelContract = () => {
  return useContract('5CDEUV84kXNjqjbXcmVLz9T1SW9c9Y6QJwDqjR9fSGJopLS7', Pixel);
};
