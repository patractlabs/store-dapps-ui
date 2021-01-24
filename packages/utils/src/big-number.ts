import { parseFixed, formatFixed } from '@ethersproject/bignumber';

export const parseAmount = (value: string): string => {
  const bn = parseFixed(value, 10);
  return bn.toString();
};

export const formatAmount = (value: string): string => {
  return formatFixed(value, 10);
};
