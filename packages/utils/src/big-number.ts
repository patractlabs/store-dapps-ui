import { parseFixed, formatFixed } from '@ethersproject/bignumber';
import { isHex, hexToBn, isNumber } from '@polkadot/util';

export const parseAmount = (value: string, decimals = 10): string => {
  const bn = parseFixed(value, decimals);
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
