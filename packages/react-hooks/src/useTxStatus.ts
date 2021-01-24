import { StatusContext } from '@patract/react-components';
import type { QueueProps } from '@patract/react-components/status/types';
import { useContext } from 'react';

export function useTxStatus(): QueueProps {
  return useContext(StatusContext);
}
