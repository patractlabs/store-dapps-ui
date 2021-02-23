import React from 'react';

export interface TableProps {
  head: string[];
  body: TrProps[];
  height?: string;
  width?: string;
  title: string;
  pagin?: boolean;
  limit?: number;
  onChange?: (page: number) => void;
  current_epoch: number;
  winnerMap: Record<string, number[]>;
}

export interface TrProps {
  epoch_id: number;
  random?: string;
  ident?: string;
  my_num: number[];
  reward?: number;
  tickets?: number;
  buyers?: string[];
  pool_in?: number;
  pool_out?: number;
  operation?: string;
}

export interface FooCardProps {
  title: string;
  titleColor: string;
  contentColor: string;
  content: React.ReactElement;
}

/**
 *  Contract API types
 **/

export interface BuyTickets {
  ticketNum: number[];
  amount: number;
  epoch: number;
}

export interface DrawLottery {
  epoch: number;
  randomness: string;
  winNum: number[];
}

export interface Lottery {
  random: string;
  winNum: number[];
  buyers: string[];
  poolIn: number;
  poolOut: number;
  end: boolean;
}

export interface MyLottery {
  epochId: number;
  random: string;
  myNum: number[];
  tickets: number;
  reward: number;
}

export interface EpochHistory {
  epoch_id: number;
  random: string;
  win_num: number[];
  buyer: string[];
  pool_in: number;
  pool_out: number;
}

export interface EpochInfo {
  epochId: number;
  startSlot: number;
  duration: number;
  currentBlock: number;
  rewardPool: number;
}

export interface BiggestWinner {
  epoch_id: string;
  winner: string;
  win_num: number[];
  tickets: number;
  reward: number;
}

export interface Tickets {
  num: number[];
  amount: number;
  reward: number;
  rank: number;
}
