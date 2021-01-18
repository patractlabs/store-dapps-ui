import { ApiContext } from '@patract/react-components/api/api-context';
import type { ApiProps } from '@patract/react-components/api/types';
import { useContext } from 'react';

export function useApi(): ApiProps {
  return useContext(ApiContext);
}
