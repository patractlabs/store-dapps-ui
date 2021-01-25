import type { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import type { Option } from './types';

import React from 'react';

import KeyPair from './KeyPair';

export default function createItem(option: KeyringSectionOption, isUppercase = true): Option {
  return {
    ...option,
    text: <KeyPair address={option.key || ''} isUppercase={isUppercase} name={name} />
  };
}
