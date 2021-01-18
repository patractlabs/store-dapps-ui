import type { ApiProps } from '@polkadot/react-api/types';

import { useContext } from 'react';

import { ApiContext } from '@polkadot/react-api';

export function useApi(): ApiProps {
  return useContext(ApiContext);
}
