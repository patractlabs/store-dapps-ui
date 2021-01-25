import type { KeyringItemType } from '@polkadot/ui-keyring/types';

import { getAddressMeta } from './get-address-meta';
import { toShortAddress } from './to-short-address';

// isName, isDefault, name
export const getAddressName = (
  address: string,
  type: KeyringItemType | null = null,
  defaultName?: string
): [boolean, boolean, string] => {
  const meta = getAddressMeta(address, type);

  return meta.name
    ? [false, false, meta.name.toUpperCase()]
    : defaultName
    ? [false, true, defaultName.toUpperCase()]
    : [true, false, toShortAddress(address)];
};
