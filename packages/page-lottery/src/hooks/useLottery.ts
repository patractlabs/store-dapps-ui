import { useContract } from '@patract/react-hooks';
import Lottery from '../contracts/lottery.json';

export const useLottery = () => {
  return useContract('5EtKbgEJGpKWBJUii5TerFZRbWpZcbVupqn8k6dX3wz4xCk5', Lottery);
};
