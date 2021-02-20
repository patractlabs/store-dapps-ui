import { TrProps } from '../types';

interface TableProps {
  head: string[];
  body: TrProps[];
}

export const useMy = (): TableProps => {
  return {
    head: ['Epoch ID', 'Randoam Number', 'My Number', 'Tickets', 'Reward(DOT)'],
    body: [{ epoch: 918, random: '0x000', lottery: [1, 4, 7], reward: 9, tickets: 3 }]
  };
};

export const useBig = (): TableProps => {
  return {
    head: ['Epoch ID', 'Buyer Account', 'Number', 'Tickets', 'Reward(DOT)'],
    body: [{ epoch: 918, ident: '0x000', lottery: [1, 4, 7], reward: 9, tickets: 3 }]
  };
};

export const useHis = (): TableProps => {
  return {
    head: ['Epoch ID', 'BABE Random Number', 'Lottery', 'Buyer', 'Pool In(DOT)', 'Pool Out(DOT)', 'Operation'],
    body: [{ epoch: 918, random: '0x000', lottery: [1, 4, 7], buyer: 10, poolIn: 9, poolOut: 3, operation: 'close' }]
  };
};
