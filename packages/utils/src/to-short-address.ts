import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

export const toShortAddress = (_address?: AccountId | AccountIndex | Address | string | null | Uint8Array): string => {
  const address = (_address || '').toString();

  return address.length > 13 ? `${address.slice(0, 6)}…${address.slice(-6)}` : address;
};
