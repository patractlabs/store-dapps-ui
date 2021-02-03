import { BigNumber, FixedNumber, formatFixed, parseFixed } from '@ethersproject/bignumber';
import { hexToBn, isHex, isNumber } from '@polkadot/util';
import BN from 'bn.js';

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

export const toFixed = (value: string | number | FixedNumber, decimals: number, withDecimals = false) => {
  if (withDecimals) {
    if (typeof value === 'number') {
      return FixedNumber.from(value.toFixed(18));
    } else {
      return FixedNumber.from(value.toString());
    }
  }
  let bn: BN;
  if (FixedNumber.isFixedNumber(value)) {
    return value;
  }
  if (isHex(value)) {
    bn = hexToBn(value);
  } else {
    bn = new BN(value);
  }
  return FixedNumber.fromValue(BigNumber.from(bn.toString()), decimals);
};

export { FixedNumber } from '@ethersproject/bignumber';
