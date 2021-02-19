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
