import React from 'react';

export interface TableProps {
  head: string[];
  body: TrProps[];
  height?: string;
  width?: string;
  title: string;
  onChange?: (page: number) => void;
}

export interface TrProps {
  epoch: number;
  random?: string;
  ident?: string;
  lottery: number[];
  reward?: number;
  tickets?: number;
  buyer?: number;
  poolIn?: number;
  poolOut?: number;
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
  myNum: number[];
  buyer: number;
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
  winner: string;
  winNum: number[];
  tickets: number;
  reward: number;
}

export interface Tickets {
  num: number[];
  amount: number;
  reward: number;
  rank: number;
}
