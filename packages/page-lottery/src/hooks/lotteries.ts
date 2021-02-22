import { TrProps } from '../types';

interface TableProps {
  head: string[];
  body: TrProps[];
}

export const useMy = (body: TrProps[]): TableProps => {
  return {
    head: ['Epoch ID', 'Randoam Number', 'My Number', 'Tickets', 'Reward(DOT)'],
    body
  };
};

export const useBig = (body: TrProps[]): TableProps => {
  return {
    head: ['Epoch ID', 'Buyer Account', 'Number', 'Tickets', 'Reward(DOT)'],
    body
  };
};

export const useHis = (body: TrProps[]): TableProps => {
  return {
    head: ['Epoch ID', 'BABE Random Number', 'Lottery', 'Buyer', 'Pool In(DOT)', 'Pool Out(DOT)', 'Operation'],
    body
  };
};
