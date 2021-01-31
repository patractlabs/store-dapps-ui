import { decodeAddress } from '@polkadot/util-crypto';

export const isAddress = (address: string): boolean => {
  try {
    decodeAddress(address);
    return true;
  } catch {
    return false;
  }
};
