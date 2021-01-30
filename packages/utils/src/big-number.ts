import { parseFixed, formatFixed } from '@ethersproject/bignumber';
import { isHex, hexToBn, isNumber } from '@polkadot/util';

export const parseAmount = (value: string): string => {
  const bn = parseFixed(value, 10);
  return bn.toString();
};

export const formatAmount = (value: string | number, decimals = 10): string => {
  if (isHex(value)) {
    value = hexToBn(value).toString();
  }
  if (isNumber(value)) {
    value = value.toString();
  }
  return formatFixed(value, decimals);
};
